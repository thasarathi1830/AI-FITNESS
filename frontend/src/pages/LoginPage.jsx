/**
 * Login Page - Matching Dark Theme Design
 * Clean, minimal design with dark background
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeSlashIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1420]/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">AI FITNESS</span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-6 py-2.5 text-white font-medium hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-primary hover:bg-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
                <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Branding & Features */}
                    <div className="space-y-8 animate-fade-in">
                        {/* Logo & Title */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                                    <FireIcon className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white">AI Fitness</h1>
                            </div>

                            <div>
                                <h2 className="text-5xl font-bold text-white leading-tight mb-4">
                                    Start Your
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                                        Transformation
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-400">
                                    Join thousands of users achieving their fitness goals with AI-powered insights.
                                </p>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white text-lg">Smart Calorie Tracking</p>
                                    <p className="text-gray-400">AI-powered food recognition and instant calorie calculation</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white text-lg">Personalized Insights</p>
                                    <p className="text-gray-400">Get tailored recommendations based on your progress</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white text-lg">Expert Guidance</p>
                                    <p className="text-gray-400">Connect with certified trainers for professional support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full max-w-md mx-auto animate-slide-up">
                        <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-10 border border-gray-800 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-gray-400">Sign in to continue your fitness journey</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl animate-shake">
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0f1420] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#0f1420] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all pr-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Signing In...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-primary font-semibold hover:text-emerald-400 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
