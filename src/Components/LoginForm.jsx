// Components/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/LoginForm.css';

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            setMessage('Please fill in all fields.');
            return;
        }

        setMessage('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                setMessage(result.message);
                setTimeout(() => {
                    navigate('/'); // Redirect to home page
                }, 1500);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="login-form">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>

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

            <div className="login-options">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
            </div>

            {message && (
                <div className={`login-message ${message.includes('successful') || message.includes('Redirecting')
                    ? 'success'
                    : 'error'}`}>
                    {message}
                </div>
            )}

            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="login-footer">
                Don't have an account? <a href="#">Sign up here</a>
            </p>

            <div className="login-demo">
                <strong>Demo credentials:</strong><br />
                Email: demo@example.com<br />
                Password: password
            </div>
        </div>
    );
}