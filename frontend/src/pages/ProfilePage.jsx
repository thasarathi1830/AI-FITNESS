/**
 * Profile Page
 * User profile management and goal settings
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        fitness_goal: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                age: user.age || '',
                height: user.height || '',
                weight: user.weight || '',
                fitness_goal: user.fitness_goal || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Convert numeric fields
        const profileData = {
            ...formData,
            age: formData.age ? parseInt(formData.age) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
        };

        const result = await updateUser(profileData);

        if (result.success) {
            setSuccess('Profile updated successfully! 🎉');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const calculateBMI = () => {
        if (formData.height && formData.weight) {
            const heightInMeters = parseFloat(formData.height) / 100;
            const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };

    const getBMICategory = (bmi) => {
        if (!bmi) return '';
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    };

    const bmi = calculateBMI();

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold text-gradient mb-2">Your Profile</h1>
            <p className="text-gray-600 mb-8">Manage your personal information and fitness goals</p>

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="25"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="170"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="70"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fitness Goal
                                </label>
                                <select
                                    name="fitness_goal"
                                    value={formData.fitness_goal}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Select a goal</option>
                                    <option value="weight_loss">Weight Loss</option>
                                    <option value="muscle_gain">Muscle Gain</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="endurance">Endurance</option>
                                    <option value="flexibility">Flexibility</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? <LoadingSpinner size="sm" text="" /> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="space-y-6">
                    {/* Account Info */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Account</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Email:</span>
                            </p>
                            <p className="text-sm text-gray-800">{user?.email}</p>
                        </div>
                    </div>

                    {/* BMI Card */}
                    {bmi && (
                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">BMI Calculator</h3>
                            <div className="text-center">
                                <p className="text-5xl font-bold text-gradient mb-2">{bmi}</p>
                                <p className="text-sm text-gray-600 mb-4">{getBMICategory(parseFloat(bmi))}</p>
                                <div className="text-xs text-gray-500 text-left space-y-1">
                                    <p>• Underweight: &lt; 18.5</p>
                                    <p>• Normal: 18.5 - 24.9</p>
                                    <p>• Overweight: 25 - 29.9</p>
                                    <p>• Obese: ≥ 30</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fitness Goal Card */}
                    {formData.fitness_goal && (
                        <div className="card bg-gradient-to-br from-primary-50 to-accent-50">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Current Goal</h3>
                            <p className="text-2xl font-bold text-gradient capitalize">
                                {formData.fitness_goal.replace('_', ' ')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
