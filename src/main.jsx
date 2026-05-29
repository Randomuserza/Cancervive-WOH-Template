import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Link2, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';

const STORAGE_KEY = 'infotec-wall-of-hope-functional-v1';

const starterCandles = [
  { id: 1, honoured_name: 'Dad', candle_type: 'In Memory', message: 'Your strength, calm and wisdom still illuminate our lives', from_name: 'Son', colour: 'blue' },
  { id: 2, honoured_name: 'Mom', candle_type: 'In Memory', message: '♥', from_name: '', colour: 'pink' },
  { id: 3, honoured_name: 'Daniel Muller', candle_type: 'In Memory', message: "TFG just isn't the same without you. We miss the laughs, the chaos, our friend and your stupid face. Always remembered. Always missed. Always loved.", from_name: 'From the dark side', colour: 'purple' },
  { id: 4, honoured_name: 'Kayleigh', candle_type: 'In Memory', message: 'The hope and joy that shone through you.', from_name: 'Your milkshake friend', colour: 'purple' },
  { id: 5, honoured_name: 'Those we carry in our hearts', candle_type: 'In Memory', message: 'Gone from our sight, never from our hearts.', from_name: 'We Can Together', colour: 'pink' },
  { id: 6, honoured_name: 'Every Hand That Held Someone Up', candle_type: 'Supporter', message: 'For every person who stood beside a fighter — your love, strength and support mattered more than you know.', from_name: 'With gratitude', colour: 'blue' },
  { id: 7, honoured_name: 'All Survivors', candle_type: 'Survivor', message: 'Your strength lights the way for others', from_name: 'Cancervive Family', colour: 'blue' },
  { id: 8, honoured_name: 'All Warriors', candle_type: 'Warrior', message: 'For every prayer, every smile, and every moment of hope you shared.', from_name: 'With love', colour: 'pink' }
];

function App() {
  const [candles, setCandles] = useState([]);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    honoured_name: '',
    candle_type: 'Warrior',
    message: '',
    from_name: '',
    colour: 'gold'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setCandles(saved ? JSON.parse(saved) : starterCandles);
    } catch {
      setCandles(starterCandles);
    }
  }, []);

  useEffect(() => {
    if (candles.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candles));
    }
  }, [candles]);

  const filteredCandles = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return candles;
    return candles.filter((c) => {
      const text = `${c.honoured_name} ${c.candle_type} ${c.message} ${c.from_name}`.toLowerCase();
      return text.includes(term);
    });
  }, [candles, query]);

  function addCandle(e) {
    e.preventDefault();
    setSubmitted(false);

    const newCandle = {
      id: Date.now(),
      honoured_name: form.honoured_name.trim(),
      candle_type: form.candle_type,
      message: form.message.trim(),
      from_name: form.from_name.trim(),
      colour: form.colour
    };

    if (!newCandle.honoured_name || !newCandle.message) return;

    setCandles([newCandle, ...candles]);
    setForm({
      honoured_name: '',
      candle_type: 'Warrior',
      message: '',
      from_name: '',
      colour: 'gold'
    });
    setSubmitted(true);
  }

  function deleteCandle(id) {
    setCandles(candles.filter((c) => c.id !== id));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="brand-mark">
          <span className="brand-c">C</span><span>ancervive</span>
        </div>

        <div className="hero-hashtag">#WeCanTogetherInfotec</div>

        <div className="hero-grid">
          <div>
            <h1>Infotec Wall of Hope</h1>
            <p>
              A virtual space created as part of #WeCanTogetherInfotec, where we can light a candle
              to honour cancer survivors, warriors, loved ones remembered, and everyone touched by cancer.
            </p>

            <div className="hero-badges">
              <span>{candles.length} candles lit</span>
              <span>Private, gentle and respectful</span>
              <span>Shareable with your community</span>
            </div>
          </div>

          <div className="hero-flame-wrap">
            <AnimatedFlame size="large" colour="pink" />
            <h2>One candle.<br />One name.<br />One moment of love.</h2>
          </div>
        </div>
      </section>

      <section className="app-grid">
        <aside className="form-panel">
          <h2>Light a candle</h2>
          <p className="subtext">Keep the message short, kind and respectful.</p>

          <form onSubmit={addCandle}>
            <label>Name being honoured</label>
            <input
              value={form.honoured_name}
              onChange={(e) => setForm({ ...form, honoured_name: e.target.value })}
              placeholder="Example: Mom, Johan, All survivors..."
            />

            <label>Candle type</label>
            <select
              value={form.candle_type}
              onChange={(e) => setForm({ ...form, candle_type: e.target.value })}
            >
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In Memory</option>
              <option>Supporter</option>
            </select>

            <label>Message</label>
            <textarea
              rows="5"
              maxLength="180"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write a short message..."
            />
            <div className="char-count">{form.message.length}/180</div>

            <label>From / signed by</label>
            <input
              value={form.from_name}
              onChange={(e) => setForm({ ...form, from_name: e.target.value })}
              placeholder="Optional"
            />

            <label>Candle colour</label>
            <div className="colour-options">
              {['pink', 'purple', 'blue', 'gold', 'white'].map((colour) => (
                <button
                  type="button"
                  key={colour}
                  className={form.colour === colour ? 'selected' : ''}
                  onClick={() => setForm({ ...form, colour })}
                >
                  {colour}
                </button>
              ))}
            </div>

            <button className="primary-button" type="submit">Light this candle</button>

            {submitted && <div className="success">Candle added 💗</div>}
          </form>

          <p className="form-note">
            Every candle shared here represents love, remembrance, support and hope.
          </p>
        </aside>

        <section className="wall-area">
          <div className="topbar">
            <div className="search">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candles..."
              />
            </div>
            <button className="copy-button" onClick={copyLink} type="button">
              {copied ? <Check size={15} /> : <Link2 size={15} />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div className="candle-wall" layout>
              {filteredCandles.map((candle) => (
                <CandleCard key={candle.id} candle={candle} onDelete={deleteCandle} />
              ))}
            </motion.div>
          </AnimatePresence>

          {!filteredCandles.length && (
            <div className="empty-state">No candles found. Try another search.</div>
          )}
        </section>
      </section>

      <footer className="footer-panel">
        <div className="footer-hashtag">#WECANTOGETHERINFOTEC</div>
        <h2>No one fights cancer alone.</h2>
        <p>
          Thank you for lighting a candle, sharing a memory, supporting a warrior,
          or simply standing with those affected by cancer.
        </p>

        <div className="footer-buttons">
          <span>Hope</span>
          <span>Support</span>
          <span>Remembrance</span>
          <span>Together</span>
        </div>
      </footer>
    </main>
  );
}

function CandleCard({ candle, onDelete }) {
  return (
    <motion.article
      layout
      className="candle-card"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.22 }}
    >
      <button className="delete-button" onClick={() => onDelete(candle.id)} type="button" title="Delete candle">
        <Trash2 size={13} />
      </button>

      <AnimatedFlame colour={candle.colour} />
      <div className="card-type">{candle.candle_type.toUpperCase()}</div>
      <h3>{candle.honoured_name}</h3>
      <p className="card-message">“{candle.message}”</p>
      {candle.from_name && <p className="signed">{candle.from_name.toUpperCase()}</p>}
    </motion.article>
  );
}

function AnimatedFlame({ colour = 'pink', size = 'small' }) {
  return (
    <motion.div
      className={`flame-icon ${colour} ${size}`}
      animate={{ scale: [1, 1.08, 0.96, 1], rotate: [-2, 2, -1, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
    >
      <span />
    </motion.div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
