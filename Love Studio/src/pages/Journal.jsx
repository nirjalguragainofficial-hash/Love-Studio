import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, BookHeart, Trash2, Tag, Download, Search } from 'lucide-react';
import './Journal.css';

// Mood tags available for each journal entry
const MOOD_TAGS = [
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { id: 'grateful', emoji: '🥰', label: 'Grateful' },
];

export default function Journal({ companionData }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('loveStudio_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('loveStudio_journal', JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!currentEntry.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: currentEntry,
      mood: selectedMood,
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
    setSelectedMood(null);
    setIsWriting(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleExport = () => {
    if (entries.length === 0) return;
    const lines = entries.map(e => [
      `── ${e.date}${e.mood ? ` [${e.mood.emoji} ${e.mood.label}]` : ''} ──`,
      e.text,
      ''
    ].join('\n')).join('\n');
    const blob = new Blob([`Love Studio Journal\n${'='.repeat(40)}\n\n${lines}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-studio-journal-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter entries by search query (text or mood label)
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(e =>
      e.text.toLowerCase().includes(q) ||
      (e.mood?.label?.toLowerCase().includes(q))
    );
  }, [entries, searchQuery]);

  return (
    <div className="journal-container">
      <header className="journal-header">
        <button className="icon-btn" onClick={() => navigate('/chat')} aria-label="Back to chat">
          <ArrowLeft size={24} />
        </button>
        <h2>Your Private Space</h2>
        <button
          className="icon-btn"
          title="Export journal as .txt"
          aria-label="Export journal as text file"
          onClick={handleExport}
          disabled={entries.length === 0}
        >
          <Download size={22} />
        </button>
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
            {/* Live word/character count */}
            <div className="entry-count">
              {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0} words
              &nbsp;&middot;&nbsp;
              {currentEntry.length} chars
            </div>
            {/* Mood tag selector */}
            <div className="mood-tag-selector">
              <span className="mood-tag-label"><Tag size={13} /> How are you feeling?</span>
              <div className="mood-tag-options">
                {MOOD_TAGS.map(tag => (
                  <button
                    key={tag.id}
                    className={`mood-tag-btn ${selectedMood?.id === tag.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(selectedMood?.id === tag.id ? null : tag)}
                    type="button"
                  >
                    {tag.emoji} {tag.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="editor-actions">
              <button className="btn-secondary" onClick={() => setIsWriting(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={!currentEntry.trim()}>Save Entry</button>
            </div>
          </motion.div>
        )}

        {/* Search bar — only shown when there are entries */}
        {entries.length > 0 && (
          <div className="journal-search-bar">
            <Search size={16} className="journal-search-icon" />
            <input
              type="text"
              placeholder="Search entries…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="journal-search-input"
            />
            {searchQuery && (
              <span className="journal-search-count">
                {filteredEntries.length} / {entries.length}
              </span>
            )}
          </div>
        )}

        <div className="entries-list">
          <AnimatePresence>
            {filteredEntries.map(entry => (
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
                  <div className="entry-header-right">
                    {entry.mood && (
                      <span className="entry-mood-badge">{entry.mood.emoji} {entry.mood.label}</span>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.id)}
                      aria-label="Delete this entry"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
          {entries.length > 0 && filteredEntries.length === 0 && (
            <div className="empty-state">
              <p>No entries match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
