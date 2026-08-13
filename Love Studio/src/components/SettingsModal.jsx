import { useState, useEffect, useRef } from 'react';
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
  const [voiceGender, setVoiceGender] = useState(companionData?.voiceGender || 'female');
  const modalRef = useRef(null);

  // Track whether the user has made any unsaved changes
  const isDirty =
    name !== (companionData?.name || '') ||
    face !== (companionData?.face || '/avatars/female.png') ||
    voice !== (companionData?.voice || 'calm') ||
    voiceGender !== (companionData?.voiceGender || 'female');

  // Close modal on Escape key + trap focus inside modal
  useEffect(() => {
    // Focus the modal so keyboard users can immediately interact
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { handleClose(); return; }
      // Trap Tab / Shift+Tab inside the modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Close anyway?')) return;
    onClose();
  };

  const handleSave = () => {
    onSave({
      ...companionData,
      name,
      face,
      voice,
      voiceGender
    });
    onClose();
  };

  return (
    <div className="settings-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <motion.div
        className="settings-modal-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="settings-header">
          <div className="settings-header-title">
            <Settings size={20} color="var(--color-primary, #ec4899)" />
            <h3 id="settings-modal-title">Companion Settings</h3>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close settings">
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
            <label>Voice Gender</label>
            <div className="vibe-pills">
              {['Female', 'Male'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  className={`vibe-pill ${voiceGender.toLowerCase() === gender.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setVoiceGender(gender.toLowerCase())}
                >
                  {gender}
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
            Save Changes{isDirty && <span className="unsaved-dot" aria-label="Unsaved changes" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
