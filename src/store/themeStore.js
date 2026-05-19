import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('logezy_theme');
  if (saved) return saved;
  return 'light'; // Thème clair par défaut
};

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('logezy_theme', theme);
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const current = localStorage.getItem('logezy_theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));

// Appliquer le thème au chargement
applyTheme(getInitialTheme());

export default useThemeStore;