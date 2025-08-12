// Context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored user session on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo authentication
        if (email === 'demo@example.com' && password === 'password') {
            const userData = {
                id: 1,
                email: email,
                name: email.split('@')[0],
                avatar: null,
                bio: 'Movie enthusiast exploring the world of cinema.',
                favoriteMovies: [],
                watchedMovies: [],
                reviews: []
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoading(false);
            return { success: true, message: 'Login successful!' };
        } else {
            setIsLoading(false);
            return { success: false, message: 'Invalid credentials. Try demo@example.com / password' };
        }
    };

    const updateUser = async (userData) => {
        try {
            setIsLoading(true);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Validate required fields
            if (!userData.name?.trim()) {
                throw new Error('Name is required');
            }
            if (!userData.email?.trim()) {
                throw new Error('Email is required');
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Update user state
            const updatedUser = {
                ...user,
                ...userData,
                // Ensure we keep existing data that wasn't updated
                favoriteMovies: user?.favoriteMovies || [],
                watchedMovies: user?.watchedMovies || [],
                reviews: user?.reviews || []
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsLoading(false);
            return { success: true, message: 'Profile updated successfully!' };

        } catch (error) {
            setIsLoading(false);
            console.error('Error updating user:', error);
            return {
                success: false,
                message: error.message || 'Failed to update profile. Please try again.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};