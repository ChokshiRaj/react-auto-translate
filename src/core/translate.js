import { translateWithGoogle } from '../engines/google.js';
import { translateWithLibre } from '../engines/libre.js';
import { translateWithMyMemory } from '../engines/mymemory.js';
import { cache } from './cache.js';

export const translateBatch = async (texts, targetLang) => {
  if (!texts.length) return [];
  if (targetLang === 'en' || !targetLang) return texts;

  const results = new Array(texts.length).fill(null);
  const toTranslate = [];
  const indices = [];

  // 1. Check Cache first
  texts.forEach((text, i) => {
    const cached = cache.get(text, targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      toTranslate.push(text);
      indices.push(i);
    }
  });

  if (toTranslate.length === 0) return results;

  // 2. Try Engines in sequence (Fallback system)
  let translatedBatch = null;
  const engines = [
    translateWithGoogle,
    translateWithMyMemory,
    translateWithLibre
  ];

  for (const engine of engines) {
    try {
      translatedBatch = await engine(toTranslate, targetLang);
      if (translatedBatch && translatedBatch.length === toTranslate.length) {
        break;
      }
    } catch (e) {
      console.warn(`Engine ${engine.name} failed, trying next...`);
    }
  }

  if (!translatedBatch) {
    console.error('All translation engines failed');
    return results.map((res, i) => res || texts[i]); // Return original if all fail
  }

  // 3. Update Cache & Final Results
  translatedBatch.forEach((tText, i) => {
    const originalIndex = indices[i];
    cache.set(texts[originalIndex], targetLang, tText);
    results[originalIndex] = tText;
  });

  return results;
};
