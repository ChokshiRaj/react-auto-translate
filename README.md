# react-auto-translate-widget 🌐

A high-performance React NPM package that adds a floating language switcher widget to any React website and translates the entire page dynamically into multiple Indian languages within ~1 second.

## ✨ Features

- **Floating Widget UI**: Modern, glassmorphic design with smooth animations.
- **Dynamic Translation**: Scans and translates visible text elements (`h1, h2, p, span, button, a`).
- **Batch Processing**: Groups text into array requests for extreme speed.
- **Dual-Layer Caching**:
  - **L1**: In-memory JavaScript Map for zero-latency retrieval.
  - **L2**: `localStorage` persistence for returning visitors.
- **Resilient Engine**: Automatic fallback between Google Translate, MyMemory, and LibreTranslate.
- **Live Updates**: Uses `MutationObserver` to translate dynamically added content.
- **Lightweight**: Minimal dependencies, optimized for production.

## 🚀 Installation

```bash
npm install react-auto-translate-widget
```

## 🛠️ Usage

Simply import the `TranslatorWidget` and place it at the root of your app (e.g., in `App.js`).

```jsx
import { TranslatorWidget } from "react-auto-translate-widget";

function App() {
  return (
    <div className="App">
      <TranslatorWidget 
        defaultLang="en" 
        brandName="YourBrand" 
      />
      
      <header>
        <h1>Welcome to Incredible India</h1>
        <p>Explore the vibrant culture and heritage.</p>
      </header>
      
      <main>
        <section>
          <h2>Our Services</h2>
          <button>Get Started</button>
        </section>
      </main>
    </div>
  );
}
```

## ⚙️ Configuration (Props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultLang` | `string` | `'en'` | Initial language code (hi, gu, mr, ta, te). |
| `brandName` | `string` | `'Antigravity'` | Branding text shown at the bottom of the widget. |

## 🌏 Supported Languages

- English (en)
- Hindi (hi)
- Gujarati (gu)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)

## 🏗️ Architecture

- **`src/core/cache.js`**: Logic for L1/L2 caching.
- **`src/core/batch.js`**: DOM scanning and update engine.
- **`src/engines/`**: Individual adapter logic for different translation providers.
- **`src/widget/`**: React UI components and styles.

## ⚠️ Performance Tips

The widget uses intelligent batching. For the best experience:
1. Ensure your page uses semantic HTML.
2. The first translation for a user might take ~1s depending on page size.
3. Subsequent loads/switches are near-instant (0-5ms) due to caching.

## 📄 License

MIT © Antigravity
