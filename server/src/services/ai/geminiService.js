import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.js';
import { AppError } from '../../utils/errors.js';

export async function generateStructuredMystery(prompt) {
  if (!config.geminiApiKey) throw new AppError(503, 'GENERATION_FAILED', 'Mystery generation is not configured yet. Add GEMINI_API_KEY to the server environment.');
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const result = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.7, abortSignal: controller.signal },
    });
    const text = result.text;
    if (!text) throw new Error('Empty model response');
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generation failed:', { name: error?.name, message: error?.message?.slice(0, 200) });
    throw new AppError(502, 'GENERATION_FAILED', 'The case could not be generated right now. Please try again shortly.');
  } finally { clearTimeout(timer); }
}
