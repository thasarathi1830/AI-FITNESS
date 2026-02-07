/**
 * Landing Page - Premium Fitness Website
 * Inspired by modern fitness website design
 */
import { Link } from 'react-router-dom';
import {
    FireIcon,
    BoltIcon,
    HeartIcon,
    PlayIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/solid';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <FireIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">AI FITNESS</span>
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

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg/95 to-dark-bg/90 z-10"></div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 animate-fade-in">
                        <div className="inline-block">
                            <span className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold">
                                READY TO CHANGE YOUR PHYSIQUE
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                            <span className="text-white">KEEP BODY</span>
                            <br />
                            <span className="text-white">FIT & </span>
                            <span className="text-primary">STRONG</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-lg">
                            Ready to change your physique, but can't work out in the gym?
                            Get AI-powered fitness tracking and personalized guidance.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-primary hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                JOIN WITH US
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                            <button className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-primary text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                                <PlayIcon className="w-5 h-5" />
                                OUR SERVICES
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Hero Images */}
                    <div className="relative hidden md:block animate-slide-up">
                        <div className="relative">
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>

                            {/* Main Image Container */}
                            <div className="relative rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20">
                                <img
                                    src="/src/assets/images/img1.jpg"
                                    alt="Fitness Training"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </section>


            {/* Services Section */}
            <section className="py-20 bg-dark-bg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm tracking-wider">OUR SERVICES</span>
                        <h2 className="text-4xl font-bold text-white mt-4">Our Service For You</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <FireIcon className="w-12 h-12" />,
                                title: "AI Food Scanner",
                                description: "Snap a photo and get instant calorie detection with AI-powered analysis"
                            },
                            {
                                icon: <BoltIcon className="w-12 h-12" />,
                                title: "Activity Tracking",
                                description: "Monitor your workouts and track calories burned in real-time"
                            },
                            {
                                icon: <HeartIcon className="w-12 h-12" />,
                                title: "Personal Trainers",
                                description: "Connect with certified trainers for professional guidance and support"
                            },
                            {
                                icon: <ChartBarIcon className="w-12 h-12" />,
                                title: "Progress Analytics",
                                description: "Visualize your fitness journey with detailed charts and insights"
                            }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="group bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                            >
                                <div className="w-16 h-16 bg-dark-bg rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-gray-400 mb-6">{service.description}</p>
                                <button className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                    READ MORE
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Features Section */}
            <section className="py-20 bg-dark-bg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-primary font-semibold text-sm tracking-wider">ABOUT US</span>
                            <h2 className="text-4xl font-bold text-white">
                                Unleashing Potential With Intense Fitness Workouts
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Body Fitness provides professional service based of physical health and well being,
                                combined of exercise, nutrition, and mental wellness. Our trainers are dedicated
                                to helping you achieve your fitness goals with personalized workout plans.
                            </p>

                            <div className="space-y-3">
                                {[
                                    "Over 10 years of experience",
                                    "Excellent Trainers",
                                    "Flexible Time",
                                    "Exceptional track record"
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className="inline-block px-8 py-4 bg-primary hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all mt-6"
                            >
                                MORE ABOUT US
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20">
                                <img
                                    src="/src/assets/images/img2.jpg"
                                    alt="Fitness Community"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark-card border-t border-dark-border py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
                                    <FireIcon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-white">AI FITNESS</span>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Transform your fitness journey with AI-powered tracking and personalized guidance.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                <a
                                    href="https://www.instagram.com/thasarathi_1830/?next=%2F&hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-dark-bg hover:bg-primary rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/thasarrathi-s/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-dark-bg hover:bg-primary rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/register" className="text-gray-400 hover:text-primary transition-colors">Get Started</Link></li>
                                <li><Link to="/login" className="text-gray-400 hover:text-primary transition-colors">Login</Link></li>
                                <li><a href="#services" className="text-gray-400 hover:text-primary transition-colors">Services</a></li>
                                <li><a href="#about" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Get In Touch</h3>
                            <p className="text-gray-400 mb-2">Ready to start your fitness journey?</p>
                            <Link
                                to="/register"
                                className="inline-block px-6 py-3 bg-primary hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all mt-4"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-dark-border pt-8 text-center text-gray-400">
                        <p>&copy; 2026 AI Fitness. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
