import React, { useState, useEffect } from 'react';
import { usePlaylist } from '../Context/PlaylistContext';
import '../css/MovieRating.css';

function MovieRating({ movie, size = 'medium', showLabel = true, onRatingChange }) {
    const { getUserRating, rateMovie, removeRating } = usePlaylist();
    const [userRating, setUserRating] = useState(null);
    const [hoveredRating, setHoveredRating] = useState(null);
    const [isRating, setIsRating] = useState(false);

    useEffect(() => {
        if (movie?.id) {
            const rating = getUserRating(movie.id);
            setUserRating(rating);
        }
    }, [movie?.id, getUserRating]);

    // Convert 1-10 rating to percentage
    const ratingToPercentage = (rating) => {
        if (!rating) return 0;
        return rating * 10; // 1-10 becomes 10%-100%
    };

    // Convert percentage back to 1-10 rating
    const percentageToRating = (percentage) => {
        return Math.round(percentage / 10);
    };

    // Get rating quality class based on percentage
    const getRatingQuality = (percentage) => {
        if (percentage >= 90) return 'rating-excellent';
        if (percentage >= 80) return 'rating-very-good';
        if (percentage >= 70) return 'rating-good';
        if (percentage >= 60) return 'rating-average';
        if (percentage >= 50) return 'rating-below-average';
        return 'rating-poor';
    };

    const handleStarClick = async (rating) => {
        if (!movie?.id) return;

        setIsRating(true);
        try {
            if (userRating === rating) {
                // Remove rating if clicking the same star
                await removeRating(movie.id);
                setUserRating(null);
                onRatingChange?.(null);
            } else {
                await rateMovie(movie.id, rating);
                setUserRating(rating);
                onRatingChange?.(rating);
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        } finally {
            setIsRating(false);
        }
    };

    const handleStarHover = (rating) => {
        if (!isRating) {
            setHoveredRating(rating);
        }
    };

    const handleMouseLeave = () => {
        if (!isRating) {
            setHoveredRating(null);
        }
    };

    const getStarClass = (starNumber) => {
        const displayRating = hoveredRating || userRating;
        const isFilled = displayRating && starNumber <= displayRating;
        const isHovered = hoveredRating && starNumber <= hoveredRating;

        let className = 'rating-star';
        if (isFilled) className += ' filled';
        if (isHovered && !userRating) className += ' hovered';
        if (isHovered && userRating && hoveredRating !== userRating) className += ' preview';

        return className;
    };

    const sizeClass = `rating-${size}`;
    const userPercentage = ratingToPercentage(userRating);
    const hoveredPercentage = ratingToPercentage(hoveredRating);
    const displayPercentage = hoveredPercentage || userPercentage;

    return (
        <div className={`movie-rating-component ${sizeClass}`}>
            {showLabel && (
                <span className="rating-label">Your Rating:</span>
            )}

            <div
                className="stars-container"
                onMouseLeave={handleMouseLeave}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                    <button
                        key={star}
                        className={getStarClass(star)}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        disabled={isRating}
                        title={`Rate ${ratingToPercentage(star)}%`}
                        aria-label={`Rate ${ratingToPercentage(star)} percent`}
                    >
                        ★
                    </button>
                ))}

                {isRating && (
                    <div className="rating-spinner">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            {userRating && (
                <div className={`rating-display ${getRatingQuality(userPercentage)}`}>
                    {/* Circular percentage indicator */}
                    <div
                        className="percentage-circle"
                        style={{
                            '--percentage': `${(userPercentage / 100) * 360}deg`
                        }}
                    >
                        <span className="percentage-value">{userPercentage}%</span>
                    </div>

                    <div className="rating-score">
                        <span>{userPercentage}</span>
                        <span className="percentage-symbol">%</span>
                    </div>

                    {showLabel && (
                        <button
                            className="clear-rating"
                            onClick={() => handleStarClick(userRating)}
                            title="Clear rating"
                            aria-label="Clear your rating"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {hoveredRating && !userRating && (
                <div className="rating-preview">
                    <span className="preview-score">
                        <span>{hoveredPercentage}</span>
                        <span className="percentage-symbol">%</span>
                    </span>
                </div>
            )}

            {/* Enhanced percentage badge for compact display */}
            {userRating && size === 'small' && (
                <div className={`rating-percentage-badge ${getRatingQuality(userPercentage)}`}>
                    <div
                        className="percentage-circle"
                        style={{
                            '--percentage': `${(userPercentage / 100) * 360}deg`
                        }}
                    >
                        <span className="percentage-value">{userPercentage}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieRating;