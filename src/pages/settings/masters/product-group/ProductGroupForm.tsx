import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { FormInput } from '../../../../components/ui/FormInput';

export const ProductGroupForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    useEffect(() => {
        if (id) {
            fetchGroup();
        }
    }, [id]);

    const fetchGroup = async () => {
        try {
            const response = await api.get(`/product-groups/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Failed to fetch product group:', error);
            alert('Failed to load product group');
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert('Name is required');
            return;
        }
        setLoading(true);
        try {
            if (isEdit) {
                await api.patch(`/product-groups/${id}`, formData);
                alert('Product Group updated successfully!');
            } else {
                await api.post('/product-groups', formData);
                alert('Product Group saved successfully!');
            }
            navigate('/settings/masters/product-group');
        } catch (error) {
            console.error('Failed to save product group:', error);
            alert('Failed to save product group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Product Group' : 'New Product Group'}</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/settings/masters/product-group')}
                            className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
                        >
                            <X size={18} /> Close
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            <Save size={18} /> {loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Save')}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="max-w-2xl space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <FormInput
                                label="Code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>

                        <FormInput
                            label="Description"
                            type="textarea"
                            rows={6}
                            placeholder="Input text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
