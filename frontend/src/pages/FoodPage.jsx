import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { CameraIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import MotivationalQuote from '../components/MotivationalQuote';

const FoodPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [mealType, setMealType] = useState('Snack');
    const fileInputRef = useRef(null);

    // Logged meals state
    const [loggedMeals, setLoggedMeals] = useState([]);
    const [loadingMeals, setLoadingMeals] = useState(false);

    // Meal logging state
    const [meals, setMeals] = useState({
        breakfast: { name: '', calories: '' },
        lunch: { name: '', calories: '' },
        dinner: { name: '', calories: '' }
    });

    // Snack logging state
    const [snacks, setSnacks] = useState([
        { name: '', calories: '' },
        { name: '', calories: '' },
        { name: '', calories: '' }
    ]);


    // Fetch logged meals on component mount
    useEffect(() => {
        fetchLoggedMeals();
    }, []);

    const fetchLoggedMeals = async () => {
        setLoadingMeals(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await api.get(`/api/food/logs?date=${today}`);
            setLoggedMeals(response.data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        } finally {
            setLoadingMeals(false);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await api.delete(`/api/food/logs/${mealId}`);
            setMessage('✅ Meal deleted successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchLoggedMeals(); // Refresh the list
        } catch (error) {
            setMessage('❌ Error deleting meal');
            setTimeout(() => setMessage(''), 3000);
            console.error(error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('date', new Date().toISOString().split('T')[0]);
        formData.append('meal_type', mealType);

        try {
            // Use /api/food/upload to save to DB directly
            const response = await api.post('/api/food/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
            setSelectedFile(null);
            setPreview(null);
            setMessage('✅ Food analyzed and logged successfully!');
            fetchLoggedMeals(); // Refresh the list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.detail || '❌ Failed to analyze food image');
            setTimeout(() => setMessage(''), 3000);
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleMealChange = (mealType, field, value) => {
        setMeals(prev => ({
            ...prev,
            [mealType]: { ...prev[mealType], [field]: value }
        }));
    };

    const handleSnackChange = (index, field, value) => {
        setSnacks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleLogMeal = async (mealType) => {
        const meal = meals[mealType];
        if (!meal.name || !meal.calories) {
            setMessage('❌ Please fill in both food name and calories');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            await api.post('/api/food/manual', {
                food_name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal.name}`,
                quantity: '1 serving',
                calories: parseFloat(meal.calories),
                date: new Date().toISOString().split('T')[0]
            });
            setMessage(`✅ ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} logged successfully!`);
            setMeals(prev => ({ ...prev, [mealType]: { name: '', calories: '' } }));
            fetchLoggedMeals(); // Refresh the list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error logging meal');
            setTimeout(() => setMessage(''), 3000);
            console.error(error);
        }
    };

    const handleLogSnack = async (index) => {
        const snack = snacks[index];
        if (!snack.name || !snack.calories) {
            setMessage('❌ Please fill in both food name and calories');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            await api.post('/api/food/manual', {
                food_name: `Snack ${index + 1}: ${snack.name}`,
                quantity: '1 serving',
                calories: parseFloat(snack.calories),
                date: new Date().toISOString().split('T')[0]
            });
            setMessage(`✅ Snack ${index + 1} logged successfully!`);
            setSnacks(prev => {
                const updated = [...prev];
                updated[index] = { name: '', calories: '' };
                return updated;
            });
            fetchLoggedMeals(); // Refresh the list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error logging snack');
            setTimeout(() => setMessage(''), 3000);
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <MotivationalQuote />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Food Log</h1>
                <p className="text-dark-text-secondary">Track your daily intake with AI-powered food analysis</p>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                    {message}
                </div>
            )}

            {/* AI Food Snap Section */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-6">AI Food Snap</h2>

                {!preview ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-dark-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-all"
                    >
                        <CameraIcon className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
                        <p className="text-white font-medium mb-2">Click to upload food image</p>
                        <p className="text-dark-text-secondary text-sm">AI will analyze calories and nutrition</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <img
                            src={preview}
                            alt="Food preview"
                            className="w-full h-64 object-cover rounded-xl"
                        />

                        {/* Meal Type Selector */}
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Select Meal Type</label>
                            <select
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                            >
                                <option value="Breakfast">🍳 Breakfast</option>
                                <option value="Lunch">🍔 Lunch</option>
                                <option value="Dinner">🍝 Dinner</option>
                                <option value="Snack">🍿 Snack</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleUpload}
                                disabled={analyzing}
                                className="flex-1 bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                            >
                                {analyzing ? 'Analyzing...' : 'Analyze Food'}
                            </button>
                            <button
                                onClick={() => {
                                    setPreview(null);
                                    setSelectedFile(null);
                                }}
                                className="px-6 bg-dark-bg text-dark-text-secondary hover:text-white rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-white">Analysis Result</h3>
                        <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                            <span className="text-dark-text">Food Item</span>
                            <span className="text-white font-semibold">{result.food_name}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                            <span className="text-dark-text">Calories</span>
                            <span className="text-2xl font-bold text-primary">{result.calories} kcal</span>
                        </div>
                        {result.protein && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-dark-bg rounded-lg text-center">
                                    <p className="text-dark-text-secondary text-sm mb-1">Protein</p>
                                    <p className="text-white font-semibold">{result.protein?.replace('g', '')}g</p>
                                </div>
                                <div className="p-4 bg-dark-bg rounded-lg text-center">
                                    <p className="text-dark-text-secondary text-sm mb-1">Carbs</p>
                                    <p className="text-white font-semibold">{result.carbs?.replace('g', '')}g</p>
                                </div>
                                <div className="p-4 bg-dark-bg rounded-lg text-center">
                                    <p className="text-dark-text-secondary text-sm mb-1">Fats</p>
                                    <p className="text-white font-semibold">{result.fats?.replace('g', '')}g</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Log Meals Section */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-6">Log Meals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Breakfast */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            🍳 Breakfast
                        </h3>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Food Name</label>
                            <input
                                type="text"
                                value={meals.breakfast.name}
                                onChange={(e) => handleMealChange('breakfast', 'name', e.target.value)}
                                placeholder="e.g., Oatmeal with fruits"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Calories</label>
                            <input
                                type="number"
                                value={meals.breakfast.calories}
                                onChange={(e) => handleMealChange('breakfast', 'calories', e.target.value)}
                                placeholder="300"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button
                            onClick={() => handleLogMeal('breakfast')}
                            className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Log Breakfast
                        </button>
                    </div>

                    {/* Lunch */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            🍔 Lunch
                        </h3>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Food Name</label>
                            <input
                                type="text"
                                value={meals.lunch.name}
                                onChange={(e) => handleMealChange('lunch', 'name', e.target.value)}
                                placeholder="e.g., Grilled chicken salad"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Calories</label>
                            <input
                                type="number"
                                value={meals.lunch.calories}
                                onChange={(e) => handleMealChange('lunch', 'calories', e.target.value)}
                                placeholder="500"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button
                            onClick={() => handleLogMeal('lunch')}
                            className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Log Lunch
                        </button>
                    </div>

                    {/* Dinner */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            🍝 Dinner
                        </h3>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Food Name</label>
                            <input
                                type="text"
                                value={meals.dinner.name}
                                onChange={(e) => handleMealChange('dinner', 'name', e.target.value)}
                                placeholder="e.g., Pasta with vegetables"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-dark-text-secondary text-sm mb-2">Calories</label>
                            <input
                                type="number"
                                value={meals.dinner.calories}
                                onChange={(e) => handleMealChange('dinner', 'calories', e.target.value)}
                                placeholder="600"
                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button
                            onClick={() => handleLogMeal('dinner')}
                            className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Log Dinner
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Snacks Section */}
            <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-6">Log Snacks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {snacks.map((snack, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                🍿 Snack {index + 1}
                            </h3>
                            <div>
                                <label className="block text-dark-text-secondary text-sm mb-2">Food Name</label>
                                <input
                                    type="text"
                                    value={snack.name}
                                    onChange={(e) => handleSnackChange(index, 'name', e.target.value)}
                                    placeholder="e.g., Apple"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-dark-text-secondary text-sm mb-2">Calories</label>
                                <input
                                    type="number"
                                    value={snack.calories}
                                    onChange={(e) => handleSnackChange(index, 'calories', e.target.value)}
                                    placeholder="100"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button
                                onClick={() => handleLogSnack(index)}
                                className="w-full bg-primary hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Log Snack {index + 1}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Logged Meals */}
            <div className="mt-8 bg-dark-card rounded-2xl p-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-6">Today's Logged Meals</h2>

                {loadingMeals ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : loggedMeals.length === 0 ? (
                    <div className="text-center py-8 text-dark-text-secondary">
                        <p>No meals logged today. Start logging your meals above!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {loggedMeals.map((meal) => (
                            <div
                                key={meal.id}
                                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg hover:bg-dark-border transition-all"
                            >
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{meal.food_name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-dark-text-secondary">
                                        <span>{meal.calories} cal</span>
                                        {meal.quantity && <span>• {meal.quantity}</span>}
                                        <span>• {new Date(meal.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteMeal(meal.id)}
                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete meal"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        {/* Total calories */}
                        <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
                            <span className="text-white font-semibold">Total Calories Today</span>
                            <span className="text-2xl font-bold text-primary">
                                {loggedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} kcal
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default FoodPage;
