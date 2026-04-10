export const translateWithGoogle = async (texts, targetLang) => {
  try {
    // Google gtx batch API (supports multiple query params q=)
    const baseUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + targetLang + '&dt=t';
    
    const results = await Promise.all(texts.map(async (text) => {
      const url = `${baseUrl}&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Google Translate failed');
      const data = await response.json();
      return data[0][0][0];
    }));

    return results;
  } catch (error) {
    console.error('Google Engine Error:', error);
    throw error;
  }
};
