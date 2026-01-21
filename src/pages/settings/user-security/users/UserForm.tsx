import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import api from '../../../../services/api';

const MODULES = [
    'User Management',
    'Masters',
    'Settings',
    'Reports',
    'POS',
    'Inventory'
];

export const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const [loading, setLoading] = useState(false);

    // Core user fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'cashier',
        mobileNo: '',
        status: 'Active',
        rightOf: 'All Options', // Placeholder logic
        wef: new Date().toISOString().split('T')[0]
    });

    // Permission Matrix State
    const [permissions, setPermissions] = useState<any[]>(
        MODULES.map(m => ({
            module: m,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canView: false,
            canPrint: false
        }))
    );

    useEffect(() => {
        if (isEditMode) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const data = response.data;
            setFormData({
                name: data.name || '',
                email: data.email || '',
                password: '', // Don't filter back password
                role: data.role || 'cashier',
                mobileNo: data.mobileNo || '',
                status: data.status || 'Active',
                rightOf: 'All Options',
                wef: data.wef ? new Date(data.wef).toISOString().split('T')[0] : ''
            });

            if (data.permissions && data.permissions.length > 0) {
                // Merge existing permissions with default modules to ensure all rows exist
                const mergedPermissions = MODULES.map(m => {
                    const existing = data.permissions.find((p: any) => p.module === m);
                    return existing ? {
                        module: m,
                        canCreate: existing.canCreate,
                        canEdit: existing.canEdit,
                        canDelete: existing.canDelete,
                        canView: existing.canView,
                        canPrint: existing.canPrint
                    } : {
                        module: m,
                        canCreate: false,
                        canEdit: false,
                        canDelete: false,
                        canView: false,
                        canPrint: false
                    };
                });
                setPermissions(mergedPermissions);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            permissions
        };

        // Remove empty password if editing (so we don't overwrite with empty string)
        if (isEditMode && !payload.password) {
            delete (payload as any).password;
        }

        try {
            if (isEditMode) {
                await api.patch(`/users/${id}`, payload);
            } else {
                await api.post('/users', payload);
            }
            navigate('/settings/user-security/users');
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (moduleName: string, field: string, value: boolean) => {
        setPermissions(prev => prev.map(p =>
            p.module === moduleName ? { ...p, [field]: value } : p
        ));
    };

    const toggleAllRow = (moduleName: string, value: boolean) => {
        setPermissions(prev => prev.map(p =>
            p.module === moduleName ? {
                ...p,
                canCreate: value,
                canEdit: value,
                canDelete: value,
                canView: value,
                canPrint: value
            } : p
        ));
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f3f3f3] overflow-hidden">
            <div className="bg-white rounded-[32px] flex-1 flex flex-col shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 bg-[#dbeafe]/50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {isEditMode ? 'Edit User' : 'New User'}
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/settings/user-security/users')}
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

                        {/* Top Section: User Details */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">User Name</label>
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
                                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEditMode ? "Leave blank to keep current" : ""}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="manager">Manager</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Right Of</label>
                                <select
                                    name="rightOf"
                                    value={formData.rightOf}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                >
                                    <option value="All Options">All Options</option>
                                    <option value="Restricted">Restricted</option>
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
                        </div>

                        {/* Permission Matrix */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800">
                                Permissions
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr className="text-slate-500 text-sm">
                                        <th className="px-6 py-3 font-semibold">Select Form</th>
                                        <th className="px-6 py-3 text-center font-semibold">Create</th>
                                        <th className="px-6 py-3 text-center font-semibold">Edit</th>
                                        <th className="px-6 py-3 text-center font-semibold">Delete</th>
                                        <th className="px-6 py-3 text-center font-semibold">View</th>
                                        <th className="px-6 py-3 text-center font-semibold">Print</th>
                                        <th className="px-6 py-3 text-center font-semibold">Select All</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {permissions.map((p, idx) => (
                                        <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {p.module}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.canCreate}
                                                    onChange={(e) => handlePermissionChange(p.module, 'canCreate', e.target.checked)}
                                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.canEdit}
                                                    onChange={(e) => handlePermissionChange(p.module, 'canEdit', e.target.checked)}
                                                    className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.canDelete}
                                                    onChange={(e) => handlePermissionChange(p.module, 'canDelete', e.target.checked)}
                                                    className="w-5 h-5 accent-red-500 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.canView}
                                                    onChange={(e) => handlePermissionChange(p.module, 'canView', e.target.checked)}
                                                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.canPrint}
                                                    onChange={(e) => handlePermissionChange(p.module, 'canPrint', e.target.checked)}
                                                    className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => toggleAllRow(p.module, e.target.checked)}
                                                    className="w-5 h-5 accent-slate-800 rounded cursor-pointer"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};
