/**
 * Authentication Context
 * Manages global authentication state and provides auth functions
 */
import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { access_token, user: userData } = response.data;

            // Store in state and localStorage
            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed',
            };
        }
    };

    // Signup function
    const signup = async (email, password, name) => {
        try {
            const response = await authAPI.signup({ email, password, name });
            const { access_token, user: userData } = response.data;

            // Store in state and localStorage
            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Signup failed',
            };
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Update user profile
    const updateUser = async (profileData) => {
        try {
            const response = await userAPI.updateProfile(profileData);
            const updatedUser = response.data;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Update failed',
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
