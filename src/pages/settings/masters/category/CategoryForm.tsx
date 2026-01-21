import { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { FormInput } from '../../../../components/ui/FormInput';

export const CategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [productGroups, setProductGroups] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        productGroupId: '',
        description: '',
        displayOrder: 1,
        tax: '18%',
        status: 'Active',
        wef: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchProductGroups = async () => {
            try {
                const response = await api.get('/product-groups');
                setProductGroups(response.data);
                if (!id && response.data.length > 0) {
                    setFormData(prev => ({ ...prev, productGroupId: response.data[0].id }));
                }
            } catch (error) {
                console.error('Failed to fetch product groups:', error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await api.get(`/items/categories/${id}`);
                const cat = response.data;
                setFormData({
                    name: cat.name,
                    productGroupId: cat.productGroup?.id || '',
                    description: cat.description || '',
                    displayOrder: cat.displayOrder,
                    tax: cat.tax,
                    status: cat.status,
                    wef: cat.wef ? cat.wef.split('T')[0] : new Date().toISOString().split('T')[0]
                });
            } catch (error) {
                console.error('Failed to fetch category:', error);
                alert('Failed to load category');
            }
        };

        fetchProductGroups();
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const handleSave = async () => {
        if (!formData.name) {
            alert('Name is required');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...formData,
                productGroup: { id: formData.productGroupId }
            };

            if (isEdit) {
                await api.patch(`/items/categories/${id}`, payload);
                alert('Category updated successfully!');
            } else {
                await api.post('/items/categories', payload);
                alert('Category saved successfully!');
            }
            navigate('/settings/masters/category');
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Category' : 'New Category'}</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/settings/masters/category')}
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
                    <div className="max-w-6xl flex gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormInput
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <FormInput
                                    label="Product Group"
                                    type="select"
                                    value={formData.productGroupId}
                                    onChange={(e) => setFormData({ ...formData, productGroupId: e.target.value })}
                                    options={[
                                        { value: '', label: 'Select Group' },
                                        ...productGroups.map(group => ({ value: group.id, label: group.name }))
                                    ]}
                                />

                                <FormInput
                                    label="Display Order"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                />
                                <FormInput
                                    label="Tax"
                                    type="select"
                                    value={formData.tax}
                                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                                    options={[
                                        { value: '18%', label: '18%' },
                                        { value: '12%', label: '12%' },
                                        { value: '5%', label: '5%' }
                                    ]}
                                />

                                <FormInput
                                    label="Status"
                                    type="select"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    options={[
                                        { value: 'Active', label: 'Active' },
                                        { value: 'Inactive', label: 'Inactive' }
                                    ]}
                                />
                                <FormInput
                                    label="W.e.f."
                                    type="date"
                                    icon={Calendar}
                                    value={formData.wef}
                                    onChange={(e) => setFormData({ ...formData, wef: e.target.value })}
                                />
                            </div>
                        </div>

                        <FormInput
                            label="Description"
                            type="textarea"
                            rows={10}
                            placeholder="Input text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            containerClassName="w-1/3"
                            className="h-[calc(100%-2.5rem)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
