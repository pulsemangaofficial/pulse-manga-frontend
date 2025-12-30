import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
            {/* Footer can go here */}
        </div>
    );
};
