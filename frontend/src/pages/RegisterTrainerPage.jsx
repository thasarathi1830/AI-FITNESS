import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterTrainerPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: 'Weight Loss',
        bio: '',
        experience_years: 1,
        certifications: '',
        hourly_rate: 1000,
        availability: []
    });

    const specializations = [
        'Weight Loss',
        'Muscle Gain',
        'Yoga',
        'Cardio & Endurance',
        'HIIT & Functional Training',
        'Strength Training',
        'Flexibility & Mobility'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter(d => d !== day)
                : [...prev.availability, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const certArray = formData.certifications.split(',').map(c => c.trim()).filter(c => c);

            await api.post('/trainers/register', {
                ...formData,
                certifications: certArray
            });

            alert('Registration successful! Your profile will be reviewed and activated soon.');
            navigate('/trainers');
        } catch (error) {
            alert(error.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Register as a Trainer</h1>
                <p className="text-dark-text-secondary">Join our platform and start training clients</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-dark-card rounded-2xl p-8 border border-dark-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-dark-text mb-2">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-dark-text mb-2">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-dark-text mb-2">Specialization *</label>
                    <select
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-dark-text mb-2">Bio *</label>
                    <textarea
                        required
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell clients about your experience and approach..."
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-dark-text mb-2">Years of Experience *</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.experience_years}
                            onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-dark-text mb-2">Hourly Rate (₹) *</label>
                        <input
                            type="number"
                            required
                            min="500"
                            step="100"
                            value={formData.hourly_rate}
                            onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-dark-text mb-2">Certifications (comma-separated) *</label>
                    <input
                        type="text"
                        required
                        value={formData.certifications}
                        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        placeholder="e.g., NASM-CPT, ACE, Yoga Alliance RYT-200"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-dark-text mb-3">Availability *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {days.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`px-4 py-2 rounded-lg transition-all ${formData.availability.includes(day)
                                        ? 'bg-primary text-white'
                                        : 'bg-dark-bg text-dark-text-secondary border border-dark-border hover:border-primary'
                                    }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || formData.availability.length === 0}
                    className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : 'Register as Trainer'}
                </button>
            </form>
        </div>
    );
};

export default RegisterTrainerPage;
