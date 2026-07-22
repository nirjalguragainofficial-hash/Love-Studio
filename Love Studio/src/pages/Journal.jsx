import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, BookHeart, Trash2 } from 'lucide-react';
import './Journal.css';

export default function Journal({ companionData }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('loveStudio_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState('');

  useEffect(() => {
    localStorage.setItem('loveStudio_journal', JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!currentEntry.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: currentEntry,
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setEntries([newEntry, ...entries]);
    setCurrentEntry('');
    setIsWriting(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="journal-container">
      <header className="journal-header">
        <button className="icon-btn" onClick={() => navigate('/chat')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Your Private Space</h2>
        <div style={{ width: 40 }} /> {/* Spacer for flex balance */}
      </header>

      <div className="journal-content">
        <div className="journal-intro">
          <BookHeart size={32} color="var(--color-primary)" />
          <p>A quiet place to write down how you're feeling. {companionData.name} can read this if you want them to understand you better.</p>
        </div>

        {!isWriting ? (
          <button className="btn-primary new-entry-btn" onClick={() => setIsWriting(true)}>
            <Plus size={20} /> Write a new entry
          </button>
        ) : (
          <motion.div 
            className="editor-card glass-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <textarea
              autoFocus
              placeholder="What's on your mind today?"
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
            />
            <div className="editor-actions">
              <button className="btn-secondary" onClick={() => setIsWriting(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={!currentEntry.trim()}>Save Entry</button>
            </div>
          </motion.div>
        )}

        <div className="entries-list">
          <AnimatePresence>
            {entries.map(entry => (
              <motion.div 
                key={entry.id}
                className="entry-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <div className="entry-header">
                  <span className="entry-date">{entry.date}</span>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="entry-text">{entry.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {entries.length === 0 && !isWriting && (
            <div className="empty-state">
              <p>Your journal is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
