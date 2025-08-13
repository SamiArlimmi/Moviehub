import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/LoginForm.css';

export default function LoginForm() {
    // State til at gemme form data (email og password)
    const [formData, setFormData] = useState({ email: '', password: '' });

    // State til at vise beskeder til brugeren
    const [message, setMessage] = useState('');

    // Hent login funktion og loading state fra auth context
    const { login, isLoading } = useAuth();

    // Navigation hook til at viderestille bruger efter login
    const navigate = useNavigate();

    // Håndter ændringer i input felterne
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Opdater form data med den nye værdi
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Håndter form submission
    const handleSubmit = async () => {
        // Tjek om alle felter er udfyldt
        if (!formData.email || !formData.password) {
            setMessage('Please fill in all fields.');
            return;
        }

        // Nulstil tidligere beskeder
        setMessage('');

        try {
            // Forsøg at logge brugeren ind
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Vis success besked
                setMessage(result.message);

                // Viderestil til forsiden efter kort delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                // Vis fejl besked
                setMessage(result.message);
            }
        } catch (error) {
            // Håndter uventede fejl
            setMessage('An error occurred. Please try again.');
        }
    };

    // Håndter Enter tast tryk for hurtig submission
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="login-form">
            {/* Overskrift og undertekst */}
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>

            {/* Email input felt */}
            <label>Email Address</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                disabled={isLoading}
            />

            {/* Password input felt */}
            <label>Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                disabled={isLoading}
            />

            {/* Login muligheder (husk mig og glemt password) */}
            <div className="login-options">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
            </div>

            {/* Vis beskeder til brugeren */}
            {message && (
                <div className={`login-message ${message.includes('successful') || message.includes('Redirecting')
                    ? 'success'
                    : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Login knap */}
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Footer med link til at oprette konto */}
            <p className="login-footer">
                Don't have an account? <a href="#">Sign up here</a>
            </p>

            {/* Demo login oplysninger */}
            <div className="login-demo">
                <strong>Demo credentials:</strong><br />
                Email: demo@example.com<br />
                Password: password
            </div>
        </div>
    );
}