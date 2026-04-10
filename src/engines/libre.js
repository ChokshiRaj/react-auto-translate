export const translateWithLibre = async (texts, targetLang) => {
  try {
    // Using a public LibreTranslate instance (might be slow or require API key, but good as fallback)
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: texts,
        source: "auto",
        target: targetLang,
        format: "text"
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error('LibreTranslate failed');
    const data = await response.json();
    return data.translatedText; // Libre batch returns array usually
  } catch (error) {
    console.error('Libre Engine Error:', error);
    throw error;
  }
};
