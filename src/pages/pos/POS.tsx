import { useState, useRef } from 'react';
import { Search, Plus, SlidersHorizontal,  ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { usePOSStore } from '../../store/posStore';
import { Payment } from './Payment';

const categories = ['All', 'Cakes', 'Pastry', 'Ice Cream', 'Pancakes', 'Vegan', 'Muffins', 'Coffee', 'Juices'];

const items = [
    { id: 1, name: 'Raspberry Tart', price: 8.12, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Lemon Tart', price: 2.86, image: 'https://images.unsplash.com/photo-1614174486496-344ef3e9d870?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'Chocolate Tart', price: 6.12, image: 'https://plus.unsplash.com/premium_photo-1723618822165-0b13c0471fc4?q=80&w=408&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Fruit Tart', price: 6.12, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=200' },
    { id: 5, name: 'Chocolate Cake', price: 24.86, image: 'https://images.unsplash.com/photo-1676300186673-615bcc8d5d68?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 6, name: 'Mini Chocolate Cake', price: 6.12, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=200' },
];

export const POS = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const addToCart = useCartStore((state) => state.addToCart);
    const { currentView, setView } = usePOSStore();
    const total = useCartStore((state) => state.total);
    const categoryRef = useRef<HTMLDivElement>(null);

    const scrollCategories = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    if (currentView === 'payment') {
        return <Payment onBack={() => setView('items')} total={total} />;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-8 flex items-center justify-between">
                {/* Customer Info */}
                <div className="gap-3 mb-6">
                    <div>
                        <p className="font-semibold text-slate-700">Welcome, Emma</p>
                        <p className="text-sm text-slate-500">Discover what you need easily</p>
                    </div>

                    {/* <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-semibold text-slate-700">Emma Wang</div> */}
                </div>

                <div className="flex-1 max-w-xl px-12">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="|"
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl focus:outline-none shadow-sm text-slate-400"
                        />
                    </div>
                </div>

                <button className="p-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-600 hover:bg-white transition-colors shadow-sm">
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Categories */}
            <div className="px-8 mb-8 flex items-center gap-4 overflow-hidden relative">
                <div
                    ref={categoryRef}
                    className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${activeCategory === cat
                                ? 'bg-slate-800 text-white shadow-lg'
                                : 'bg-white text-slate-500 hover:border-slate-200 '
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button
                    onClick={scrollCategories}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-slate-800 transition-colors flex-shrink-0"
                >
                    <ChevronRight size={22} />
                </button>
            </div>

            {/* Grid */}
            <div className="px-8 flex-1 overflow-y-auto pb-8 no-scrollbar scroll-smooth">
                <div className="grid grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className="bg-white rounded-[32px] p-5 group hover:shadow-xl transition-all duration-300 cursor-pointer relative flex flex-col shadow-sm border border-slate-50 min-h-[300px]"
                        >
                            <div className="relative overflow-hidden rounded-3xl mb-4 bg-slate-50 aspect-square">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">{item.name}</h3>
                            <div className="mt-auto">
                                <span className="text-slate-900 font-bold text-xl">£{item.price.toFixed(2)}</span>
                            </div>
                            {/* Floating Plus Button - Integrated at bottom right */}
                            <button className="absolute bottom-5 right-5 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md group-hover:bg-primary">
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
