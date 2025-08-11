import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/LoginPromptModal.css'; // Ensure you have this CSS file for styling

function LoginPromptModal({ onClose, movieTitle }) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset'; // Restore scrolling
        };
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="login-prompt-backdrop" onClick={handleBackdropClick}>
            <div className="login-prompt-content">
                {/* Close button */}
                <button className="login-prompt-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                {/* Content */}
                <div className="login-prompt-body">
                    <div className="login-prompt-icon">
                        ❤️
                    </div>

                    <h2 className="login-prompt-title">Sign in to save favorites</h2>

                    <p className="login-prompt-message">
                        {movieTitle
                            ? `Sign in to add "${movieTitle}" to your favorites and build your personal movie collection.`
                            : "Sign in to save movies to your favorites and build your personal movie collection."
                        }
                    </p>

                    <div className="login-prompt-actions">
                        <Link to="/login" className="login-btn primary">
                            Sign In
                        </Link>
                        <button onClick={onClose} className="login-btn secondary">
                            Maybe Later
                        </button>
                    </div>

                    <div className="login-prompt-benefits">
                        <h3>Why create an account?</h3>
                        <ul>
                            <li>💾 Save your favorite movies</li>
                            <li>📱 Sync across all devices</li>
                            <li>🎯 Get personalized recommendations</li>
                            <li>⭐ Rate and review movies</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPromptModal;