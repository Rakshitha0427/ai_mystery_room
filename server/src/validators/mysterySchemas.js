import { z } from 'zod';

export const genres = ['MURDER_MYSTERY','THEFT','MISSING_OBJECT','CORPORATE_ESPIONAGE','DIGITAL_MYSTERY','GENERAL_DETECTIVE'];
export const difficulties = ['EASY','MEDIUM','HARD'];
export const evidencePreferences = ['CHAT_MESSAGES','PHOTOGRAPHS','WITNESS_STATEMENTS','TIMELINE_LOGS','SURVEILLANCE','DOCUMENTS'];
const id = z.string().regex(/^[a-z0-9-]{2,40}$/i);
const date = z.string().datetime({ offset: true });
const short = (n=300) => z.string().trim().min(1).max(n);

export const createMysterySchema = z.object({
  premise: z.string().trim().min(30).max(2000),
  genre: z.enum(genres),
  difficulty: z.enum(difficulties),
  evidencePreferences: z.array(z.enum(evidencePreferences)).max(6).default([]),
}).strict();

export const generatedMysterySchema = z.object({
  title: short(100), premise: short(2000),
  incident: z.object({ description: short(800), location: short(120), occurredAt: date }).strict(),
  suspects: z.array(z.object({ id, name: short(80), role: short(100), background: short(400), motive: short(300), publicAlibi: short(300) }).strict()).min(3).max(6),
  timeline: z.array(z.object({ id, timestamp: date, description: short(500), suspectIds: z.array(id), evidenceIds: z.array(id) }).strict()).min(4).max(16),
  evidence: z.array(z.object({ id, type: z.enum(evidencePreferences), title: short(120), description: short(1000), source: short(120), occurredAt: date.optional(), relatedSuspectIds: z.array(id), clueKind: z.enum(['DIRECT','INDIRECT','MISLEADING','CONTEXTUAL']), supportsFacts: z.array(short(140)).min(1).max(5) }).strict()).min(6).max(14),
  privateSolution: z.object({ culpritSuspectId: id, narrative: short(1800), decisiveEvidenceIds: z.array(id).min(3).max(8), redHerringExplanations: z.array(z.object({ evidenceId: id, explanation: short(500) }).strict()).min(1).max(5) }).strict(),
}).strict();

export const accusationSchema = z.object({ suspectId: id }).strict();
