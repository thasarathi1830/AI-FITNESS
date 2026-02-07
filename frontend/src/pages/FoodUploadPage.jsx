/**
 * Food Upload Page
 * AI-powered food image upload and manual food entry
 */
import { useState } from 'react';
import { foodAPI, activityAPI } from '../services/api';
import { getTodayDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const FoodUploadPage = () => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manual', 'activity'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Manual food form
    const [manualFood, setManualFood] = useState({
        food_name: '',
        quantity: '',
        calories: '',
        date: getTodayDate(),
    });

    // Activity form
    const [activity, setActivity] = useState({
        activity_type: 'walking',
        duration_minutes: '',
        date: getTodayDate(),
    });

    const [mealType, setMealType] = useState('Breakfast'); // Default

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setAiResult(null);
            setError('');
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('date', getTodayDate());
        formData.append('meal_type', mealType);

        try {
            const response = await foodAPI.uploadImage(formData);
            setAiResult(response.data);
            setSuccess('Food detected and logged successfully! 🎉');
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to analyze image');
        }

        setLoading(false);
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await foodAPI.addManual(manualFood);
            setSuccess('Food logged successfully! 🎉');
            setManualFood({
                food_name: '',
                quantity: '',
                calories: '',
                date: getTodayDate(),
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to log food');
        }

        setLoading(false);
    };

    const handleActivitySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await activityAPI.add(activity);
            setSuccess('Activity logged successfully! 🎉');
            setActivity({
                activity_type: 'walking',
                duration_minutes: '',
                date: getTodayDate(),
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to log activity');
        }

        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
            <h1 className="text-4xl font-bold text-gradient mb-2">Track Your Progress</h1>
            <p className="text-gray-600 mb-8">Log your food and activities</p>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'upload'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                >
                    📸 AI Food Upload
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'manual'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                >
                    ✏️ Manual Entry
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'activity'
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                >
                    🏃 Add Activity
                </button>
            </div>

            {/* Feedback Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* AI Upload Tab */}
            {activeTab === 'upload' && (
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Food Image</h2>

                    {/* Meal Type Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meal Type
                        </label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="input-field"
                        >
                            <option value="Breakfast">🍳 Breakfast</option>
                            <option value="Lunch">🥗 Lunch</option>
                            <option value="Dinner">🍽️ Dinner</option>
                            <option value="Snack">🍎 Snack</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-64 mx-auto rounded-lg mb-4"
                                    />
                                ) : (
                                    <div className="py-12">
                                        <span className="text-6xl mb-4 block">📷</span>
                                        <p className="text-gray-600 font-medium">Click to upload food image</p>
                                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {imageFile && (
                            <button
                                onClick={handleImageUpload}
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? <LoadingSpinner size="sm" text="" /> : '🤖 Analyze with AI'}
                            </button>
                        )}

                        {aiResult && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-purple-900 mb-4">AI Detection Result</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Food:</span> {aiResult.food_name}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Calories:</span> {Math.round(aiResult.calories)} cal
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Manual Entry Tab */}
            {activeTab === 'manual' && (
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Manual Food Entry</h2>

                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Name
                            </label>
                            <input
                                type="text"
                                value={manualFood.food_name}
                                onChange={(e) => setManualFood({ ...manualFood, food_name: e.target.value })}
                                className="input-field"
                                placeholder="e.g., Grilled Chicken Salad"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity (optional)
                            </label>
                            <input
                                type="text"
                                value={manualFood.quantity}
                                onChange={(e) => setManualFood({ ...manualFood, quantity: e.target.value })}
                                className="input-field"
                                placeholder="e.g., 1 plate, 200g"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Calories
                            </label>
                            <input
                                type="number"
                                value={manualFood.calories}
                                onChange={(e) => setManualFood({ ...manualFood, calories: e.target.value })}
                                className="input-field"
                                placeholder="e.g., 350"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={manualFood.date}
                                onChange={(e) => setManualFood({ ...manualFood, date: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? <LoadingSpinner size="sm" text="" /> : 'Log Food'}
                        </button>
                    </form>
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Activity</h2>

                    <form onSubmit={handleActivitySubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Activity Type
                            </label>
                            <select
                                value={activity.activity_type}
                                onChange={(e) => setActivity({ ...activity, activity_type: e.target.value })}
                                className="input-field"
                                required
                            >
                                <option value="walking">🚶 Walking</option>
                                <option value="running">🏃 Running</option>
                                <option value="cycling">🚴 Cycling</option>
                                <option value="gym">💪 Gym</option>
                                <option value="yoga">🧘 Yoga</option>
                                <option value="swimming">🏊 Swimming</option>
                                <option value="dancing">💃 Dancing</option>
                                <option value="hiking">🥾 Hiking</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={activity.duration_minutes}
                                onChange={(e) => setActivity({ ...activity, duration_minutes: e.target.value })}
                                className="input-field"
                                placeholder="e.g., 30"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={activity.date}
                                onChange={(e) => setActivity({ ...activity, date: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? <LoadingSpinner size="sm" text="" /> : 'Log Activity'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FoodUploadPage;
