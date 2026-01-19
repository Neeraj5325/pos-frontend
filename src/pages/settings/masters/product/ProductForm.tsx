import { useState, useEffect } from 'react';
import { X, Save, Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { FormInput } from '../../../../components/ui/FormInput';

export const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        brand: 'Red Tape',
        barcode: '',
        unit: 'Pcs',
        gst: '18%',
        hsnCode: '',
        openingStock: 0,
        cost: 1000.00,
        mrp: 1500.00,
        discountPercentage: 10,
        sellingPrice: 1350.00,
        trackQty: 'Yes',
        lowStockAlert: 5,
        status: 'Active',
        description: '',
        image: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/items/categories');
                setCategories(response.data);
                if (!id && response.data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await api.get(`/items/${id}`);
                const prod = response.data;
                setFormData({
                    ...prod,
                    categoryId: prod.category?.id || '',
                    cost: Number(prod.cost),
                    mrp: Number(prod.mrp),
                    discountPercentage: Number(prod.discountPercentage),
                    sellingPrice: Number(prod.sellingPrice),
                    trackQty: prod.trackQty ? 'Yes' : 'No'
                });
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('Failed to load product');
            }
        };

        fetchCategories();
        if (id) {
            fetchProduct();
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
                price: formData.sellingPrice,
                category: { id: formData.categoryId },
                trackQty: formData.trackQty === 'Yes'
            };

            if (isEdit) {
                await api.patch(`/items/${id}`, payload);
                alert('Product updated successfully!');
            } else {
                await api.post('/items', payload);
                alert('Product saved successfully!');
            }
            navigate('/settings/masters/product');
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Product' : 'New Product'}</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/settings/masters/product')}
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
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar text-sm">
                    <div className="max-w-7xl space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-4 gap-6">
                            <FormInput
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                containerClassName="col-span-1"
                            />
                            <FormInput
                                label="Category"
                                type="select"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                            />
                            <FormInput
                                label="Brand"
                                type="select"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                options={[
                                    { value: 'Red Tape', label: 'Red Tape' },
                                    { value: 'Nike', label: 'Nike' }
                                ]}
                            />
                            <FormInput
                                label="Barcode"
                                placeholder="Input text"
                                value={formData.barcode}
                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-4 gap-6">
                            <FormInput
                                label="Unit"
                                type="select"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                options={[
                                    { value: 'Pcs', label: 'Pcs' },
                                    { value: 'Kg', label: 'Kg' }
                                ]}
                            />
                            <FormInput
                                label="GST"
                                type="select"
                                value={formData.gst}
                                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                options={[
                                    { value: '18%', label: '18%' },
                                    { value: '12%', label: '12%' },
                                    { value: '5%', label: '5%' }
                                ]}
                            />
                            <FormInput
                                label="HSN Code"
                                placeholder="Input text"
                                value={formData.hsnCode}
                                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                            />
                            <FormInput
                                label="Opening Stock"
                                placeholder="Input text"
                                value={formData.openingStock}
                                onChange={(e) => setFormData({ ...formData, openingStock: parseInt(e.target.value) })}
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-4 gap-6">
                            <FormInput
                                label="Cost"
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                            />
                            <FormInput
                                label="MRP"
                                type="number"
                                value={formData.mrp}
                                onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) })}
                            />
                            <FormInput
                                label="Discount %"
                                type="number"
                                value={formData.discountPercentage}
                                onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })}
                                rightElement={<span className="text-slate-400 font-bold">%</span>}
                            />
                            <FormInput
                                label="Selling Price"
                                type="number"
                                value={formData.sellingPrice}
                                onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                            />
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-4 gap-6">
                            <FormInput
                                label="Track Qty"
                                type="select"
                                value={formData.trackQty}
                                onChange={(e) => setFormData({ ...formData, trackQty: e.target.value })}
                                options={[
                                    { value: 'Yes', label: 'Yes' },
                                    { value: 'No', label: 'No' }
                                ]}
                            />
                            <FormInput
                                label="Low Stock Alert"
                                type="number"
                                value={formData.lowStockAlert}
                                onChange={(e) => setFormData({ ...formData, lowStockAlert: parseInt(e.target.value) })}
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
                        </div>

                        {/* Description & Image */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <FormInput
                                    label="Item Description"
                                    type="textarea"
                                    rows={8}
                                    placeholder="Input text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-600 mb-2">Item Image</label>
                                <div className="w-full h-[220px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4 hover:border-primary hover:bg-slate-50 transition-all cursor-pointer">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                                        <Camera size={32} />
                                    </div>
                                    <span className="font-medium text-slate-400">Click to upload or drag & drop</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
