import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, X, Languages } from 'lucide-react';
import { domTranslator } from '../core/batch.js';
import './styles.css';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' }
];

export const TranslatorWidget = ({ defaultLang = 'en', brandName = 'GlobeTranslate' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(defaultLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Initial translation if default is not English
    if (defaultLang !== 'en') {
      handleLanguageChange(defaultLang);
    }

    // Close on outside click
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      domTranslator.stopObserving();
    };
  }, []);

  const handleLanguageChange = async (langCode) => {
    if (langCode === currentLang && !isTranslating) return;
    
    setIsTranslating(true);
    setCurrentLang(langCode);
    
    try {
      await domTranslator.translatePage(langCode);
      domTranslator.startObserving(langCode);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="ratw-widget-container" ref={widgetRef}>
      {isOpen && (
        <div className="ratw-menu">
          <div className="ratw-menu-header">
            Select Language
          </div>
          <div className="ratw-lang-list">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`ratw-lang-item ${currentLang === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span>{lang.native}</span>
                {currentLang === lang.code && <Check size={14} />}
                {currentLang !== lang.code && <span className="ratw-badge">{lang.code.toUpperCase()}</span>}
              </div>
            ))}
          </div>
          <div className="ratw-powered-by">
            Powered by {brandName}
          </div>
        </div>
      )}

      <button 
        className="ratw-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Translate Page"
      >
        {isTranslating ? (
          <div className="ratw-loader">...</div>
        ) : (
          <Globe size={28} />
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ratw-spin {
          to { transform: rotate(360deg); }
        }
        .ratw-loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: ratw-spin 1s linear infinite;
        }
      `}} />
    </div>
  );
};
