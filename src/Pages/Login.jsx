import React from 'react';
import LoginForm from '../Components/LoginForm.jsx';
import '../css/LoginForm.css';

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <LoginForm />
            </div>
        </div>
    );
}
