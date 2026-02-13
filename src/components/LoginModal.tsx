import { useState } from 'react';
import { Modal } from './Modal';
import { findUserByEmail } from '../lib/auth';
import type { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }
    const user = findUserByEmail(trimmedEmail);
    if (!user) {
      setError('No account found with this email. Sign up first.');
      return;
    }
    // Demo: no real password check; any password "works"
    onSuccess(user);
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to VisionCord">
      <form onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <label className="modal-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="modal-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Log in</button>
        </div>
      </form>
    </Modal>
  );
}
