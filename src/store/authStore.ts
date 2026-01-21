import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant: {
        id: string;
        name: string;
        slug: string;
        schemaName: string;
        address?: string;
        country?: string;
        state?: string;
        city?: string;
        pinCode?: string;
        mobile?: string;
        email?: string;
        gstRegistrationType?: string;
        gstin?: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
