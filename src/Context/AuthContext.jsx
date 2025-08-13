import React, { createContext, useContext, useState, useEffect } from 'react';

// Opret authentication context
const AuthContext = createContext();

// Custom hook til at bruge auth context i andre komponenter
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Tjek om hook bruges inden for AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

// AuthProvider komponent der wrapper hele app'en og giver adgang til auth state
export const AuthProvider = ({ children }) => {
    // State til at gemme bruger information
    const [user, setUser] = useState(null);

    // State til at tracke om authentication data loader
    const [isLoading, setIsLoading] = useState(true);

    // Tjek for gemt bruger session når app'en starter
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                // Parse JSON data fra localStorage
                setUser(JSON.parse(storedUser));
            } catch (error) {
                // Hvis parsing fejler, fjern korrupt data
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }

        // Authentication check er færdig
        setIsLoading(false);
    }, []);

    // Login funktion - simulerer API kald til backend
    const login = async (email, password) => {
        setIsLoading(true);

        // Simuler network delay (som et rigtigt API kald)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo authentication - i et rigtigt system ville dette være et API kald
        if (email === 'demo@example.com' && password === 'password') {
            // Opret bruger data objekt
            const userData = {
                id: 1,
                email: email,
                name: email.split('@')[0], // Brug email prefix som navn
                avatar: null,
                bio: 'Movie enthusiast exploring the world of cinema.',
                favoriteMovies: [],
                watchedMovies: [],
                reviews: []
            };

            // Gem bruger i state og localStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoading(false);

            // Return success resultat
            return { success: true, message: 'Login successful!' };
        } else {
            // Return fejl for forkerte credentials
            setIsLoading(false);
            return { success: false, message: 'Invalid credentials. Try demo@example.com / password' };
        }
    };

    // Funktion til at opdatere bruger profil
    const updateUser = async (userData) => {
        try {
            setIsLoading(true);

            // Simuler API kald delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Valider påkrævede felter
            if (!userData.name?.trim()) {
                throw new Error('Name is required');
            }
            if (!userData.email?.trim()) {
                throw new Error('Email is required');
            }

            // Basis email validering med regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Opdater bruger state med nye data
            const updatedUser = {
                ...user, // Behold eksisterende data
                ...userData, // Overskriv med nye data
                // Sørg for at bevare arrays som ikke blev opdateret
                favoriteMovies: user?.favoriteMovies || [],
                watchedMovies: user?.watchedMovies || [],
                reviews: user?.reviews || []
            };

            // Gem opdateret bruger
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsLoading(false);
            return { success: true, message: 'Profile updated successfully!' };

        } catch (error) {
            setIsLoading(false);
            console.error('Error updating user:', error);

            // Return fejl besked
            return {
                success: false,
                message: error.message || 'Failed to update profile. Please try again.'
            };
        }
    };

    // Logout funktion - ryd bruger data
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Værdi objekt der bliver delt med alle child komponenter
    const value = {
        user, // Aktuel bruger data
        login, // Login funktion
        logout, // Logout funktion
        updateUser, // Profil opdatering funktion
        isLoading, // Loading state
        isAuthenticated: !!user // Boolean om bruger er logget ind
    };

    // Provider komponent der wrapper children og giver adgang til context
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};