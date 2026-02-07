/**
 * Utility helper functions
 */

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
    return formatDate(new Date());
};

// Format calories with commas
export const formatCalories = (calories) => {
    return Math.round(calories).toLocaleString();
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.min((value / total) * 100, 100);
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Get greeting based on time of day
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};
