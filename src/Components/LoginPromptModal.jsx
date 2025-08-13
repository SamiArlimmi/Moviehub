import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/LoginPromptModal.css';

function LoginPromptModal({ onClose, movieTitle }) {
    // Luk modal når Escape taste trykkes
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Tilføj event listener og forhindre baggrunds scrolling
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Cleanup når komponenten unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset'; // Gendan scrolling
        };
    }, [onClose]);

    // Håndter klik på baggrund (backdrop) for at lukke modal
    const handleBackdropClick = (e) => {
        // Luk kun hvis der klikkes direkte på baggrunden
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="login-prompt-backdrop" onClick={handleBackdropClick}>
            <div className="login-prompt-content">
                {/* Luk knap i øverste højre hjørne */}
                <button className="login-prompt-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                {/* Hovedindhold af modal */}
                <div className="login-prompt-body">
                    {/* Hjerte ikon for favoritter */}
                    <div className="login-prompt-icon">
                        ❤️
                    </div>

                    {/* Hovedtitel */}
                    <h2 className="login-prompt-title">Sign in to save favorites</h2>

                    {/* Besked til brugeren */}
                    <p className="login-prompt-message">
                        {movieTitle
                            ? `Sign in to add "${movieTitle}" to your favorites and build your personal movie collection.`
                            : "Sign in to save movies to your favorites and build your personal movie collection."
                        }
                    </p>

                    {/* Handling knapper */}
                    <div className="login-prompt-actions">
                        {/* Link til login siden */}
                        <Link to="/login" className="login-btn primary">
                            Sign In
                        </Link>

                        {/* Knap til at lukke modal uden at logge ind */}
                        <button onClick={onClose} className="login-btn secondary">
                            Maybe Later
                        </button>
                    </div>

                    {/* Sektion der viser fordele ved at oprette konto */}
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