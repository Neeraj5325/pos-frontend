import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export const ProductGroupList = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/product-groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch product groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product group?')) return;
        try {
            await api.delete(`/product-groups/${id}`);
            setGroups(groups.filter(g => g.id !== id));
        } catch (error) {
            console.error('Failed to delete group:', error);
            alert('Failed to delete group');
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.code && group.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Product Groups</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your item grouping and classification</p>
                    </div>
                    <button
                        onClick={() => navigate('/settings/masters/product-group/new')}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-3xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                    >
                        <Plus size={18} /> Add New Group
                    </button>
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
                                <tr className="text-slate-400 text-sm font-semibold uppercase tracking-wider border-b border-slate-200">
                                    <th className="pb-4 px-4">Code</th>
                                    <th className="pb-4 px-4">Name</th>
                                    <th className="pb-4 px-4">Description</th>
                                    <th className="pb-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredGroups.map((group) => (
                                    <tr key={group.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-1 px-4 font-mono text-xs text-slate-500">{group.code || '-'}</td>
                                        <td className="py-1 px-4 font-bold text-slate-700">{group.name}</td>
                                        <td className="py-1 px-4 text-slate-500 line-clamp-1 max-w-xs">{group.description || '-'}</td>
                                        <td className="py-1 px-4 text-right">
                                            <div className="flex justify-end gap-2 ">
                                                <button
                                                    onClick={() => navigate(`/settings/masters/product-group/${group.id}`)}
                                                    className="p-2 cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(group.id)}
                                                    className="p-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredGroups.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400">
                                            No product groups found
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
