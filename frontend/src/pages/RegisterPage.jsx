/**
 * Register Page - Matching Landing Page Theme
 * Dark theme with green accents
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/helpers';
import { EyeIcon, EyeSlashIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await signup(formData.email, formData.password, formData.name);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 100, label: 'Strong', color: 'bg-primary' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">AI FITNESS</span>
                        </Link>

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
            <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-32">
                <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Benefits */}
                    <div className="hidden md:block space-y-8 animate-fade-in">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                                    <FireIcon className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white">AI Fitness</h1>
                            </div>
                            <h2 className="text-5xl font-bold leading-tight text-white">
                                Start Your
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-purple-500">
                                    Transformation
                                </span>
                            </h2>
                            <p className="text-xl text-gray-400">
                                Join thousands of users achieving their fitness goals with AI-powered insights.
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-lg text-white">Smart Calorie Tracking</p>
                                    <p className="text-gray-400">AI-powered food recognition and instant calorie calculation</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-lg text-white">Personalized Insights</p>
                                    <p className="text-gray-400">Get tailored recommendations based on your progress</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-lg text-white">Expert Guidance</p>
                                    <p className="text-gray-400">Connect with certified trainers for professional support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="w-full">
                        <div className="bg-dark-card rounded-3xl p-8 md:p-10 border border-dark-border shadow-2xl animate-slide-up">
                            {/* Mobile Logo */}
                            <div className="md:hidden flex items-center justify-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                    <FireIcon className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">AI Fitness</h1>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-gray-400">Start your AI-powered fitness journey</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl animate-shake">
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
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
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all pr-12"
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
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-400">Password Strength</span>
                                                <span className={`text-xs font-medium ${passwordStrength.strength === 100 ? 'text-primary' :
                                                        passwordStrength.strength === 66 ? 'text-yellow-400' :
                                                            'text-red-400'
                                                    }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="w-full bg-dark-bg rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.strength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all pr-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? (
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
                                    className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Creating Account...</span>
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-primary font-semibold hover:text-emerald-400 transition-colors"
                                    >
                                        Sign In
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

export default RegisterPage;
