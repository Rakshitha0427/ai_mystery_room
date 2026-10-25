import test from 'node:test';
import assert from 'node:assert/strict';
import { createMysterySchema, generatedMysterySchema } from '../src/validators/mysterySchemas.js';
import { validateMystery } from '../src/services/mystery/mysteryValidationService.js';

test('creation schema enforces premise length and supported options', () => {
  assert.equal(createMysterySchema.safeParse({ premise: 'A sufficiently detailed fictional mystery premise.', genre: 'THEFT', difficulty: 'MEDIUM', evidencePreferences: [] }).success, true);
  assert.equal(createMysterySchema.safeParse({ premise: 'too short', genre: 'THEFT', difficulty: 'MEDIUM', evidencePreferences: [] }).success, false);
  assert.equal(createMysterySchema.safeParse({ premise: 'A sufficiently detailed fictional mystery premise.', genre: 'UNKNOWN', difficulty: 'MEDIUM', evidencePreferences: [] }).success, false);
});

test('structured output rejects missing required properties and bad timestamps', () => {
  assert.equal(generatedMysterySchema.safeParse({}).success, false);
});

test('consistency validation rejects duplicate IDs and unresolved references', () => {
  const sample = {
    title: 'The Quiet Archive', premise: 'A fictional mystery at an archive.',
    incident: { description: 'A ledger disappears.', location: 'North Archive', occurredAt: '2025-02-01T10:00:00Z' },
    suspects: [
      { id: 'suspect-01', name: 'Avery Cole', role: 'Archivist', background: 'Works in the archive.', motive: 'A promotion.', publicAlibi: 'In the reading room.' },
      { id: 'suspect-02', name: 'Morgan Lee', role: 'Curator', background: 'Catalogues collections.', motive: 'A grant.', publicAlibi: 'At the front desk.' },
      { id: 'suspect-03', name: 'Riley Park', role: 'Visitor', background: 'A researcher.', motive: 'A family history.', publicAlibi: 'In the lobby.' },
    ],
    timeline: [
      { id: 'event-01', timestamp: '2025-02-01T10:00:00Z', description: 'The archive opens.', suspectIds: [], evidenceIds: ['evidence-01'] },
      { id: 'event-02', timestamp: '2025-02-01T10:10:00Z', description: 'A visitor arrives.', suspectIds: ['suspect-03'], evidenceIds: ['evidence-02'] },
      { id: 'event-03', timestamp: '2025-02-01T10:20:00Z', description: 'The ledger is missing.', suspectIds: ['suspect-01'], evidenceIds: ['evidence-03'] },
      { id: 'event-04', timestamp: '2025-02-01T10:30:00Z', description: 'Staff compare notes.', suspectIds: ['suspect-02'], evidenceIds: ['evidence-04'] },
    ],
    evidence: ['DIRECT','INDIRECT','INDIRECT','MISLEADING','CONTEXTUAL','INDIRECT'].map((clueKind, i) => ({ id: `evidence-0${i+1}`, type: 'DOCUMENTS', title: `Record ${i+1}`, description: 'A fictional record.', source: 'Archive', occurredAt: '2025-02-01T10:00:00Z', relatedSuspectIds: [], clueKind, supportsFacts: ['The archive entry is incomplete.'] })),
    privateSolution: { culpritSuspectId: 'suspect-01', narrative: 'Avery moved the ledger before opening.', decisiveEvidenceIds: ['evidence-01','evidence-02','evidence-03'], redHerringExplanations: [{ evidenceId: 'evidence-04', explanation: 'The record reflects an unrelated grant request.' }] },
  };
  assert.equal(validateMystery(sample).valid, true);
  assert.equal(validateMystery({ ...sample, suspects: [sample.suspects[0], sample.suspects[0], sample.suspects[2]] }).valid, false);
  assert.equal(validateMystery({ ...sample, privateSolution: { ...sample.privateSolution, culpritSuspectId: 'unknown' } }).valid, false);
});
