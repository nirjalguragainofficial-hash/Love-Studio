import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Smile, CloudRain, Sun } from 'lucide-react';
import './Onboarding.css';

export default function Onboarding({ setCompanionData }) {
  const navigate = useNavigate();
  // Restore step from sessionStorage so a page refresh doesn't lose progress
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('onboarding_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [formData, setFormData] = useState({
    mood: '',
    gender: 'no_preference',
    face: '/avatars/female.png', // default face
    voice: 'calm',
    voiceGender: 'female',
    name: ''
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Keep sessionStorage in sync whenever the step changes
  useEffect(() => {
    sessionStorage.setItem('onboarding_step', String(step));
  }, [step]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleComplete = () => {
    if (!formData.name.trim()) return;
    sessionStorage.removeItem('onboarding_step'); // clean up on completion
    setCompanionData(formData);
    navigate('/chat');
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="onboarding-step"
    >
      <p className="step-indicator">Step 1 of 2</p>
      <Heart size={48} color="var(--color-primary)" className="step-icon" />
      <h2>Welcome to Love Studio</h2>
      <p className="step-subtitle">A little company, on the days you need it most.</p>

      <h3 className="section-title">How are you feeling right now?</h3>
      <div className="mood-grid">
        {[
          { id: 'breakup', icon: CloudRain, label: 'Going through a breakup' },
          { id: 'missing_friend', icon: Heart, label: 'Missing a friend' },
          { id: 'feeling_low', icon: Smile, label: 'Just feeling low today' },
          { id: 'just_chat', icon: Sun, label: 'Want someone to chat with' }
        ].map(mood => (
          <button
            key={mood.id}
            className={`mood-card ${formData.mood === mood.id ? 'selected' : ''}`}
            onClick={() => updateForm('mood', mood.id)}
          >
            <mood.icon size={24} className="mood-icon" />
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={!formData.mood}
        style={{ marginTop: '2rem' }}
      >
        Continue
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="onboarding-step"
    >
      <p className="step-indicator">Step 2 of 2</p>
      <Sparkles size={48} color="var(--color-secondary)" className="step-icon" />
      <h2>Create Your Companion</h2>
      <p className="step-subtitle">Who would you like to talk to?</p>

      <div className="customization-section">
        <label>Avatar Style</label>
        <div className="avatar-grid">
          {[
            { id: '/avatars/female.png', label: 'Warm' },
            { id: '/avatars/male.png', label: 'Gentle' },
            { id: '/avatars/nonbinary.png', label: 'Cozy' }
          ].map(avatar => (
            <div
              key={avatar.id}
              className={`avatar-option ${formData.face === avatar.id ? 'selected' : ''}`}
              onClick={() => updateForm('face', avatar.id)}
            >
              <img src={avatar.id} alt={avatar.label} />
              <span>{avatar.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="customization-section">
        <label>Voice Gender</label>
        <div className="pill-group">
          {['Female', 'Male'].map(gender => (
            <button
              key={gender}
              className={`pill-btn ${formData.voiceGender === gender.toLowerCase() ? 'selected' : ''}`}
              onClick={() => updateForm('voiceGender', gender.toLowerCase())}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="customization-section">
        <label>Voice / Personality Vibe</label>
        <div className="pill-group">
          {['Calm', 'Cheerful', 'Witty', 'Gentle', 'Direct'].map(voice => (
            <button
              key={voice}
              className={`pill-btn ${formData.voice === voice.toLowerCase() ? 'selected' : ''}`}
              onClick={() => updateForm('voice', voice.toLowerCase())}
            >
              {voice}
            </button>
          ))}
        </div>
      </div>

      <div className="customization-section">
        <label>What should we call them?</label>
        <input
          type="text"
          className="name-input"
          placeholder="e.g. Sam, Robin, Avery..."
          maxLength={20}
          value={formData.name}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= 20) {
              updateForm('name', val);
            }
          }}
        />
        <p className="name-char-count">{formData.name.length} / 20</p>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={handleBack}>Back</button>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={!formData.name.trim()}
        >
          Meet {formData.name || 'Them'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="onboarding-container">
      {/* Progress Bar */}
      <div className="onboarding-progress">
        <div className="progress-bar" style={{ width: `${(step / 2) * 100}%` }} />
      </div>

      <div className="glass-panel onboarding-card">
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </AnimatePresence>
      </div>
    </div>
  );
}
