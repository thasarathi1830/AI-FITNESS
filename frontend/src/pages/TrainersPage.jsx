import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

const TrainersPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchTrainers();
    }, [filter]);

    const fetchTrainers = async () => {
        try {
            const params = filter ? { specialization: filter } : {};
            const response = await api.get('/api/trainers', { params });
            setTrainers(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        } finally {
            setLoading(false);
        }
    };

    const specializations = [
        'All',
        'Weight Loss',
        'Muscle Gain',
        'Yoga',
        'Cardio & Endurance',
        'HIIT & Functional Training'
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Personal Trainers</h1>
                <p className="text-dark-text-secondary">Find and hire certified fitness professionals</p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {specializations.map((spec) => (
                    <button
                        key={spec}
                        onClick={() => setFilter(spec === 'All' ? '' : spec)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${(spec === 'All' && !filter) || filter === spec
                            ? 'bg-primary text-white'
                            : 'bg-dark-card text-dark-text-secondary hover:bg-dark-border'
                            }`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* Trainers Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer) => (
                        <Link
                            key={trainer.id}
                            to={`/trainers/${trainer.id}`}
                            className="bg-dark-card rounded-xl p-6 hover:bg-dark-border transition-all border border-dark-border group"
                        >
                            {/* Trainer Avatar */}
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                {trainer.name.charAt(0)}
                            </div>

                            {/* Trainer Info */}
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                {trainer.name}
                            </h3>
                            <p className="text-primary text-sm font-medium mb-3">{trainer.specialization}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                    <StarIcon className="w-5 h-5 text-yellow-400" />
                                    <span className="text-white font-semibold">{trainer.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-dark-text-secondary text-sm">
                                    ({trainer.total_reviews} reviews)
                                </span>
                            </div>

                            {/* Experience */}
                            <div className="flex items-center gap-2 text-dark-text-secondary text-sm mb-3">
                                <ClockIcon className="w-4 h-4" />
                                <span>{trainer.experience_years} years experience</span>
                            </div>

                            {/* Certifications */}
                            <div className="flex items-center gap-2 text-dark-text-secondary text-sm mb-4">
                                <AcademicCapIcon className="w-4 h-4" />
                                <span>{trainer.certifications.length} certifications</span>
                            </div>

                            {/* Price */}
                            <div className="pt-4 border-t border-dark-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-dark-text-secondary text-sm">Hourly Rate</span>
                                    <span className="text-2xl font-bold text-white">₹{trainer.hourly_rate}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && trainers.length === 0 && (
                <div className="text-center py-20 bg-dark-card rounded-xl border border-dark-border">
                    <p className="text-dark-text-secondary text-lg mb-2">No trainers found</p>
                    <p className="text-dark-text-secondary text-sm">Try a different filter</p>
                </div>
            )}
        </div>
    );
};

export default TrainersPage;
