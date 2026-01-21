import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import api from '../../../../services/api';

export const TaxForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // If id is undefined (from /new route) or strictly 'new', it's not edit mode
    const isEditMode = !!id && id !== 'new';
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Tax',
        taxType: 'CGST',
        rate: '',
        status: 'Active',
        wef: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchTax();
        }
    }, [id]);

    const fetchTax = async () => {
        try {
            if (id) {
                const response = await api.get(`/taxes/${id}`);
                const data = response.data;
                setFormData({
                    name: data.name || '',
                    type: data.type || 'Tax',
                    taxType: data.taxType || 'CGST',
                    rate: data.rate || '',
                    status: data.status || 'Active',
                    wef: data.wef ? new Date(data.wef).toISOString().split('T')[0] : ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch tax:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.patch(`/taxes/${id}`, formData);
            } else {
                const result = await api.post('/taxes', formData);
                console.log(result, 'resultresult')
            }
            navigate('/settings/masters/tax');
        } catch (error) {
            console.error('Failed to save tax:', error);
            alert('Failed to save tax');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {isEditMode ? 'Edit Tax' : 'Tax Master'}
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/settings/masters/tax')}
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <X size={18} /> Close
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <form className="max-w-4xl">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Input Tax Name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                >
                                    <option value="Tax">Tax</option>
                                    <option value="Cess">Cess</option>
                                    <option value="Surcharge">Surcharge</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tax Type</label>
                                <select
                                    name="taxType"
                                    value={formData.taxType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                >
                                    <option value="CGST">CGST</option>
                                    <option value="SGST">SGST</option>
                                    <option value="IGST">IGST</option>
                                    <option value="VAT">VAT</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tax %</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="18"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">W.e.f.</label>
                                <input
                                    type="date"
                                    name="wef"
                                    value={formData.wef}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
