import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Flame, Heart, Search, Share2, ShieldCheck, Sparkles, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';

const STORAGE_KEY = 'candle-wall-of-hope-demo-v2';

const starterCandles = [
  {
    id: 1,
    honoured_name: 'All Warriors',
    candle_type: 'Warrior',
    message: 'For every brave soul still fighting. You are stronger than you know.',
    from_name: 'Cancervive Family',
    colour: 'gold',
    created_at: 'Today'
  },
  {
    id: 2,
    honoured_name: 'Every Survivor',
    candle_type: 'Survivor',
    message: 'Your courage lights the way for others.',
    from_name: 'We Can Together',
    colour: 'purple',
    created_at: 'Today'
  },
  {
    id: 3,
    honoured_name: 'Mom',
    candle_type: 'In memory',
    message: 'Forever loved, forever missed, forever carried in our hearts.',
    from_name: 'Family',
    colour: 'pink',
    created_at: 'Today'
  },
  {
    id: 4,
    honoured_name: 'The Supporters',
    candle_type: 'Supporter',
    message: 'For the hands that hold, the hearts that stay, and the love that keeps showing up.',
    from_name: 'Hope Team',
    colour: 'blue',
    created_at: 'Today'
  },
  {
    id: 5,
    honoured_name: 'Those We Remember',
    candle_type: 'In memory',
    message: 'May their light never fade.',
    from_name: '',
    colour: 'white',
    created_at: 'Today'
  }
];

const colourClass = {
  gold: 'flame-gold',
  pink: 'flame-pink',
  purple: 'flame-purple',
  blue: 'flame-blue',
  white: 'flame-white'
};

