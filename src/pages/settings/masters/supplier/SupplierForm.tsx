import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import api from '../../../../services/api';

export const SupplierForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        supplierType: 'Whole Seller',
        address: '',
        gstRegistrationType: 'Registered',
        gstin: '',
        openingBalance: '',
        paymentTerm: '',
        state: 'Delhi', // Default as per screenshot
        city: '',
        pinCode: '',
        mobileNo: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchSupplier();
        }
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const response = await api.get(`/suppliers/${id}`);
            const data = response.data;
            setFormData({
                name: data.name || '',
                supplierType: data.supplierType || 'Whole Seller',
                address: data.address || '',
                gstRegistrationType: data.gstRegistrationType || 'Registered',
                gstin: data.gstin || '',
                openingBalance: data.openingBalance || '',
                paymentTerm: data.paymentTerm || '',
                state: data.state || 'Delhi',
                city: data.city || '',
                pinCode: data.pinCode || '',
                mobileNo: data.mobileNo || ''
            });
        } catch (error) {
            console.error('Failed to fetch supplier:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.patch(`/suppliers/${id}`, formData);
            } else {
                await api.post('/suppliers', formData);
            }
            navigate('/settings/masters/supplier');
        } catch (error) {
            console.error('Failed to save supplier:', error);
            alert('Failed to save supplier');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                            {isEditMode ? 'Edit Supplier' : 'Supplier / Vendor'}
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/settings/masters/supplier')}
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
                    <form className="max-w-6xl">
                        <div className="grid grid-cols-12 gap-x-8 gap-y-6">

                            {/* Left Column - 4 cols */}
                            <div className="col-span-4 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">GST Registration</label>
                                    <select
                                        name="gstRegistrationType"
                                        value={formData.gstRegistrationType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                    >
                                        <option value="Registered">Registered</option>
                                        <option value="Unregistered">Unregistered</option>
                                        <option value="Composition">Composition</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Opening Balance</label>
                                    <input
                                        type="number"
                                        name="openingBalance"
                                        value={formData.openingBalance}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Middle Column - 4 cols */}
                            <div className="col-span-4 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Supplier Type</label>
                                    <select
                                        name="supplierType"
                                        value={formData.supplierType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                    >
                                        <option value="Whole Seller">Whole Seller</option>
                                        <option value="Retailer">Retailer</option>
                                        <option value="Distributor">Distributor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">GSTIN</label>
                                    <input
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Term</label>
                                    <input
                                        type="text"
                                        name="paymentTerm"
                                        value={formData.paymentTerm}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Right Column - 4 cols */}
                            <div className="col-span-4 space-y-6">
                                <div className="h-[200px]">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full h-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="Input text"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        >
                                            <option value="Delhi">Delhi</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            {/* Add more states as needed */}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pin Code</label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile No</label>
                                        <input
                                            type="text"
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
