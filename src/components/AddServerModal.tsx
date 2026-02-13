import { useState } from 'react';
import { Modal } from './Modal';

interface AddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export function AddServerModal({ isOpen, onClose, onAdd }: AddServerModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a server">
      <p className="modal-description">Your server is where you hang out with friends. Create one and start talking.</p>
      <form onSubmit={handleSubmit}>
        <label className="modal-field">
          <span>Server name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome server"
            maxLength={100}
            autoFocus
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={!name.trim()}>Create</button>
        </div>
      </form>
    </Modal>
  );
}