function App() {
  const [candles, setCandles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
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

  function addCandle(e) {
    e.preventDefault();
    setSubmitted(false);

    const clean = {
      id: Date.now(),
      honoured_name: form.honoured_name.trim(),
      candle_type: form.candle_type,
      message: form.message.trim(),
      from_name: form.from_name.trim(),
      colour: form.colour,
      created_at: 'Just now'
    };

    if (!clean.honoured_name || !clean.message) return;

    setCandles([clean, ...candles]);

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

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setCandles(starterCandles);
    setQuery('');
    setFilter('All');
    setSubmitted(false);
  }

  const filteredCandles = useMemo(() => {
    return candles.filter((c) => {
      const haystack = `${c.honoured_name} ${c.message} ${c.from_name}`.toLowerCase();
      const matchesSearch = haystack.includes(query.toLowerCase());
      const matchesType = filter === 'All' || c.candle_type === filter;
      return matchesSearch && matchesType;
    });
  }, [candles, query, filter]);

  const shareText = encodeURIComponent(
    'I visited the Candle Wall of Hope. Light a candle for someone you love.'
  );

  const counts = useMemo(() => {
    return {
      Warrior: candles.filter((c) => c.candle_type === 'Warrior').length,
      Survivor: candles.filter((c) => c.candle_type === 'Survivor').length,
      'In memory': candles.filter((c) => c.candle_type === 'In memory').length,
      Supporter: candles.filter((c) => c.candle_type === 'Supporter').length
    };
  }, [candles]);

  return (
    <main className="page">
      <div className="background-glow one" />
      <div className="background-glow two" />

      <section className="hero">
        <div className="hero-copy">
          <motion.div
            className="pill"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart size={16} /> We Can Together
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Candle Wall of Hope
          </motion.h1>

          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            Light a candle to honour cancer survivors, warriors, supporters, and the beautiful lives we carry in our hearts.
          </motion.p>

          <div className="stats">
            <span>{candles.length} candles lit</span>
            <span>Demo mode — no database</span>
            <span>Saved only on this browser</span>
          </div>
        </div>

        <motion.div
          className="hero-card"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="big-candle">
            <motion.div
              className="big-flame"
              animate={{ scale: [1, 1.08, 0.96, 1], rotate: [-2, 2, -1, 1] }}
              transition={{ duration: 1.7, repeat: Infinity }}
            />
            <div className="big-wax">
              <div className="big-wick" />
            </div>
          </div>

          <h2>One candle. One name. One moment of love.</h2>
          <p>A quiet online space for remembrance, encouragement and hope.</p>
        </motion.div>
      </section>

      <section className="mini-stats">
        {Object.entries(counts).map(([type, count]) => (
          <button
            key={type}
            className={filter === type ? 'mini-stat active' : 'mini-stat'}
            onClick={() => setFilter(type)}
            type="button"
          >
            <strong>{count}</strong>
            <span>{type}</span>
          </button>
        ))}
      </section>

      <section className="content-grid">
        <form onSubmit={addCandle} className="form-card">
          <div className="section-heading">
            <Sparkles size={20} />
            <div>
              <h2>Light a candle</h2>
              <p>Demo mode: no database, no approvals, no stress.</p>
            </div>
          </div>

          <label>Name being honoured *</label>
          <input
            value={form.honoured_name}
            onChange={(e) => setForm({ ...form, honoured_name: e.target.value })}
            placeholder="Example: Mom, Johan, All survivors"
          />

          <label>Candle type</label>
          <select
            value={form.candle_type}
            onChange={(e) => setForm({ ...form, candle_type: e.target.value })}
          >
            <option>Warrior</option>
            <option>Survivor</option>
            <option>In memory</option>
            <option>Supporter</option>
          </select>

          <label>Message *</label>
          <textarea
            rows="4"
            maxLength="180"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write a short message..."
          />

          <small>{form.message.length}/180</small>

          <label>From / signed by</label>
          <input
            value={form.from_name}
            onChange={(e) => setForm({ ...form, from_name: e.target.value })}
            placeholder="Optional"
          />

          <label>Candle colour</label>
          <div className="colour-buttons">
            {['gold', 'pink', 'purple', 'blue', 'white'].map((colour) => (
              <button
                key={colour}
                type="button"
                className={form.colour === colour ? 'active' : ''}
                onClick={() => setForm({ ...form, colour })}
              >
                {colour}
              </button>
            ))}
          </div>

          <button className="submit-button" type="submit">
            <Flame size={18} /> Light this candle
          </button>

          {submitted && (
            <div className="success">
              Thank you 💛 Your candle has been added to this demo.
            </div>
          )}

          <div className="note">
            <ShieldCheck size={18} /> Demo candles are stored only in this browser using localStorage.
          </div>

          <button className="reset-button" type="button" onClick={resetDemo}>
            <RotateCcw size={16} /> Reset demo candles
          </button>
        </form>

        <section className="wall-section">
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candles..."
              />
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In memory</option>
              <option>Supporter</option>
            </select>

            <a className="share" href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer">
              <Share2 size={17} /> Share
            </a>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredCandles.length ? (
              <motion.div className="candle-grid" layout>
                {filteredCandles.map((c) => (
                  <Candle key={c.id} candle={c} onDelete={deleteCandle} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No candles found. Try another search or filter.
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </section>
    </main>
  );
}

function Candle({ candle, onDelete }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="candle-card"
    >
      <button
        type="button"
        className="delete-candle"
        title="Delete demo candle"
        onClick={() => onDelete(candle.id)}
      >
        <Trash2 size={15} />
      </button>

      <div className="candle">
        <motion.div
          className={`flame ${colourClass[candle.colour] || 'flame-gold'}`}
          animate={{ scale: [1, 1.08, 0.96, 1], rotate: [-2, 2, -1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <div className="wax">
          <div className="wick" />
        </div>
      </div>

      <p className="type">{candle.candle_type}</p>
      <h3>{candle.honoured_name}</h3>
      <p className="message">“{candle.message}”</p>

      {candle.from_name && <p className="from">— {candle.from_name}</p>}
      <p className="date">{candle.created_at}</p>
    </motion.article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
