import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { StarIcon, ClockIcon, AcademicCapIcon, CalendarIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';

const TrainerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        session_date: '',
        duration_hours: 1,
        notes: ''
    });
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchTrainer();
        loadRazorpayScript();
    }, [id]);

    const fetchTrainer = async () => {
        try {
            const response = await api.get(`/api/trainers/${id}`);
            setTrainer(response.data);
        } catch (error) {
            console.error('Error fetching trainer:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBooking = async () => {
        try {
            setBooking(true);

            // Debug logging
            console.log('Booking data:', bookingData);
            console.log('Session date value:', bookingData.session_date);

            // Format the date properly for backend (use current date if not set)
            const sessionDate = bookingData.session_date
                ? new Date(bookingData.session_date).toISOString()
                : new Date().toISOString();

            console.log('Formatted session date:', sessionDate);

            // Create booking
            const bookingResponse = await api.post(`/api/trainers/${id}/book`, {
                trainer_id: id,
                session_date: sessionDate,
                duration_hours: bookingData.duration_hours,
                notes: bookingData.notes || ''
            });

            const bookingId = bookingResponse.data.id;
            const totalAmount = bookingResponse.data.total_amount;

            // Create Razorpay order
            const orderResponse = await api.post('/api/payments/create-order', {
                booking_id: bookingId,
                amount: totalAmount
            });

            // Initialize Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: 'FitTrack',
                description: `Session with ${trainer.name}`,
                order_id: orderResponse.data.order_id,
                handler: async function (response) {
                    // Verify payment
                    try {
                        await api.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            booking_id: bookingId
                        });

                        alert('Booking confirmed! Check your bookings page.');
                        navigate('/trainers');
                    } catch (error) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#10B981'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error booking trainer:', error);
            console.error('Error response:', error.response?.data);

            if (error.response?.status === 401) {
                alert('Please login to book a trainer session');
            } else if (error.response?.data?.detail) {
                alert(`Booking failed: ${error.response.data.detail}`);
            } else {
                alert('Failed to create booking. Please try again.');
            }
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!trainer) {
        return <div className="text-center text-white">Trainer not found</div>;
    }

    const totalCost = trainer.hourly_rate * bookingData.duration_hours;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Trainer Header */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                        {trainer.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">{trainer.name}</h1>
                        <p className="text-primary text-lg font-medium mb-4">{trainer.specialization}</p>

                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                                <StarIcon className="w-6 h-6 text-yellow-400" />
                                <span className="text-white font-semibold text-lg">{trainer.rating.toFixed(1)}</span>
                                <span className="text-dark-text-secondary">({trainer.total_reviews} reviews)</span>
                            </div>

                            <div className="flex items-center gap-2 text-dark-text-secondary">
                                <ClockIcon className="w-5 h-5" />
                                <span>{trainer.experience_years} years experience</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-white">
                            ₹{trainer.hourly_rate} <span className="text-lg text-dark-text-secondary font-normal">/hour</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-dark-text-secondary leading-relaxed">{trainer.bio}</p>
            </div>

            {/* Certifications */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-primary" />
                    Certifications
                </h2>
                <div className="flex flex-wrap gap-3">
                    {trainer.certifications.map((cert, index) => (
                        <span key={index} className="bg-dark-bg px-4 py-2 rounded-lg text-dark-text border border-dark-border">
                            {cert}
                        </span>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="bg-dark-card rounded-2xl p-8 mb-8 border border-dark-border">
                <h2 className="text-xl font-bold text-white mb-4">Available Days</h2>
                <div className="flex flex-wrap gap-3">
                    {trainer.availability.map((day, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                            {day}
                        </span>
                    ))}
                </div>
            </div>

            {/* Booking Form */}
            <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
                <h2 className="text-2xl font-bold text-white mb-6">Book a Session</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-dark-text mb-2">Session Date & Time</label>
                        <input
                            type="datetime-local"
                            value={bookingData.session_date}
                            onChange={(e) => setBookingData({ ...bookingData, session_date: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-dark-text mb-2">Duration (hours)</label>
                        <select
                            value={bookingData.duration_hours}
                            onChange={(e) => setBookingData({ ...bookingData, duration_hours: parseFloat(e.target.value) })}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        >
                            <option value={0.5}>30 minutes</option>
                            <option value={1}>1 hour</option>
                            <option value={1.5}>1.5 hours</option>
                            <option value={2}>2 hours</option>
                            <option value={3}>3 hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-dark-text mb-2">Notes (Optional)</label>
                        <textarea
                            value={bookingData.notes}
                            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                            rows={3}
                            placeholder="Any specific requirements or goals..."
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="bg-dark-bg rounded-lg p-6 border border-dark-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-dark-text-secondary">Hourly Rate</span>
                            <span className="text-white">₹{trainer.hourly_rate}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-dark-text-secondary">Duration</span>
                            <span className="text-white">{bookingData.duration_hours} hours</span>
                        </div>
                        <div className="border-t border-dark-border my-4"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-white">Total</span>
                            <span className="text-3xl font-bold text-primary">₹{totalCost}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={booking}
                        className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {booking ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CurrencyRupeeIcon className="w-5 h-5" />
                                Book & Pay ₹{totalCost}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainerDetailPage;
