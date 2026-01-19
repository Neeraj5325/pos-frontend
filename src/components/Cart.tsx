import { Minus, Plus, User, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { usePOSStore } from '../store/posStore';

export const Cart = () => {
    const { items, updateQuantity, subtotal, discount, serviceCharge, total } = useCartStore();
    const setView = usePOSStore((state) => state.setView);

    return (
        <div className="w-[380px] bg-white rounded-[32px] border border-slate-100 flex flex-col h-full shadow-sm overflow-hidden">
            <div className="p-8 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Order</h2>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 no-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <Trash2 size={24} />
                        </div>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex gap-4 group items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h4>
                                <div className="text-slate-900 font-bold mt-1">£{item.price.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-slate-400/20 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    <Minus size={16} strokeWidth={3} />
                                </button>
                                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary */}
            <div className="p-8 pt-4">
                <div className="bg-slate-50 rounded-2xl p-2 space-y-3 mb-6">
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span className="text-slate-800 font-semibold">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Discount</span>
                        <span className="text-slate-800 font-semibold">£{discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Service Charge</span>
                        <span className="text-slate-800 font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Tax</span>
                        <span className="text-slate-800 font-semibold">£{((subtotal - discount) * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 border-t border-slate-200 pt-2 mt-2">
                        <span className="text-base font-bold text-slate-400">Total</span>
                        <span className="text-xl font-black text-slate-900">£{total.toFixed(2)}</span>
                    </div>
                </div>
                <button
                    onClick={() => setView('payment')}
                    disabled={items.length === 0}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-3xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
