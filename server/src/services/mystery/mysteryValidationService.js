import { generatedMysterySchema } from '../../validators/mysterySchemas.js';

export function validateMystery(raw) {
  const parsed = generatedMysterySchema.safeParse(raw);
  if (!parsed.success) return { valid: false, errors: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) };
  const m = parsed.data;
  const unique = (xs) => new Set(xs).size === xs.length;
  const suspectIds = m.suspects.map(s => s.id), evidenceIds = m.evidence.map(e => e.id), timelineIds = m.timeline.map(t => t.id);
  if (!unique(suspectIds) || !unique(evidenceIds) || !unique(timelineIds)) return { valid: false, errors: ['IDs must be unique within each collection.'] };
  const suspectSet = new Set(suspectIds), evidenceSet = new Set(evidenceIds);
  if (!suspectSet.has(m.privateSolution.culpritSuspectId)) return { valid: false, errors: ['The culprit must exist in the suspect list.'] };
  if (new Set(m.evidence.flatMap(e => e.relatedSuspectIds)).size > 0 && m.evidence.some(e => e.relatedSuspectIds.some(id => !suspectSet.has(id)))) return { valid: false, errors: ['Evidence references an unknown suspect.'] };
  if (m.timeline.some(t => t.suspectIds.some(id => !suspectSet.has(id)) || t.evidenceIds.some(id => !evidenceSet.has(id)))) return { valid: false, errors: ['Timeline references an unknown suspect or evidence item.'] };
  if (m.evidence.some(e => e.relatedSuspectIds.some(id => !suspectSet.has(id)))) return { valid: false, errors: ['Evidence references an unknown suspect.'] };
  if (m.privateSolution.decisiveEvidenceIds.some(id => !evidenceSet.has(id)) || m.privateSolution.redHerringExplanations.some(x => !evidenceSet.has(x.evidenceId))) return { valid: false, errors: ['The solution references missing evidence.'] };
  const meaningful = m.evidence.filter(e => e.clueKind === 'DIRECT' || e.clueKind === 'INDIRECT');
  if (meaningful.length < 3 || new Set(m.privateSolution.decisiveEvidenceIds).size < 3) return { valid: false, errors: ['At least three meaningful and decisive clues are required.'] };
  const dates = m.timeline.map(t => new Date(t.timestamp).getTime());
  if (dates.some((d, i) => i > 0 && d < dates[i-1])) return { valid: false, errors: ['Timeline events must be in chronological order.'] };
  return { valid: true, data: m };
}
