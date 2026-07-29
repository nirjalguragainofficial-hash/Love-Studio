import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Book, Coffee, ShieldAlert, Heart, Sun, Volume2, VolumeX, Mic, MicOff, Trash2, Bookmark } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import './Chat.css';

// Maximum characters allowed in a single chat message
const MAX_INPUT_LENGTH = 500;

// Quick-access mood emoji snippets shown above the input box
const MOOD_EMOJIS = [
  { emoji: '😢', label: 'sad' },
  { emoji: '😰', label: 'anxious' },
  { emoji: '😤', label: 'angry' },
  { emoji: '😔', label: 'lonely' },
  { emoji: '😊', label: 'happy' },
  { emoji: '😴', label: 'tired' },
  { emoji: '🤯', label: 'overwhelmed' },
  { emoji: '💜', label: 'grateful' },
];

// First message shown when a user opens the chat
const INITIAL_MESSAGES = [
  { id: 1, sender: 'ai', text: "Hey, I'm so glad you're here 💜 This is your safe space. How are you feeling today?" }
];

// Trigger words that show the crisis resources modal
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'die', 'hurt myself', 'cut myself', 'end it all',
  'want to die', 'no reason to live', 'end my life', 'not worth living',
  'self harm', 'overdose', 'give up on life'
];

// Reactions available on AI messages
const MESSAGE_REACTIONS = ['❤️', '👍', '✨'];

