import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, FireIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import {
    FEATURED_SPLITS,
    EXERCISE_CATEGORIES,
    loadCategoryExercises,
    loadAllFeaturedExercises,
    searchExercises,
    filterByEquipment,
    filterByMuscle,
    getEquipmentTypes,
    getMuscleGroups
} from '../data/exerciseData';

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [equipmentList, setEquipmentList] = useState([]);
    const [muscleList, setMuscleList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadInitialExercises();
    }, []);

    useEffect(() => {
        if (allExercises.length > 0) {
            setEquipmentList(getEquipmentTypes(allExercises));
            setMuscleList(getMuscleGroups(allExercises));
        }
    }, [allExercises]);

    const loadInitialExercises = async () => {
        setLoading(true);
        try {
            const data = await loadAllFeaturedExercises();
            setAllExercises(data);
            setExercises(data);
        } catch (error) {
            console.error('Error loading exercises:', error);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setSelectedEquipment('');
        setSelectedMuscle('');
        setSearchQuery('');

        setLoading(true);
        try {
            const data = await loadCategoryExercises(category);
            setExercises(data);
        } catch (error) {
            console.error('Error loading category exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        let filtered = allExercises;

        if (searchQuery) {
            filtered = searchExercises(filtered, searchQuery);
        }

        if (selectedEquipment) {
            filtered = filterByEquipment(filtered, selectedEquipment);
        }

        if (selectedMuscle) {
            filtered = filterByMuscle(filtered, selectedMuscle);
        }

        setExercises(filtered);
    };

    const handleEquipmentFilter = (equipment) => {
        setSelectedEquipment(equipment);
        setSelectedCategory('');
        let filtered = allExercises;

        if (equipment) {
            filtered = filterByEquipment(filtered, equipment);
        }

        if (searchQuery) {
            filtered = searchExercises(filtered, searchQuery);
        }

        setExercises(filtered);
    };

    const handleMuscleFilter = (muscle) => {
        setSelectedMuscle(muscle);
        setSelectedCategory('');
        let filtered = allExercises;

        if (muscle) {
            filtered = filterByMuscle(filtered, muscle);
        }

        if (searchQuery) {
            filtered = searchExercises(filtered, searchQuery);
        }

        setExercises(filtered);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedEquipment('');
        setSelectedMuscle('');
        setSearchQuery('');
        setExercises(allExercises);
    };

    const addToActivityLog = (exercise) => {
        navigate('/activity', { state: { exercise } });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Exercise Library</h1>
                <p className="text-dark-text-secondary">Browse 800+ exercises with detailed instructions and images</p>
            </div>

            {/* Featured Exercise Splits */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FireIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-white">Featured Exercise Splits</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(FEATURED_SPLITS).map(([key, split]) => (
                        <button
                            key={key}
                            onClick={() => handleCategoryClick(key)}
                            className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${selectedCategory === key
                                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                                    : 'bg-dark-bg hover:bg-dark-border text-dark-text-secondary hover:text-white'
                                }`}
                        >
                            <div className="text-3xl mb-2">{split.icon}</div>
                            <div className="text-sm font-medium">{split.title}</div>
                            <div className="text-xs opacity-70 mt-1">{split.exercises.length} exercises</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-4">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search exercises by name..."
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 pl-12 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-dark-text-secondary absolute left-4 top-3.5" />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-dark-bg hover:bg-dark-border text-white px-4 py-3 rounded-lg transition-all"
                    >
                        <FunnelIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
                    {/* Equipment Filter */}
                    <div className="mb-6">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Filter by Equipment
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleEquipmentFilter('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedEquipment
                                        ? 'bg-primary text-white'
                                        : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {equipmentList.slice(0, 12).map((equipment) => (
                                <button
                                    key={equipment}
                                    onClick={() => handleEquipmentFilter(equipment)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${selectedEquipment === equipment
                                            ? 'bg-primary text-white'
                                            : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border hover:text-white'
                                        }`}
                                >
                                    {equipment}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Muscle Group Filter */}
                    <div>
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full"></span>
                            Filter by Muscle Group
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleMuscleFilter('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedMuscle
                                        ? 'bg-accent text-white'
                                        : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {muscleList.slice(0, 12).map((muscle) => (
                                <button
                                    key={muscle}
                                    onClick={() => handleMuscleFilter(muscle)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${selectedMuscle === muscle
                                            ? 'bg-accent text-white'
                                            : 'bg-dark-bg text-dark-text-secondary hover:bg-dark-border hover:text-white'
                                        }`}
                                >
                                    {muscle}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                    <p className="text-dark-text-secondary">Loading exercises...</p>
                </div>
            ) : (
                <>
                    {/* Results Count */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-dark-text-secondary">
                            Showing <span className="text-primary font-semibold">{exercises.length}</span> exercises
                        </p>
                        {(selectedCategory || selectedEquipment || selectedMuscle || searchQuery) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-primary hover:text-emerald-400 transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* Exercise Grid */}
                    {exercises.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {exercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="bg-dark-card rounded-xl overflow-hidden border border-dark-border hover:border-primary transition-all group"
                                >
                                    {/* Exercise Image */}
                                    <div className="aspect-square bg-dark-sidebar flex items-center justify-center overflow-hidden">
                                        {exercise.images && exercise.images[0] ? (
                                            <img
                                                src={exercise.images[0]}
                                                alt={exercise.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-dark-text-secondary text-4xl">🏋️</div>
                                        )}
                                    </div>

                                    {/* Exercise Info */}
                                    <div className="p-4">
                                        <h3 className="text-white font-medium mb-2 line-clamp-2 min-h-[3rem]">
                                            {exercise.name}
                                        </h3>

                                        {/* Tags */}
                                        <div className="flex gap-2 mb-3 flex-wrap">
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
                                            {exercise.level && (
                                                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded capitalize">
                                                    {exercise.level}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add Button */}
                                        <button
                                            onClick={() => addToActivityLog(exercise)}
                                            className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add to Log
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-dark-card rounded-xl border border-dark-border">
                            <p className="text-dark-text-secondary text-lg mb-2">No exercises found</p>
                            <p className="text-dark-text-secondary text-sm">Try a different search or filter</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExercisesPage;
