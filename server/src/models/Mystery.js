import mongoose from 'mongoose';

const { Schema } = mongoose;
const suspectSchema = new Schema({ id: { type: String, required: true }, name: { type: String, required: true }, role: { type: String, required: true }, background: { type: String, required: true }, motive: { type: String, required: true }, publicAlibi: { type: String, required: true } }, { _id: false });
const timelineSchema = new Schema({ id: { type: String, required: true }, timestamp: { type: Date, required: true }, description: { type: String, required: true }, suspectIds: [String], evidenceIds: [String] }, { _id: false });
const evidenceSchema = new Schema({ id: { type: String, required: true }, type: { type: String, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, source: { type: String, required: true }, occurredAt: Date, relatedSuspectIds: [String], clueKind: { type: String, required: true }, supportsFacts: [String], media: { kind: { type: String, default: 'NONE' }, status: { type: String, default: 'UNAVAILABLE' }, url: { type: String, default: '' } } }, { _id: false });
const solutionSchema = new Schema({ culpritSuspectId: { type: String, required: true }, narrative: { type: String, required: true }, decisiveEvidenceIds: [String], redHerringExplanations: [{ evidenceId: String, explanation: String }] }, { _id: false });

const mysterySchema = new Schema({
  ownerSessionId: { type: String, required: true, index: true }, title: { type: String, required: true }, premise: { type: String, required: true }, genre: { type: String, required: true }, difficulty: { type: String, required: true }, status: { type: String, enum: ['READY','COMPLETED'], default: 'READY' },
  incident: { description: { type: String, required: true }, location: { type: String, required: true }, occurredAt: { type: Date, required: true } },
  suspects: { type: [suspectSchema], required: true }, timeline: { type: [timelineSchema], required: true }, evidence: { type: [evidenceSchema], required: true }, privateSolution: { type: solutionSchema, required: true, select: false },
  generationMetadata: { model: String, promptVersion: String, generationStatus: String },
}, { timestamps: true });
mysterySchema.index({ ownerSessionId: 1, createdAt: -1 });
export const Mystery = mongoose.models.Mystery || mongoose.model('Mystery', mysterySchema);
