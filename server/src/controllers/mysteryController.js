import mongoose from 'mongoose';
import { Mystery } from '../models/Mystery.js';
import { Attempt } from '../models/Attempt.js';
import { createGeneratedMystery } from '../services/mystery/mysteryGenerationService.js';
import { createMysterySchema, accusationSchema } from '../validators/mysterySchemas.js';
import { AppError } from '../utils/errors.js';

const publicMystery = (m, attempt = null) => ({
  id: String(m._id), title: m.title, premise: m.premise, genre: m.genre, difficulty: m.difficulty, status: attempt ? 'COMPLETED' : m.status,
  incident: m.incident, suspects: m.suspects, timeline: m.timeline, evidence: m.evidence.map(({ supportsFacts, ...e }) => e), createdAt: m.createdAt,
});
const validObjectId = id => mongoose.isValidObjectId(id);

export async function createMystery(req, res) {
  const input = createMysterySchema.safeParse(req.body);
  if (!input.success) throw new AppError(400, 'VALIDATION_ERROR', 'Enter a premise between 30 and 2,000 characters and choose valid case settings.');
  const data = await createGeneratedMystery(input.data);
  const m = await Mystery.create({ ...data, ownerSessionId: req.sessionId, genre: input.data.genre, difficulty: input.data.difficulty, premise: data.premise || input.data.premise });
  res.status(201).json({ success: true, data: { mystery: { id: String(m._id), title: m.title, genre: m.genre, difficulty: m.difficulty, status: m.status } } });
}

export async function listMysteries(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
  const [items, total] = await Promise.all([Mystery.find({ ownerSessionId: req.sessionId }).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit), Mystery.countDocuments({ ownerSessionId: req.sessionId })]);
  const attempts = await Attempt.find({ ownerSessionId: req.sessionId, mysteryId: { $in: items.map(m => m._id) } }).select('mysteryId');
  const completed = new Set(attempts.map(a => String(a.mysteryId)));
  res.json({ success: true, data: { mysteries: items.map(m => ({ id: String(m._id), title: m.title, genre: m.genre, difficulty: m.difficulty, status: completed.has(String(m._id)) ? 'COMPLETED' : m.status, createdAt: m.createdAt })), pagination: { page, limit, total } } });
}

export async function getMystery(req, res) {
  if (!validObjectId(req.params.id)) throw new AppError(404, 'NOT_FOUND', 'This case file could not be found.');
  const m = await Mystery.findOne({ _id: req.params.id, ownerSessionId: req.sessionId });
  if (!m) throw new AppError(404, 'NOT_FOUND', 'This case file could not be found.');
  const attempt = await Attempt.findOne({ mysteryId: m._id, ownerSessionId: req.sessionId });
  res.json({ success: true, data: { mystery: publicMystery(m, attempt) } });
}

export async function submitAccusation(req, res) {
  if (!validObjectId(req.params.id)) throw new AppError(404, 'NOT_FOUND', 'This case file could not be found.');
  const body = accusationSchema.safeParse(req.body);
  if (!body.success) throw new AppError(400, 'VALIDATION_ERROR', 'Select a valid suspect before submitting your accusation.');
  const m = await Mystery.findOne({ _id: req.params.id, ownerSessionId: req.sessionId }).select('+privateSolution');
  if (!m) throw new AppError(404, 'NOT_FOUND', 'This case file could not be found.');
  if (!m.suspects.some(s => s.id === body.data.suspectId)) throw new AppError(400, 'INVALID_SUSPECT', 'That suspect is not part of this case.');
  if (await Attempt.exists({ mysteryId: m._id, ownerSessionId: req.sessionId })) throw new AppError(409, 'ATTEMPT_ALREADY_SUBMITTED', 'Your accusation has already been submitted.');
  const isCorrect = body.data.suspectId === m.privateSolution.culpritSuspectId;
  let attempt;
  try { attempt = await Attempt.create({ mysteryId: m._id, ownerSessionId: req.sessionId, selectedSuspectId: body.data.suspectId, isCorrect, resultSummary: isCorrect ? 'Correct accusation.' : 'Incorrect accusation.' }); }
  catch (e) { if (e.code === 11000) throw new AppError(409, 'ATTEMPT_ALREADY_SUBMITTED', 'Your accusation has already been submitted.'); throw e; }
  await Mystery.updateOne({ _id: m._id }, { $set: { status: 'COMPLETED' } });
  const solution = m.privateSolution.toObject ? m.privateSolution.toObject() : m.privateSolution;
  res.json({ success: true, data: { attempt: { isCorrect, selectedSuspectId: attempt.selectedSuspectId }, solution: { culpritSuspectId: solution.culpritSuspectId, narrative: solution.narrative, decisiveEvidenceIds: solution.decisiveEvidenceIds, redHerringExplanations: solution.redHerringExplanations } } });
}

export async function getResult(req, res) {
  if (!validObjectId(req.params.id)) throw new AppError(404, 'NOT_FOUND', 'This case file could not be found.');
  const [m, attempt] = await Promise.all([Mystery.findOne({ _id: req.params.id, ownerSessionId: req.sessionId }).select('+privateSolution'), Attempt.findOne({ mysteryId: req.params.id, ownerSessionId: req.sessionId })]);
  if (!m || !attempt) throw new AppError(404, 'NOT_FOUND', 'Submit an accusation before opening the case result.');
  const solution = m.privateSolution.toObject ? m.privateSolution.toObject() : m.privateSolution;
  const selectedSuspectName = m.suspects.find(s => s.id === attempt.selectedSuspectId)?.name || 'Unknown';
  const culpritName = m.suspects.find(s => s.id === solution.culpritSuspectId)?.name || 'Unknown';
  res.json({ success: true, data: { attempt: { isCorrect: attempt.isCorrect, selectedSuspectId: attempt.selectedSuspectId, selectedSuspectName, submittedAt: attempt.submittedAt }, solution: { ...solution, culpritName }, mystery: publicMystery(m, attempt) } });
}
