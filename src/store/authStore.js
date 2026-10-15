import { create } from 'zustand';
import { endUserSession, startUserSession } from '../lib/userSession';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('logezy_user')) || null,
  token: localStorage.getItem('logezy_token') || null,
  isAuthenticated: !!localStorage.getItem('logezy_token'),

  login: (user, token) => {
    localStorage.setItem('logezy_token', token);
    localStorage.setItem('logezy_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
    startUserSession(true).catch((error) => {
      console.warn('La session utilisateur ne peut pas encore être enregistrée.', error.message);
    });
  },

  logout: () => {
    endUserSession().catch((error) => {
      console.warn('La fin de session utilisateur ne peut pas être enregistrée.', error.message);
    });
    localStorage.removeItem('logezy_token');
    localStorage.removeItem('logezy_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    const updated = { ...JSON.parse(localStorage.getItem('logezy_user')), ...userData };
    localStorage.setItem('logezy_user', JSON.stringify(updated));
    set({ user: updated });
  },
}));

export default useAuthStore;