/*import React, { useState } from 'react';
import './App.css';

const MAX_WORDS = 100;

const BUTTONS = [
  { label: 'Professional', tone: 'professional' },
  { label: 'Friendly', tone: 'friendly' },
  { label: 'Polite', tone: 'polite' },
  { label: 'Funny', tone: 'funny' },
  { label: 'Rude', tone: 'rude' },
  { label: 'Short', tone: 'short' },
];

function App() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount <= MAX_WORDS || value.length < text.length) {
      setText(value);
      setResult(''); // clear stale result whenever text is edited
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // 🔧 Replace this with a real API call when you're ready —
  // this is just a placeholder so the UI has something to show.
  const generateResult = (label) => {
    if (!text.trim()) return '';
    return `${label} version: "${text.trim()}"`;
  };

  const handleClick = (index, label) => {
    setSelected(index);
    setResult(generateResult(label));
  };

  return (
    <div className="page">
      <div className="rectangle">
        <h1 className="title">Rewrite Your Message</h1>

        <textarea
          className="text-input"
          placeholder="Type your sentence here..."
          value={text}
          onChange={handleChange}
        />
        <div className={`word-count ${wordCount >= MAX_WORDS ? 'limit' : ''}`}>
          {wordCount}/{MAX_WORDS} words
        </div>

        <div className="button-grid">
          {BUTTONS.map((btn, i) => (
            <button
              key={i}
              className={`btn btn-${btn.tone} ${selected === i ? 'active' : ''}`}
              onClick={() => handleClick(i, btn.label)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {text.trim() && result && (
          <div className={`result-label result-${BUTTONS[selected].tone}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;*/

import React, { useState } from 'react';
import './App.css';

const MAX_WORDS = 100;
const API_URL = 'http://localhost:5000/api/rewrite';

const BUTTONS = [
  { label: 'Professional', tone: 'professional' },
  { label: 'Friendly', tone: 'friendly' },
  { label: 'Polite', tone: 'polite' },
  { label: 'Funny', tone: 'funny' },
  { label: 'Rude', tone: 'rude' },
  { label: 'Short', tone: 'short' },
];

function App() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount <= MAX_WORDS || value.length < text.length) {
      setText(value);
      setResult('');
      setError('');
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleClick = async (index, label) => {
    if (!text.trim() || loading) return;

    setSelected(index);
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, label }),
      });

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('Could not generate a rewrite. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="rectangle">
        <h1 className="title">Rewrite Your Message</h1>

        <textarea
          className="text-input"
          placeholder="Type your sentence here..."
          value={text}
          onChange={handleChange}
        />
        <div className={`word-count ${wordCount >= MAX_WORDS ? 'limit' : ''}`}>
          {wordCount}/{MAX_WORDS} words
        </div>

        <div className="button-grid">
          {BUTTONS.map((btn, i) => (
            <button
              key={i}
              className={`btn btn-${btn.tone} ${selected === i ? 'active' : ''}`}
              onClick={() => handleClick(i, btn.label)}
              disabled={loading}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {text.trim() && loading && (
          <div className="result-label loading-label">Generating...</div>
        )}

        {text.trim() && error && (
          <div className="result-label error-label">{error}</div>
        )}

        {text.trim() && !loading && result && (
          <div className={`result-label result-${BUTTONS[selected].tone}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

/*import React, { useState } from 'react';
import './App.css';

const MAX_WORDS = 100;

const BUTTONS = [
  { label: 'Professional', tone: 'professional' },
  { label: 'Friendly', tone: 'friendly' },
  { label: 'Polite', tone: 'polite' },
  { label: 'Funny', tone: 'funny' },
  { label: 'Rude', tone: 'rude' },
  { label: 'Short', tone: 'short' },
];

const STATIC_RESPONSES = {
  professional:
    'Our relationship is professional rather than personal.',

  friendly:
    "Haha, we're more like acquaintances than friends! 😊",

  polite:
    "I appreciate you, but I wouldn't describe us as friends.",

  funny:
    "Sorry, my friendship subscription hasn't been activated yet. 😄",

  rude:
    "We're not friends, so don't act like we are.",

  short:
    "We're not friends."
};

function App() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount <= MAX_WORDS || value.length < text.length) {
      setText(value);
      setResult('');
      setError('');
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleClick = (index) => {
    if (!text.trim()) return;

    setSelected(index);
    setResult('');
    setError('');

    const input = text.trim().toLowerCase();

    if (input === 'i am not your friend') {
      const tone = BUTTONS[index].tone;
      setResult(STATIC_RESPONSES[tone]);
    } else {
      setError(
        'Demo mode: Please type "I am not your friend" to see all tone variations.'
      );
    }
  };

  return (
    <div className="page">
      <div className="rectangle">
        <h1 className="title">Rewrite Your Message</h1>

        <textarea
          className="text-input"
          placeholder="Type your sentence here..."
          value={text}
          onChange={handleChange}
        />

        <div
          className={`word-count ${
            wordCount >= MAX_WORDS ? 'limit' : ''
          }`}
        >
          {wordCount}/{MAX_WORDS} words
        </div>

        <div className="button-grid">
          {BUTTONS.map((btn, i) => (
            <button
              key={i}
              className={`btn btn-${btn.tone} ${
                selected === i ? 'active' : ''
              }`}
              onClick={() => handleClick(i)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {text.trim() && error && (
          <div className="result-label error-label">
            {error}
          </div>
        )}

        {text.trim() && result && (
          <div
            className={`result-label result-${BUTTONS[selected].tone}`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;*/