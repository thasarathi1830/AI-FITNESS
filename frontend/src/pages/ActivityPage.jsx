import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BoltIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
    loadAllFeaturedExercises,
    searchExercises,
    filterByEquipment,
    getEquipmentTypes
} from '../data/exerciseData';

const ActivityPage = () => {
    const [activityName, setActivityName] = useState('');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Exercise browser state
    const [exercises, setExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [equipmentList, setEquipmentList] = useState([]);
    const [showExerciseBrowser, setShowExerciseBrowser] = useState(false);
    const [loadingExercises, setLoadingExercises] = useState(false);

    const quickActivities = [
        { name: 'Running', icon: '🏃', calories: 300 },
        { name: 'Cycling', icon: '🚴', calories: 250 },
        { name: 'Swimming', icon: '🏊', calories: 400 },
        { name: 'Yoga', icon: '🧘', calories: 150 },
        { name: 'Weight Training', icon: '🏋️', calories: 200 },
        { name: 'Walking', icon: '🚶', calories: 150 },
    ];

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        setLoadingExercises(true);
        try {
            const data = await loadAllFeaturedExercises();
            setAllExercises(data);
            setExercises(data.slice(0, 12));
            setEquipmentList(getEquipmentTypes(data));
        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            setLoadingExercises(false);
        }
    };

    const searchExercisesLocal = () => {
        if (!searchQuery.trim()) {
            setExercises(allExercises.slice(0, 12));
            return;
        }

        const filtered = searchExercises(allExercises, searchQuery);
        setExercises(filtered.slice(0, 12));
    };

    const filterByEquipmentLocal = (equipment) => {
        setSelectedEquipment(equipment);
        if (!equipment) {
            setExercises(allExercises.slice(0, 12));
            return;
        }

        const filtered = filterByEquipment(allExercises, equipment);
        setExercises(filtered.slice(0, 12));
    };

    const handleQuickAdd = async (activity) => {
        try {
            await api.post('/api/activity', {
                activity_type: activity.name.toLowerCase(),
                duration_minutes: 30,
                date: new Date().toISOString().split('T')[0]
            });
            setMessage(`✅ ${activity.name} logged successfully!`);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error logging activity');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/api/activity', {
                activity_type: activityName.toLowerCase(),
                duration_minutes: parseInt(duration),
                date: new Date().toISOString().split('T')[0]
            });

            setMessage('✅ Activity logged successfully!');
            setActivityName('');
            setDuration('');
            setCaloriesBurned('');
        } catch (error) {
            setMessage('❌ Error logging activity');
        } finally {
            setLoading(false);
        }
    };

    const addExerciseToLog = (exercise) => {
        setActivityName(exercise.name);
        setCaloriesBurned(200); // Default calories
        setDuration(30); // Default 30 minutes
        setShowExerciseBrowser(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Activity Tracker</h1>
                <p className="text-dark-text-secondary">Log your workouts and track calories burned</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                    {message}
                </div>
            )}

            {/* Quick Add Activities */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Add</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActivities.map((activity) => (
                        <button
                            key={activity.name}
                            onClick={() => handleQuickAdd(activity)}
                            className="bg-dark-bg hover:bg-dark-border rounded-lg p-4 text-center transition-all hover:scale-105"
                        >
                            <div className="text-3xl mb-2">{activity.icon}</div>
                            <div className="text-white text-sm font-medium mb-1">{activity.name}</div>
                            <div className="text-dark-text-secondary text-xs">{activity.calories} cal</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Exercise Browser Toggle */}
            <div className="mb-6">
                <button
                    onClick={() => setShowExerciseBrowser(!showExerciseBrowser)}
                    className="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                    <BoltIcon className="w-5 h-5" />
                    {showExerciseBrowser ? 'Hide' : 'Browse'} Exercise Database
                </button>
            </div>

            {/* Exercise Browser */}
            {showExerciseBrowser && (
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Exercise Database</h2>

                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchExercisesLocal()}
                                    placeholder="Search exercises..."
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                                />
                                <MagnifyingGlassIcon className="w-5 h-5 text-dark-text-secondary absolute right-3 top-3.5" />
                            </div>
                            <button
                                onClick={searchExercisesLocal}
                                className="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                            >
                                Search
                            </button>
                        </div>

                        {/* Equipment Filter */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => filterByEquipmentLocal('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedEquipment
                                    ? 'bg-primary text-white'
                                    : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border'
                                    }`}
                            >
                                All
                            </button>
                            {equipmentList.slice(0, 8).map((equipment) => (
                                <button
                                    key={equipment}
                                    onClick={() => filterByEquipmentLocal(equipment)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${selectedEquipment === equipment
                                        ? 'bg-primary text-white'
                                        : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border'
                                        }`}
                                >
                                    {equipment}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Exercise Grid */}
                    {loadingExercises ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {exercises.slice(0, 12).map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="bg-dark-bg rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-all group"
                                >
                                    <div className="aspect-video bg-dark-sidebar flex items-center justify-center overflow-hidden">
                                        {exercise.images && exercise.images[0] ? (
                                            <img
                                                src={exercise.images[0]}
                                                alt={exercise.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-dark-text-secondary text-4xl">🏋️</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-medium mb-2 capitalize">{exercise.name}</h3>
                                        <div className="flex gap-2 mb-3">
                                            {exercise.equipment && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                                                    {exercise.equipment}
                                                </span>
                                            )}
                                            {exercise.primaryMuscles && exercise.primaryMuscles[0] && (
                                                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">
                                                    {exercise.primaryMuscles[0]}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addExerciseToLog(exercise)}
                                            className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add to Log
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Custom Activity Form */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-4">Log Custom Activity</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-dark-text-secondary mb-2">Activity Name</label>
                        <input
                            type="text"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            required
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            placeholder="e.g., Morning Run"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-dark-text-secondary mb-2">Duration (minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                                min="1"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                                placeholder="30"
                            />
                        </div>

                        <div>
                            <label className="block text-dark-text-secondary mb-2">Calories Burned</label>
                            <input
                                type="number"
                                value={caloriesBurned}
                                onChange={(e) => setCaloriesBurned(e.target.value)}
                                required
                                min="1"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                                placeholder="200"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <BoltIcon className="w-5 h-5" />
                        {loading ? 'Logging...' : 'Log Activity'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActivityPage;
