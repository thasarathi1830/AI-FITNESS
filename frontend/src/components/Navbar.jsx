/**
 * Navbar Component
 * Navigation bar with authentication state
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">AI</span>
                        </div>
                        <span className="text-xl font-bold text-gradient">FitTracker</span>
                    </Link>

                    {/* Navigation Links */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/dashboard"
                                className={`font-medium transition-colors ${isActive('/dashboard')
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-primary-600'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/food-upload"
                                className={`font-medium transition-colors ${isActive('/food-upload')
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-primary-600'
                                    }`}
                            >
                                Food Tracker
                            </Link>
                            <Link
                                to="/profile"
                                className={`font-medium transition-colors ${isActive('/profile')
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-primary-600'
                                    }`}
                            >
                                Profile
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-300">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
