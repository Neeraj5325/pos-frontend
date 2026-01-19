import { useState, useEffect } from 'react';
import {
    Home, Grid, Bookmark, ShoppingCart, MessageSquare, Settings, Power,
    Store, Folder, FileText, Calculator, Tag, Box, Users, Database, Cpu, UserCircle, ChevronDown, ArrowLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, active = false, title, showLabel = false, onClick, hasSubItems = false, isExpanded = false }: {
    icon: any;
    active?: boolean;
    title: string;
    showLabel?: boolean;
    onClick?: () => void;
    hasSubItems?: boolean;
    isExpanded?: boolean;
}) => (
    <div
        title={!showLabel ? title : undefined}
        onClick={onClick}
        className={cn(
            "rounded-2xl cursor-pointer transition-all duration-200 flex items-center",
            showLabel ? "px-4 py-2 gap-3 w-full" : "p-2",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-slate-400 hover:bg-slate-100"
        )}
    >
        <Icon size={showLabel ? 18 : 20} className={cn(active ? "text-white" : showLabel ? "text-slate-400" : "")} />
        {showLabel && (
            <span className={cn(
                "font-medium transition-colors text-sm",
                active ? "text-white" : "text-slate-600"
            )}>
                {title}
            </span>
        )}
        {showLabel && hasSubItems && (
            <ChevronDown size={16} className={cn("ml-auto transition-transform duration-200", active ? "text-white" : "text-primary", isExpanded && "rotate-180")} />
        )}
    </div>
);

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState<'main' | 'settings'>(location.pathname.includes('settings') ? 'settings' : 'main');
    const [isMastersExpanded, setIsMastersExpanded] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (location.pathname.includes('settings')) {
            setView('settings');
        } else {
            setView('main');
        }
    }, [location.pathname]);

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    const isActive = (path: string) => location.pathname === path;
    const isSettingsActive = location.pathname.includes('settings');

    const LogoutModal = () => (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Power size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">Ready to Leave?</h3>
                <p className="text-slate-500 text-center mb-8">Are you sure you want to log out of your account?</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    if (view === 'settings') {
        return (
            <>
                <div className="w-64 h-full bg-white rounded-3xl border border-slate-100 flex flex-col py-6 shadow-sm overflow-hidden">
                    <div className="px-4 mb-8">
                        <button
                            onClick={() => {
                                setView('main');
                                navigate('/');
                            }}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors mb-6 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 px-2">Settings</h2>
                    </div>

                    <div className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
                        <SidebarItem
                            title="Store Profile"
                            icon={Store}
                            showLabel
                            active={isActive('/settings/store-profile')}
                            onClick={() => navigate('/settings/store-profile')}
                        />
                        <SidebarItem
                            title="Masters"
                            icon={Folder}
                            showLabel
                            hasSubItems
                            isExpanded={isMastersExpanded}
                            active={location.pathname.includes('/settings/masters')}
                            onClick={() => setIsMastersExpanded(!isMastersExpanded)}
                        />

                        {isMastersExpanded && (
                            <div className="ml-9 mt-1 space-y-1">
                                <button
                                    onClick={() => navigate('/settings/masters/product-group')}
                                    className={cn(
                                        "w-full text-left py-2 px-3 rounded-xl text-sm transition-colors",
                                        isActive('/settings/masters/product-group') ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    Product Group
                                </button>
                                <button
                                    onClick={() => navigate('/settings/masters/category')}
                                    className={cn(
                                        "w-full text-left py-2 px-3 rounded-xl text-sm transition-colors",
                                        isActive('/settings/masters/category') ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    Category
                                </button>
                                <button
                                    onClick={() => navigate('/settings/masters/product')}
                                    className={cn(
                                        "w-full text-left py-2 px-3 rounded-xl text-sm transition-colors",
                                        isActive('/settings/masters/product') ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    Product
                                </button>
                                <button
                                    onClick={() => navigate('/settings/masters/supplier')}
                                    className={cn(
                                        "w-full text-left py-2 px-3 rounded-xl text-sm transition-colors",
                                        isActive('/settings/masters/supplier') ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    Supplier
                                </button>
                            </div>
                        )}

                        <SidebarItem title="Invoice Settings" icon={FileText} showLabel />
                        <SidebarItem
                            title="Tax Setting"
                            icon={Calculator}
                            showLabel
                            active={isActive('/settings/masters/tax')}
                            onClick={() => navigate('/settings/masters/tax')}
                        />
                        <SidebarItem title="Pricing & Discount" icon={Tag} showLabel />
                        <SidebarItem title="Inventory Settings" icon={Box} showLabel />
                        <SidebarItem
                            title="Update Stock"
                            icon={Box}
                            showLabel
                            active={isActive('/inventory/update-stock')}
                            onClick={() => navigate('/inventory/update-stock')}
                        />
                        <SidebarItem
                            title="User & Security"
                            icon={Users}
                            showLabel
                            active={isActive('/settings/user-security/users')}
                            onClick={() => navigate('/settings/user-security/users')}
                        />
                        <SidebarItem title="Backup & Sync" icon={Database} showLabel />
                        <SidebarItem title="Industry-Specific" icon={Cpu} showLabel />
                        <SidebarItem title="Loyalty program" icon={UserCircle} showLabel />
                    </div>

                    <div className="px-4 mt-auto pt-6 border-t border-slate-50">
                        <SidebarItem title="Logout" icon={Power} showLabel onClick={() => setShowLogoutModal(true)} />
                    </div>
                </div>
                {showLogoutModal && <LogoutModal />}
            </>
        );
    }

    return (
        <>
            <div className="w-[72px] h-full bg-white rounded-3xl border border-slate-100 flex flex-col items-center py-6 justify-between shadow-sm">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 text-primary flex items-center justify-center mb-4 cursor-pointer" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className="opacity-20" />
                            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            <path d="M12 7v5l3 3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <SidebarItem title="Dashboard" icon={Home} onClick={() => navigate('/dashboard')} active={isActive('/dashboard')} />
                    <SidebarItem title="Items" icon={Grid} onClick={() => navigate('/')} active={isActive('/')} />
                    <SidebarItem title="Saved cart" icon={Bookmark} onClick={() => navigate('/saved-cart')} active={isActive('/saved-cart')} />
                    <SidebarItem title="Orders List" icon={ShoppingCart} onClick={() => navigate('/orders')} active={isActive('/orders')} />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <SidebarItem title="Settings" icon={Settings} active={isSettingsActive} onClick={() => {
                        setView('settings');
                        navigate('/settings/store-profile');
                    }} />
                    <SidebarItem title="Logout" icon={Power} onClick={() => setShowLogoutModal(true)} />
                </div>
            </div>
            {showLogoutModal && <LogoutModal />}
        </>
    );
};
