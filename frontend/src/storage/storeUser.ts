import type { IRosterSessionResponse } from '@/interface/IRoster';
import { create } from 'zustand';

const TOKEN_KEY = 'token';
const PROFILE_KEY = 'roster-profile';
const CACHE_VERSION = 1;

interface UserStore {
  user: IRosterSessionResponse | null;
  status: 'signed-out' | 'restoring' | 'signed-in';
  setUser: (user: IRosterSessionResponse, token: string) => void;
  updateUserName: (name: string, token: string) => void;
  restoreSession: (signal: AbortSignal) => Promise<void>;
  clearUser: () => void;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseProfile(value: unknown): IRosterSessionResponse | null {
  const profile = asRecord(value);
  if (!profile) return null;
  const { id, name, email, clubId, subscriptionId } = profile;
  if (
    typeof id !== 'number' || !Number.isSafeInteger(id) || id < 1 ||
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof clubId !== 'number' || !Number.isSafeInteger(clubId) || clubId < 1 ||
    typeof subscriptionId !== 'number' || !Number.isSafeInteger(subscriptionId) || subscriptionId < 1
  ) {
    return null;
  }
  // Persist only the fields used by the profile UI; never copy arbitrary response fields.
  return { id, name, email, clubId, subscriptionId };
}

export function getSessionToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function rosterApiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  if (!baseUrl) throw new Error('VITE_BACKEND_URL is required');
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}

export function getApiData(response: unknown) {
  return asRecord(asRecord(response)?.data);
}

export async function fetchSessionProfile(token: string, signal?: AbortSignal) {
  const response = await fetch(rosterApiUrl('/roster/me/'), {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  const profile = parseProfile(getApiData(await response.json()));
  if (!profile) throw new Error('Failed to fetch user profile');
  return profile;
}

function clearSessionStorage() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

function initialSession(): Pick<UserStore, 'user' | 'status'> {
  // Old caches were not reliably readable; rehydrate from the server instead.
  localStorage.removeItem('user');
  if (getSessionToken()) {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw === null) return { user: null, status: 'restoring' };

    try {
      const cache = asRecord(JSON.parse(raw));
      const user = cache?.version === CACHE_VERSION ? parseProfile(cache.profile) : null;
      if (user) return { user, status: 'restoring' };
    } catch {
      // Malformed or unsupported profile data must not reach the protected UI.
    }
  }

  clearSessionStorage();
  return { user: null, status: 'signed-out' };
}

const useUserStore = create<UserStore>((set, get) => {
  const saveProfile = (profile: IRosterSessionResponse) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ version: CACHE_VERSION, profile }));
    set({ user: profile, status: 'signed-in' });
  };

  const setUser = (user: IRosterSessionResponse, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    saveProfile(user);
  };

  const clearUser = () => {
    clearSessionStorage();
    set({ user: null, status: 'signed-out' });
  };

  return {
    ...initialSession(),
    setUser,
    clearUser,
    updateUserName: (name, token) => {
      const { user, status } = get();
      if (user && status === 'signed-in' && getSessionToken() === token) {
        saveProfile({ ...user, name });
      }
    },
    restoreSession: async (signal) => {
      const token = getSessionToken();
      if (!token) {
        clearUser();
        return;
      }

      try {
        const profile = await fetchSessionProfile(token, signal);
        if (!signal.aborted && getSessionToken() === token) saveProfile(profile);
      } catch {
        if (!signal.aborted && getSessionToken() === token) clearUser();
      }
    },
  };
});

export default useUserStore;