export default function Chat({ companionData, setCompanionData }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES.map(m => ({...m, timestamp: new Date().toLocaleTimeString(), reaction: null, pinned: false})));
  const [inputValue, setInputValue] = useState(() => localStorage.getItem('loveStudio_draft') || '');
  const [mode, setMode] = useState('vent'); // vent, distract, cheer
  const [showCrisis, setShowCrisis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleReaction = (msgId, emoji) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m
    ));
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages and start fresh?')) {
      setMessages(INITIAL_MESSAGES.map(m => ({ ...m, timestamp: new Date().toLocaleTimeString(), reaction: null, pinned: false })));
      setInputValue('');
      localStorage.removeItem('loveStudio_draft');
    }
  };

  // Toggle pinned/bookmarked state on any message
  const handlePin = (msgId) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, pinned: !m.pinned } : m
    ));
  };

  // Persist unsent draft to localStorage
  useEffect(() => {
    localStorage.setItem('loveStudio_draft', inputValue);
  }, [inputValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setInputValue(text);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputValue(''); // clear input when starting to speak
      try {
        // Abort any previous session before starting a new one to avoid
        // "InvalidStateError: recognition has already started" errors
        recognitionRef.current?.abort();
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      }
    }
  };

  const checkCrisis = (text) => {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
  };

  const speakText = async (text) => {
    if (!voiceEnabled) return;

    let useBrowserTTS = true;

    // Call server TTS endpoint for both female and male voice genders
    try {
      let response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          gender: companionData.voiceGender || 'female'
        })
      }).catch(() => null);

      if (!response || !response.ok) {
        response = await fetch('http://localhost:8000/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            gender: companionData.voiceGender || 'female'
          })
        });
      }

      if (!response.ok) {
        throw new Error('TTS server returned an error.');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      useBrowserTTS = false; // Successfully played server-generated voice!
    } catch (err) {
      console.warn('Server TTS failed, falling back to browser TTS:', err);
    }



    if (useBrowserTTS) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      const nepaliVoices = voices.filter(v => v.lang.startsWith('ne-NP') || v.lang.startsWith('ne'));
      
      if (nepaliVoices.length > 0) {
        if (companionData.voiceGender === 'male') {
          selectedVoice = nepaliVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('sagar'));
        } else {
          selectedVoice = nepaliVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('kalpana'));
        }
        if (!selectedVoice) selectedVoice = nepaliVoices[0];
      } else {
        const hindiVoices = voices.filter(v => v.lang.startsWith('hi-IN') || v.lang.startsWith('hi'));
        if (companionData.voiceGender === 'male') {
          selectedVoice = hindiVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hemant'));
        } else {
          selectedVoice = hindiVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('kalpana'));
        }
        if (!selectedVoice && hindiVoices.length > 0) selectedVoice = hindiVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getAIResponse = async (allMessages, currentMode) => {
    try {
      const payload = JSON.stringify({
        messages: allMessages,
        mode: currentMode,
        companionName: companionData.name,
        userMood: companionData.mood
      });

      let response = await fetch('http://127.0.0.1:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => null);

      if (!response || !response.ok) {
        response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
      }

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      return data.reply;
    } catch (err) {

      console.error('AI response error:', err);
      return "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue, timestamp: new Date().toLocaleTimeString(), reaction: null, pinned: false };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    localStorage.removeItem('loveStudio_draft');

    if (checkCrisis(inputValue)) {
      setShowCrisis(true);
      return;
    }

    setIsTyping(true);

    const replyText = await getAIResponse(updatedMessages, mode);

    setIsTyping(false);
    const aiResponse = { id: Date.now() + 1, sender: 'ai', text: replyText, timestamp: new Date().toLocaleTimeString(), reaction: null, pinned: false };
    setMessages(prev => [...prev, aiResponse]);
    speakText(aiResponse.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header glass-panel">
        <div className="companion-info">
          <img src={companionData.face} alt={companionData.name} className="header-avatar" />
          <div className="header-text">
            <h2>{companionData.name}</h2>
            <span className="status">
              Online & listening
              {messages.length > 1 && (
                <span className="msg-count-badge" title="Messages in this session">
                  {messages.length}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="icon-btn"
            title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button onClick={() => navigate('/journal')} className="icon-btn" title="Journal">
            <Book size={20} />
          </button>
          <button className="icon-btn" title="Clear Chat" onClick={handleClearChat}>
            <Trash2 size={20} />
          </button>
          <button className="icon-btn" title="Settings" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'vent' ? 'active' : ''}`}
          onClick={() => setMode('vent')}
        >
          <Heart size={16} /> Just Listen
        </button>
        <button
          className={`mode-btn ${mode === 'distract' ? 'active' : ''}`}
          onClick={() => setMode('distract')}
        >
          <Coffee size={16} /> Distract Me
        </button>
        <button
          className={`mode-btn ${mode === 'cheer' ? 'active' : ''}`}
          onClick={() => setMode('cheer')}
        >
          <Sun size={16} /> Cheer Me Up
        </button>
      </div>

      {/* Pinned messages strip */}
      {messages.some(m => m.pinned) && (
        <div className="pinned-strip">
          <Bookmark size={13} className="pinned-strip-icon" />
          <span className="pinned-strip-label">Pinned:</span>
          <div className="pinned-strip-items">
            {messages.filter(m => m.pinned).map(m => (
              <span key={m.id} className="pinned-strip-item" title={m.text}>
                {m.text.length > 60 ? m.text.slice(0, 60) + '…' : m.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="messages-area">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`message-wrapper ${msg.sender}`}
            >
              {msg.sender === 'ai' && (
                <img src={companionData.face} alt="" className="message-avatar" />
              )}
              <div className={`message-bubble ${msg.sender}${msg.pinned ? ' pinned' : ''}`}>
                {msg.text}
                <span className="msg-timestamp">{msg.timestamp}</span>
                {/* Pin button — visible on hover */}
                <button
                  className={`pin-btn ${msg.pinned ? 'active' : ''}`}
                  onClick={() => handlePin(msg.id)}
                  title={msg.pinned ? 'Unpin message' : 'Pin message'}
                >
                  <Bookmark size={12} />
                </button>
                {msg.sender === 'ai' && (
                  <div className="msg-reactions">
                    {MESSAGE_REACTIONS.map(emoji => (
                      <button
                        key={emoji}
                        className={`reaction-btn ${msg.reaction === emoji ? 'active' : ''}`}
                        onClick={() => handleReaction(msg.id, emoji)}
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                        {msg.reaction === emoji && <span className="reaction-badge">1</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message-wrapper ai"
            >
              <img src={companionData.face} alt="" className="message-avatar" />
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Mood Emoji Quick-Inserts */}
      <div className="mood-emojis">
        {MOOD_EMOJIS.map(({ emoji, label }) => (
          <button
            key={label}
            className="mood-emoji-btn"
            title={label}
            onClick={() => setInputValue(prev => prev ? `${prev} ${emoji}` : `I'm feeling ${label} ${emoji}`)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="input-area glass-panel">
        <textarea
          value={inputValue}
          onChange={(e) => {
            if (e.target.value.length <= MAX_INPUT_LENGTH) {
              setInputValue(e.target.value);
            }
          }}
          onKeyDown={handleKeyPress}
          placeholder={isListening ? "Listening..." : `Type a message to ${companionData.name}...`}
          rows={1}
        />
        <button
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
        >
          <Send size={20} />
        </button>
      </div>
      {/* Input hint bar — visible only when typing */}
      {inputValue.length > 0 && (
        <div className="input-hint-bar">
          <span className={inputValue.length >= MAX_INPUT_LENGTH * 0.9 ? 'char-count warn' : 'char-count'}>
            {inputValue.length} / {MAX_INPUT_LENGTH}
          </span>
          <span className="kbd-hint">↵ Enter to send &nbsp;·&nbsp; Shift+↵ new line</span>
        </div>
      )}

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisis && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-content glass-panel">
              <ShieldAlert size={48} color="var(--color-error)" className="modal-icon" />
              <h2>You are not alone.</h2>
              <p>It sounds like you're going through a really painful moment right now. Your safety and well-being are so important.</p>

              <div className="crisis-resources">
                <div className="resource-item">
                  <strong>National Suicide Prevention Lifeline</strong>
                  <p>Call or text 988</p>
                </div>
                <div className="resource-item">
                  <strong>Crisis Text Line</strong>
                  <p>Text HOME to 741741</p>
                </div>
              </div>

              <p className="modal-note">Please consider reaching out to a professional or a loved one. AI is here to chat, but it cannot replace real human support.</p>

              <button className="btn-primary" onClick={() => setShowCrisis(false)}>
                I understand, close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            companionData={companionData}
            onSave={(updated) => setCompanionData(updated)}
            onReset={() => setCompanionData({ name: '', face: '/avatars/female.png', voice: 'calm' })}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}