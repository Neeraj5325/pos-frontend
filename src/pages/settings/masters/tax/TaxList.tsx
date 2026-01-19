import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Calculator, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export const TaxList = () => {
    const navigate = useNavigate();
    const [taxes, setTaxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        try {
            const response = await api.get('/taxes');
            setTaxes(response.data);
        } catch (error) {
            console.error('Failed to fetch taxes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this tax?')) return;
        try {
            await api.delete(`/taxes/${id}`);
            setTaxes(taxes.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete tax:', error);
            alert('Failed to delete tax');
        }
    };

    const filteredTaxes = taxes.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.taxType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Tax Settings</h2>
                        <p className="text-slate-500 text-sm mt-1">Configure tax rates and types</p>
                    </div>
                    <button
                        onClick={() => navigate('/settings/masters/tax/new')}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                    >
                        <Plus size={20} /> Add New Tax
                    </button>
                </div>

                {/* Filters */}
                <div className="px-8 py-4 border-b border-slate-100 bg-white/50 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or type..."
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
                                    <th className="pb-4 px-4">Tax Name</th>
                                    <th className="pb-4 px-4">Type</th>
                                    <th className="pb-4 px-4">Rate (%)</th>
                                    <th className="pb-4 px-4">Status</th>
                                    <th className="pb-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredTaxes.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Calculator size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">{tax.name}</div>
                                                    <div className="text-xs text-slate-400">{tax.taxType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600">
                                            {tax.type}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-700">
                                            {tax.rate}%
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${tax.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {tax.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/settings/masters/tax/${tax.id}`)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tax.id)}
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
                                {filteredTaxes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400">
                                            No taxes found
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
