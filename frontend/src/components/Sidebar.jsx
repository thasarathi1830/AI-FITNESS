import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HomeIcon,
    FireIcon,
    BoltIcon,
    UserIcon,
    UsersIcon,
    SunIcon,
    MoonIcon,
    ArrowRightOnRectangleIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const menuItems = [
        { name: 'Home', path: '/dashboard', icon: HomeIcon },
        { name: 'Food', path: '/food', icon: FireIcon },
        { name: 'Activity', path: '/activity', icon: BoltIcon },
        { name: 'Exercise DB', path: '/exercises', icon: AcademicCapIcon },
        { name: 'Trainers', path: '/trainers', icon: UsersIcon },
        { name: 'Register as Trainer', path: '/register-trainer', icon: UserIcon },
        { name: 'Profile', path: '/profile', icon: UserIcon },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-dark-sidebar border-r border-dark-border flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <BoltIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">FitTrack</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                ? 'bg-primary text-white'
                                : 'text-dark-text-secondary hover:bg-dark-card hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-dark-border space-y-2">

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
