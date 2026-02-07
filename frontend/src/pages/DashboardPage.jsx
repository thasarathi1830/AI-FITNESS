import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MotivationalQuote from '../components/MotivationalQuote';
import { FireIcon, BoltIcon, UsersIcon } from '@heroicons/react/24/solid';

const DashboardPage = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await api.get(`/api/dashboard/summary?date=${today}`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <MotivationalQuote />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">
                    {getGreeting()}, {user?.name || 'there'}! 👋
                </h1>
                <p className="text-dark-text-secondary">Here's your fitness summary for today</p>
            </div>

            {/* Compact Stats Grid - 5 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Calories Consumed */}
                <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FireIcon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-dark-text-secondary text-sm">Consumed</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {summary?.total_calories_consumed || 0}
                    </p>
                    <p className="text-xs text-dark-text-secondary">
                        / {summary?.calorie_intake_goal || 2100}
                    </p>
                    <div className="mt-2 bg-dark-bg rounded-full h-1.5">
                        <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{
                                width: `${Math.min(
                                    ((summary?.total_calories_consumed || 0) / (summary?.calorie_intake_goal || 2100)) * 100,
                                    100
                                )}%`
                            }}
                        />
                    </div>
                </div>

                {/* Calories Burned */}
                <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                            <BoltIcon className="w-4 h-4 text-accent" />
                        </div>
                        <h3 className="text-dark-text-secondary text-sm">Burned</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {summary?.total_calories_burned || 0}
                    </p>
                    <p className="text-xs text-dark-text-secondary">
                        / {summary?.calorie_burn_goal || 650}
                    </p>
                    <div className="mt-2 bg-dark-bg rounded-full h-1.5">
                        <div
                            className="bg-accent h-1.5 rounded-full transition-all"
                            style={{
                                width: `${Math.min(
                                    ((summary?.total_calories_burned || 0) / (summary?.calorie_burn_goal || 650)) * 100,
                                    100
                                )}%`
                            }}
                        />
                    </div>
                </div>

                {/* Calories Left - NEW */}
                <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(summary?.calories_left || 0) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                            <FireIcon className={`w-4 h-4 ${(summary?.calories_left || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                                }`} />
                        </div>
                        <h3 className="text-dark-text-secondary text-sm">Left</h3>
                    </div>
                    <p className={`text-2xl font-bold mb-1 ${(summary?.calories_left || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {summary?.calories_left || 0}
                    </p>
                    <p className="text-xs text-dark-text-secondary">
                        {(summary?.calories_left || 0) >= 0 ? 'remaining' : 'over limit'}
                    </p>
                </div>

                {/* Workouts */}
                <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <BoltIcon className="w-4 h-4 text-secondary" />
                        </div>
                        <h3 className="text-dark-text-secondary text-sm">Workouts</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {summary?.activity_log_count || 0}
                    </p>
                    <p className="text-xs text-dark-text-secondary">logged</p>
                </div>

                {/* Meals */}
                <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FireIcon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-dark-text-secondary text-sm">Meals</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {summary?.food_log_count || 0}
                    </p>
                    <p className="text-xs text-dark-text-secondary">logged</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Link
                    to="/food"
                    className="bg-gradient-to-br from-primary to-emerald-600 rounded-xl p-6 text-white hover:scale-105 transition-transform"
                >
                    <FireIcon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-bold mb-1">Log Food</h3>
                    <p className="text-white/80 text-sm">AI-powered food scanner</p>
                </Link>

                <Link
                    to="/activity"
                    className="bg-gradient-to-br from-accent to-purple-600 rounded-xl p-6 text-white hover:scale-105 transition-transform"
                >
                    <BoltIcon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-bold mb-1">Log Activity</h3>
                    <p className="text-white/80 text-sm">Track your workouts</p>
                </Link>

                <Link
                    to="/trainers"
                    className="bg-gradient-to-br from-secondary to-blue-600 rounded-xl p-6 text-white hover:scale-105 transition-transform"
                >
                    <UsersIcon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-bold mb-1">Find Trainers</h3>
                    <p className="text-white/80 text-sm">Hire certified professionals</p>
                </Link>
            </div>

            {/* This Week's Progress with Water Fill */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-4">This Week's Progress</h2>
                <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        // Calculate fill percentage based on calories left
                        // For demo: using current day's data for today, random for other days
                        const isToday = index === new Date().getDay() - 1;
                        const caloriesLeft = isToday ? (summary?.calories_left || 0) : (Math.random() * 1000 - 200);
                        const goal = summary?.calorie_intake_goal || 2100;
                        const fillPercentage = Math.max(0, Math.min(100, (caloriesLeft / goal) * 100));

                        // Color based on progress
                        let fillColor = 'from-green-500 to-emerald-400';
                        if (caloriesLeft < 0) fillColor = 'from-red-500 to-rose-400';
                        else if (caloriesLeft < goal * 0.2) fillColor = 'from-yellow-500 to-amber-400';

                        return (
                            <div key={day} className="text-center">
                                <p className="text-dark-text-secondary text-xs mb-2">{day}</p>
                                <div className="bg-dark-bg rounded-lg h-32 relative overflow-hidden">
                                    {/* Water fill with animation */}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${fillColor} transition-all duration-500 ease-out`}
                                        style={{ height: `${fillPercentage}%` }}
                                    >
                                        {/* Wave effect */}
                                        <div className="absolute top-0 left-0 right-0 h-2 opacity-50">
                                            <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                                                <path
                                                    d="M0,5 Q25,0 50,5 T100,5 L100,10 L0,10 Z"
                                                    fill="currentColor"
                                                    className="animate-wave"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Calories left text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold drop-shadow-lg">
                                            {Math.round(caloriesLeft)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs mt-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        <span className="text-dark-text-secondary">Good</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                        <span className="text-dark-text-secondary">Low</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        <span className="text-dark-text-secondary">Over</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
