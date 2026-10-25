import mongoose from 'mongoose';
const attemptSchema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true }, ownerSessionId: { type: String, required: true }, selectedSuspectId: { type: String, required: true }, isCorrect: { type: Boolean, required: true }, status: { type: String, enum: ['COMPLETED'], default: 'COMPLETED' }, submittedAt: { type: Date, default: Date.now }, resultSummary: { type: String, required: true },
}, { timestamps: true });
attemptSchema.index({ mysteryId: 1, ownerSessionId: 1 }, { unique: true });
export const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
