import { generateStructuredMystery } from '../ai/geminiService.js';
import { validateMystery } from './mysteryValidationService.js';
import { AppError } from '../../utils/errors.js';
import { config } from '../../config/env.js';

export async function createGeneratedMystery(input) {
  const prompt = `Create a completely fictional and internally consistent detective mystery as valid JSON. Return ONLY JSON with this exact shape: {"title":"","premise":"","incident":{"description":"","location":"","occurredAt":"ISO date"},"suspects":[{"id":"suspect-01","name":"","role":"","background":"","motive":"","publicAlibi":""}],"timeline":[{"id":"event-01","timestamp":"ISO date","description":"","suspectIds":[],"evidenceIds":[]}],"evidence":[{"id":"evidence-01","type":"CHAT_MESSAGES|PHOTOGRAPHS|WITNESS_STATEMENTS|TIMELINE_LOGS|SURVEILLANCE|DOCUMENTS","title":"","description":"","source":"","occurredAt":"ISO date","relatedSuspectIds":[],"clueKind":"DIRECT|INDIRECT|MISLEADING|CONTEXTUAL","supportsFacts":["canonical fact"]}],"privateSolution":{"culpritSuspectId":"suspect-01","narrative":"","decisiveEvidenceIds":["evidence-01"],"redHerringExplanations":[{"evidenceId":"evidence-02","explanation":""}]}}. Requirements: premise=${JSON.stringify(input.premise)}; genre=${input.genre}; difficulty=${input.difficulty}; requested evidence=${input.evidencePreferences.join(', ') || 'your choice'}. Make 3-6 suspects, preferably 3 for EASY, 4-5 for MEDIUM and 5-6 for HARD. Produce 6-14 evidence items, at least three direct/indirect clues, at least one plausible explainable red herring, 4-16 chronologically sorted events, and exactly one culprit. Link all suspect and evidence IDs correctly. Every suspect, event and clue must follow one canonical truth; the solution must be deducible using only the public evidence. Give at least three decisive evidence IDs and an explanation for a red herring. Keep suspect descriptions player-safe and do not reveal the culprit in public fields. No graphic detail, real people, real private information, stereotypes, or real-looking claims. Use dates near 2025, in ISO-8601. The premise field should be a polished one-paragraph summary of the generated case.`;
  let lastErrors = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await generateStructuredMystery(attempt ? `${prompt}\n\nThe previous output failed these checks: ${lastErrors.join('; ')}. Regenerate a corrected complete mystery.` : prompt);
    const checked = validateMystery(raw);
    if (checked.valid) return { ...checked.data, generationMetadata: { model: config.geminiModel, promptVersion: '1.0.0', generationStatus: 'VALIDATED' } };
    lastErrors = checked.errors;
  }
  throw new AppError(502, 'INVALID_AI_OUTPUT', 'The generated case did not pass consistency checks. Please try again.');
}
