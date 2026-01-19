import { Sidebar } from '../components/Sidebar';
import { Cart } from '../components/Cart';
import { Outlet, useLocation } from 'react-router-dom';

export const MainLayout = () => {
    const location = useLocation();
    const isSettings = location.pathname.includes('settings');

    return (
        <div className="flex w-full h-screen bg-[#f3f3f3] p-4 gap-4 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex overflow-hidden bg-transparent">
                <div className="flex-1 bg-transparent overflow-hidden flex flex-col">
                    <Outlet />
                </div>
                {!isSettings && <Cart />}
            </main>
        </div>
    );
};
