import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  items: [],

  addItem: (listing) => {
    const { items } = get();
    if (items.length >= 3) {
      return { error: 'Maximum 3 biens à comparer' };
    }
    if (items.find(i => i.id === listing.id)) {
      return { error: 'Ce bien est déjà dans la comparaison' };
    }
    set({ items: [...items, listing] });
    return { success: true };
  },

  removeItem: (id) => {
    set({ items: get().items.filter(i => i.id !== id) });
  },

  clearItems: () => set({ items: [] }),

  isInCompare: (id) => get().items.some(i => i.id === id),
}));

export default useCompareStore;