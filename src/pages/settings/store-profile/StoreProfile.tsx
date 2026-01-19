import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { FormInput } from '../../../components/ui/FormInput';

export const StoreProfile = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        country: '',
        state: 'Delhi',
        city: '',
        pinCode: '',
        mobile: '',
        email: '',
        gstRegistrationType: 'Registered',
        gstin: ''
    });

    useEffect(() => {
        if (user?.tenant) {
            setFormData({
                name: user.tenant.name || '',
                address: user.tenant.address || '',
                country: user.tenant.country || '',
                state: user.tenant.state || 'Delhi',
                city: user.tenant.city || '',
                pinCode: user.tenant.pinCode || '',
                mobile: user.tenant.mobile || '',
                email: user.tenant.email || '',
                gstRegistrationType: user.tenant.gstRegistrationType || 'Registered',
                gstin: user.tenant.gstin || ''
            });
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!user?.tenant?.id) return;
        setLoading(true);
        try {
            await api.patch(`/tenants/${user.tenant.id}`, formData);
            // Optionally update store/user context here if needed
            alert('Store details updated successfully!');
        } catch (error) {
            console.error('Failed to update store details:', error);
            alert('Failed to update store details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Store Details</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
                        >
                            <X size={18} /> Close
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            <Save size={18} /> {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="max-w-4xl space-y-6">
                        <FormInput
                            label="Store Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <FormInput
                            label="Address"
                            type="textarea"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Country/Region"
                                type="select"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                options={[
                                    { value: '', label: 'Select Country' },
                                    { value: 'India', label: 'India' },
                                    { value: 'UK', label: 'UK' }
                                ]}
                            />
                            <FormInput
                                label="State/"
                                type="select"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                options={[
                                    { value: 'Delhi', label: 'Delhi' },
                                    { value: 'London', label: 'London' }
                                ]}
                            />

                            <FormInput
                                label="City"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                            <FormInput
                                label="Pin Code"
                                placeholder="Input code"
                                value={formData.pinCode}
                                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            />

                            <FormInput
                                label="Mobile"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                placeholder="Input code"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <FormInput
                                label="GST Registration Type"
                                type="select"
                                value={formData.gstRegistrationType}
                                onChange={(e) => setFormData({ ...formData, gstRegistrationType: e.target.value })}
                                options={[
                                    { value: 'Registered', label: 'Registered' },
                                    { value: 'Unregistered', label: 'Unregistered' }
                                ]}
                            />
                            <FormInput
                                label="GSTIN"
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
