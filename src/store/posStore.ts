import { create } from 'zustand';

export type POSView = 'items' | 'payment';

interface POSState {
    currentView: POSView;
    setView: (view: POSView) => void;
}

export const usePOSStore = create<POSState>((set) => ({
    currentView: 'items',
    setView: (view) => set({ currentView: view }),
}));
