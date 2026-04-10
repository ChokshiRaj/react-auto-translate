import { translateBatch } from './translate.js';

const SKIP_TAGS = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'IFRAME', 'CANVAS', 'SVG'];

class DomTranslator {
  constructor() {
    this.originalContent = new Map(); // TextNode -> Original String
    this.isTranslating = false;
    this.observer = null;
    this.currentLang = 'en';
  }

  // Find all text nodes in an element
  getTextNodes(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (SKIP_TAGS.includes(n.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        if (!n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let n;
    while (n = walk.nextNode()) {
      textNodes.push(n);
    }
    return textNodes;
  }

  async translatePage(targetLang) {
    if (this.currentLang === targetLang && !this.isTranslating) return;
    this.currentLang = targetLang;
    
    const nodes = this.getTextNodes(document.body);
    
    // 1. Collect text and store originals
    const textToTranslate = [];
    const nodesToUpdate = [];

    nodes.forEach(node => {
      let original = this.originalContent.get(node);
      if (!original) {
        original = node.textContent;
        this.originalContent.set(node, original);
      }
      
      if (targetLang === 'en') {
        node.textContent = original;
      } else {
        textToTranslate.push(original);
        nodesToUpdate.push(node);
      }
    });

    if (targetLang === 'en' || textToTranslate.length === 0) return;

    // 2. Batch Translate
    this.isTranslating = true;
    try {
      // Chunking if text is too large (e.g. Google has limits)
      const CHUNK_SIZE = 50;
      for (let i = 0; i < textToTranslate.length; i += CHUNK_SIZE) {
        const chunk = textToTranslate.slice(i, i + CHUNK_SIZE);
        const chunkNodes = nodesToUpdate.slice(i, i + CHUNK_SIZE);
        const translated = await translateBatch(chunk, targetLang);
        
        chunkNodes.forEach((node, j) => {
          if (translated[j]) {
            node.textContent = translated[j];
          }
        });
      }
    } finally {
      this.isTranslating = false;
    }
  }

  startObserving(targetLang) {
    if (this.observer) this.observer.disconnect();
    
    this.observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;
      mutations.forEach(m => {
        if (m.addedNodes.length > 0) shouldTranslate = true;
      });

      if (shouldTranslate && targetLang !== 'en') {
        // Debounced re-translation
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.translatePage(targetLang), 500);
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  stopObserving() {
    if (this.observer) this.observer.disconnect();
  }
}

export const domTranslator = new DomTranslator();
