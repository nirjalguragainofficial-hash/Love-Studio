import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, RotateCcw } from 'lucide-react';
import './SettingsModal.css';

const AVATAR_OPTIONS = [
  { id: '/avatars/female.png', label: 'Warm' },
  { id: '/avatars/male.png', label: 'Gentle' },
  { id: '/avatars/nonbinary.png', label: 'Cozy' }
];

const VIBE_OPTIONS = ['Calm', 'Cheerful', 'Witty', 'Gentle', 'Direct'];

export default function SettingsModal({ companionData, onSave, onReset, onClose }) {
  const [name, setName] = useState(companionData?.name || '');
  const [face, setFace] = useState(companionData?.face || '/avatars/female.png');
  const [voice, setVoice] = useState(companionData?.voice || 'calm');

  const handleSave = () => {
    onSave({
      ...companionData,
      name,
      face,
      voice
    });
    onClose();
  };

  return (
    <div className="settings-modal-overlay">
      <motion.div 
        className="settings-modal-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="settings-header">
          <div className="settings-header-title">
            <Settings size={20} color="var(--color-primary, #ec4899)" />
            <h3>Companion Settings</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-body">
          <div className="setting-field">
            <label>Companion Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Name your companion..." 
            />
          </div>

          <div className="setting-field">
            <label>Avatar Style</label>
            <div className="avatar-selection-grid">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-option-btn ${face === avatar.id ? 'active' : ''}`}
                  onClick={() => setFace(avatar.id)}
                >
                  <img src={avatar.id} alt={avatar.label} />
                  <span>{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="setting-field">
            <label>Personality Vibe</label>
            <div className="vibe-pills">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  className={`vibe-pill ${voice.toLowerCase() === vibe.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setVoice(vibe.toLowerCase())}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="danger-btn" onClick={onReset}>
            <RotateCcw size={16} /> Reset Companion
          </button>
          <button className="save-btn" onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
