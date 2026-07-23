import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Book, Coffee, ShieldAlert, Heart, Sun, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import './Chat.css';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'ai', text: "Hi there. I'm here for you. How are you feeling today?" }
];

const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'die', 'hurt myself', 'cut myself', 'end it all'];

export default function Chat({ companionData, setCompanionData }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState('vent'); // vent, distract, cheer
  const [showCrisis, setShowCrisis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

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

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const getAIResponse = async (allMessages, currentMode) => {
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          mode: currentMode,
          companionName: companionData.name
        })
      });

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

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');

    if (checkCrisis(inputValue)) {
      setShowCrisis(true);
      return;
    }

    setIsTyping(true);

    const replyText = await getAIResponse(updatedMessages, mode);

    setIsTyping(false);
    const aiResponse = { id: Date.now() + 1, sender: 'ai', text: replyText };
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
            <span className="status">Online & listening</span>
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
              <div className={`message-bubble ${msg.sender}`}>
                {msg.text}
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

      {/* Input Area */}
      <div className="input-area glass-panel">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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