import { create } from 'zustand';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    calculateTotals: () => void;
    subtotal: number;
    discount: number;
    serviceCharge: number;
    tax: number;
    total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    subtotal: 0,
    discount: 0,
    serviceCharge: 0,
    tax: 0,
    total: 0,

    addToCart: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        let newItems;
        if (existingItem) {
            newItems = items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            newItems = [...items, { ...item, quantity: 1 }];
        }

        set({ items: newItems });
        get().calculateTotals();
    },

    removeFromCart: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ items: newItems });
        get().calculateTotals();
    },

    updateQuantity: (id, quantity) => {
        if (quantity < 1) {
            get().removeFromCart(id);
            return;
        }

        const newItems = get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
        );
        set({ items: newItems });
        get().calculateTotals();
    },

    clearCart: () => {
        set({ items: [], subtotal: 0, discount: 0, serviceCharge: 0, tax: 0, total: 0 });
    },

    calculateTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discount = 0; // Can be implemented later
        const serviceCharge = subtotal * 0.20; // 20% from image
        const tax = 0.50; // Fixed from image for now, can be changed to percentage
        const total = subtotal - discount + serviceCharge + tax;

        set({ subtotal, discount, serviceCharge, tax, total });
    },
}));

// Initialize totals
useCartStore.getState().calculateTotals();
