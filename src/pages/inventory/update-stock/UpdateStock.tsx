import { useState, useEffect } from 'react';
import { Save, Search, Filter, RefreshCw } from 'lucide-react';
import api from '../../../services/api';

export const UpdateStock = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [saving, setSaving] = useState(false);

    // Track changes: { itemId: { field: value } }
    const [changes, setChanges] = useState<Record<string, any>>({});

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/items');
            setItems(response.data);
            setChanges({}); // Reset changes on refresh
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/product-category');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (id: string, field: string, value: any) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));

        setChanges(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
                id // Ensure ID is included
            }
        }));
    };

    const handleSave = async () => {
        const itemsToUpdate = Object.values(changes);
        if (itemsToUpdate.length === 0) return;

        setSaving(true);
        try {
            await api.patch('/items/bulk-update', itemsToUpdate);
            alert('Stock updated successfully!');
            fetchItems(); // Refresh to ensure sync
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Failed to update stock');
        } finally {
            setSaving(false);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.itemCode && item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || (item.category && item.category.name === selectedCategory);

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Update Stock</h2>
                        <p className="text-slate-500 text-sm mt-1">Bulk update inventory and prices</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchItems}
                            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} /> Refresh
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || Object.keys(changes).length === 0}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} /> {saving ? 'Saving...' : `Save Changes (${Object.keys(changes).length})`}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-8 py-4 border-b border-slate-100 bg-white/50 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    <div className="w-64 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white appearance-none"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="text-slate-400 text-sm font-semibold uppercase tracking-wider shadow-sm">
                                    <th className="pb-4 px-4 bg-white">Item Name</th>
                                    <th className="pb-4 px-4 bg-white">Category</th>
                                    <th className="pb-4 px-4 bg-white w-32">Current Stock</th>
                                    <th className="pb-4 px-4 bg-white w-32">Price</th>
                                    <th className="pb-4 px-4 bg-white w-32">Cost</th>
                                    <th className="pb-4 px-4 bg-white w-32">MRP</th>
                                    <th className="pb-4 px-4 bg-white w-32">Alert Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-2 px-4">
                                            <div className="font-bold text-slate-700">{item.name}</div>
                                            <div className="text-xs text-slate-400">{item.itemCode || '-'}</div>
                                        </td>
                                        <td className="py-2 px-4 text-slate-600">
                                            {item.category?.name || '-'}
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={item.stock}
                                                onChange={(e) => handleInputChange(item.id, 'stock', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right font-bold text-slate-700"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleInputChange(item.id, 'price', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={item.cost}
                                                onChange={(e) => handleInputChange(item.id, 'cost', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={item.mrp}
                                                onChange={(e) => handleInputChange(item.id, 'mrp', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={item.lowStockAlert}
                                                onChange={(e) => handleInputChange(item.id, 'lowStockAlert', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center text-slate-400">
                                            No items found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
