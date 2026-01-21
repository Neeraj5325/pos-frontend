import { ArrowLeft, Banknote, CreditCard, PieChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { usePOSStore } from '../../store/posStore';

interface PaymentProps {
    onBack: () => void;
    total: number;
}

const paymentMethods = [
    { id: 'cash', icon: Banknote, label: 'Cash', color: 'text-green-500' },
    { id: 'card', icon: CreditCard, label: 'Credit Card', color: 'text-purple-500' },
    { id: 'split', icon: PieChart, label: 'Split', color: 'text-orange-500' },
];

export const Payment = ({ onBack, total }: PaymentProps) => {
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const clearCart = useCartStore((state) => state.clearCart);
    const setView = usePOSStore((state) => state.setView);

    const handlePlaceOrder = () => {
        // Here you would typically call an API to save the order
        alert(`Order placed successfully with ${selectedMethod}!`);
        clearCart();
        setView('items');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/30">
            {/* Header */}
            <div className="p-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">Payment Methods</h1>
                <p className="text-slate-500">Choose payment method</p>
            </div>

            {/* Methods Grid */}
            <div className="px-8 grid grid-cols-3 gap-6">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isActive = selectedMethod === method.id;
                    return (
                        <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={cn(
                                "p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col gap-4",
                                isActive
                                    ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                isActive ? "bg-white/10" : "bg-slate-50",
                                !isActive && method.color
                            )}>
                                <Icon size={32} />
                            </div>
                            <span className={cn(
                                "text-xl font-bold transition-colors",
                                isActive ? "text-white" : "text-slate-800"
                            )}>
                                {method.label}
                            </span>

                            {/* Selection indicator */}
                            <div className={cn(
                                "absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                isActive ? "border-white bg-white/20" : "border-slate-100"
                            )}>
                                {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto p-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 max-w-md">
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Total Amount</div>
                        <div className="text-3xl font-bold text-slate-900">£{total.toFixed(2)}</div>
                    </div>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    className="w-full max-w-md bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <span>Place Order</span>
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">£</span>
                </button>
            </div>
        </div>
    );
};
