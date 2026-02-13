import type { User } from '../types';

const SESSION_KEY = 'visioncord_session';
const USERS_KEY = 'visioncord_users';

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.user && typeof data.user.id === 'string') {
      return { ...data.user, timestamp: undefined } as User;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
  } catch {
    // ignore
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/** For sign up: store account by email so "login" can find it. No password in storage (demo only). */
export function getStoredAccounts(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAccount(user: User): void {
  if (!user.email) return;
  try {
    const accounts = getStoredAccounts();
    accounts[user.email.toLowerCase()] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export function findUserByEmail(email: string): User | null {
  const accounts = getStoredAccounts();
  return accounts[email.toLowerCase()] ?? null;
}

export function findUserByUsername(username: string): User | null {
  const accounts = getStoredAccounts();
  const lower = username.trim().toLowerCase();
  for (const user of Object.values(accounts)) {
    if (user.username.toLowerCase() === lower) return user;
  }
  return null;
}
