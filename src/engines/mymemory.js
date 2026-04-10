export const translateWithMyMemory = async (texts, targetLang) => {
  try {
    const results = await Promise.all(texts.map(async (text) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('MyMemory failed');
      const data = await response.json();
      return data.responseData.translatedText;
    }));

    return results;
  } catch (error) {
    console.error('MyMemory Engine Error:', error);
    throw error;
  }
};
