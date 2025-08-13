import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../css/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
    // Hent authentication status og loading state fra auth context
    const { isAuthenticated, isLoading } = useAuth();

    // Hvis der stadig loades authentication status, vis loading besked
    if (isLoading) {
        return (
            <div className="loading-container">
                Loading...
            </div>
        );
    }

    // Hvis brugeren er authenticated, vis det beskyttede indhold (children)
    // Hvis ikke, omdirigér til login siden
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;