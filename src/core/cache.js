const CACHE_KEY_PREFIX = 'ratw_';

class TranslationCache {
  constructor() {
    this.memoryCache = new Map();
  }

  get(text, lang) {
    const key = `${CACHE_KEY_PREFIX}${text}_${lang}`;
    
    // L1: Memory Cache
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // L2: LocalStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        this.memoryCache.set(key, stored);
        return stored;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    return null;
  }

  set(text, lang, translatedText) {
    const key = `${CACHE_KEY_PREFIX}${text}_${lang}`;
    
    // Save to L1
    this.memoryCache.set(key, translatedText);

    // Save to L2
    try {
      localStorage.setItem(key, translatedText);
    } catch (e) {
      // Handle quota exceeded or private mode
      if (e.name === 'QuotaExceededError') {
        localStorage.clear(); // Simple cleanup
      }
    }
  }

  clear() {
    this.memoryCache.clear();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const cache = new TranslationCache();
