import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/items');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/items/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(prod =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.brand && prod.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prod.barcode && prod.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prod.category?.name && prod.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Products</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your inventory and pricing</p>
                    </div>
                    <button
                        onClick={() => navigate('/settings/masters/product/new')}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                    >
                        <Plus size={20} /> Add New Product
                    </button>
                </div>

                {/* Filters */}
                <div className="px-8 py-4 border-b border-slate-100 bg-white/50 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, brand, barcode or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
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
                            <thead>
                                <tr className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                                    <th className="pb-4 px-4">Product Info</th>
                                    <th className="pb-4 px-4">Category</th>
                                    <th className="pb-4 px-4">Stock</th>
                                    <th className="pb-4 px-4 text-right">Selling Price</th>
                                    <th className="pb-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredProducts.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                                    {prod.image ? (
                                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">{prod.name}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{prod.brand || 'No Brand'} • {prod.barcode || 'No Barcode'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                                                {prod.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${prod.stock <= prod.lowStockAlert ? 'text-red-500' : 'text-slate-700'}`}>
                                                    {prod.stock} {prod.unit}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Current Stock</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="font-black text-slate-800">{formatCurrency(prod.sellingPrice)}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/settings/masters/product/${prod.id}`)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prod.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400">
                                            No products found
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
