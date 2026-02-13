import { useState } from 'react';
import { Modal } from './Modal';
import { findUserByEmail, saveAccount, setStoredUser } from '../lib/auth';
import type { User } from '../types';

const COLORS = ['#5865F2', '#57F287', '#FEE75C', '#ED4245', '#EB459E', '#FAA61A'];

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export function SignUpModal({ isOpen, onClose, onSuccess }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim().replace(/\s+/g, '');
    const trimmedDisplay = displayName.trim();
    if (!trimmedEmail || !trimmedUsername || !password) {
      setError('Please fill in email, username, and password.');
      return;
    }
    if (findUserByEmail(trimmedEmail)) {
      setError('An account with this email already exists. Log in instead.');
      return;
    }
    const user: User = {
      id: `user-${Date.now()}`,
      username: trimmedUsername,
      displayName: trimmedDisplay || trimmedUsername,
      email: trimmedEmail,
      status: 'online',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    saveAccount(user);
    setStoredUser(user);
    onSuccess(user);
    setEmail('');
    setUsername('');
    setDisplayName('');
    setPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an account">
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
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="cooluser"
            autoComplete="username"
          />
        </label>
        <label className="modal-field">
          <span>Display name (optional)</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="What everyone sees"
          />
        </label>
        <label className="modal-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Sign up</button>
        </div>
      </form>
    </Modal>
  );
}
