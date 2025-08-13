// CarouselRow.jsx
// This component creates a horizontal scrolling row of movies with navigation buttons
import React, { useEffect, useMemo, useRef } from "react";
import MovieDetail from "./MovieDetail";
import "../css/CarouselRow.css";

export default function CarouselRow({ title, movies, onMovieClick }) {
    // Reference to the scrolling container element
    const containerRef = useRef(null);

    // Flag to prevent scroll adjustments during programmatic scrolling
    const isAdjustingRef = useRef(false);

    // Create triple copy of movies for seamless infinite scrolling effect
    // This allows the carousel to loop smoothly without jumping back to start
    const tripled = useMemo(() => {
        return movies ? [...movies, ...movies, ...movies] : [];
    }, [movies]);

    // Function to center the scroll position on the middle copy of movies
    const centerScroll = () => {
        const element = containerRef.current;
        if (!element) return;

        // Calculate one-third of total scroll width (middle section)
        const oneThird = element.scrollWidth / 3;

        // Temporarily disable smooth scrolling for instant positioning
        const previousScrollBehavior = element.style.scrollBehavior;
        element.style.scrollBehavior = "auto";

        // Set scroll position to middle copy
        element.scrollLeft = oneThird;

        // Restore previous scroll behavior
        element.style.scrollBehavior = previousScrollBehavior || "";
    };

    // Center the scroll when movies change
    useEffect(() => {
        const animationId = requestAnimationFrame(centerScroll);
        return () => cancelAnimationFrame(animationId);
    }, [movies]);

    // Handle scroll events to create infinite loop effect
    const handleScroll = () => {
        const element = containerRef.current;
        if (!element || isAdjustingRef.current) return;

        const oneThird = element.scrollWidth / 3;
        const currentScrollLeft = element.scrollLeft;

        // Check if we've scrolled too far left or right (20% threshold)
        if (currentScrollLeft < oneThird * 0.2 || currentScrollLeft > oneThird * 1.8) {
            // Save current scroll behavior and disable smooth scrolling
            const previousScrollBehavior = element.style.scrollBehavior;
            element.style.scrollBehavior = "auto";
            isAdjustingRef.current = true;

            // Jump to equivalent position in middle section
            if (currentScrollLeft < oneThird) {
                element.scrollLeft = currentScrollLeft + oneThird;
            } else {
                element.scrollLeft = currentScrollLeft - oneThird;
            }

            // Restore scroll behavior after adjustment
            requestAnimationFrame(() => {
                element.style.scrollBehavior = previousScrollBehavior || "";
                isAdjustingRef.current = false;
            });
        }
    };

    // Function to scroll by a specific number of movie cards
    const scrollByCards = (numberOfCards) => {
        const element = containerRef.current;
        if (!element) return;

        // Find a movie card to calculate its width
        const movieCard = element.querySelector(".movie-detail");
        const cardWidth = movieCard ? movieCard.getBoundingClientRect().width : 200;

        // Get gap between cards from CSS variable
        const gap = parseFloat(getComputedStyle(element).getPropertyValue("--gap") || "16");

        // Scroll smoothly by card width + gap
        element.scrollBy({
            left: (cardWidth + gap) * numberOfCards,
            behavior: "smooth"
        });
    };

    // Helper function to get movie/TV show title
    // Movies use 'title' property, TV shows use 'name' property
    const getTitle = (item) => item.title || item.name || 'No Title';

    // Helper function to get release year
    // Movies use 'release_date', TV shows use 'first_air_date'
    const getReleaseYear = (item) => {
        const date = item.release_date || item.first_air_date;
        return date ? new Date(date).getFullYear() : '';
    };

    // Create enhanced movie objects with consistent title and year properties
    const enhancedMovies = useMemo(() => {
        return movies?.map(item => ({
            ...item,
            displayTitle: getTitle(item),
            displayYear: getReleaseYear(item)
        })) || [];
    }, [movies]);

    // Create triple copy of enhanced movies for infinite scrolling
    const tripledEnhanced = useMemo(() => {
        return enhancedMovies ? [...enhancedMovies, ...enhancedMovies, ...enhancedMovies] : [];
    }, [enhancedMovies]);

    // Don't render anything if no movies provided
    if (!movies || movies.length === 0) return null;

    return (
        <section className="movies-section">
            {/* Section header with title */}
            <div className="row-header">
                <h2 className="section-title">{title}</h2>
            </div>

            {/* Main carousel container with navigation buttons */}
            <div className="loop-wrapper">
                {/* Left navigation button */}
                <button
                    className="side-btn side-left"
                    aria-label="Previous movies"
                    onClick={() => scrollByCards(-1)}
                >
                    ‹
                </button>

                {/* Scrolling container with movie cards */}
                <div
                    className="loop-row no-manual-scroll"
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {/* Render each movie card */}
                    {tripledEnhanced.map((movie, index) => (
                        <MovieDetail
                            movie={movie}
                            key={`${movie.id}-${index}`}
                            onMovieClick={onMovieClick}
                        />
                    ))}
                </div>

                {/* Right navigation button */}
                <button
                    className="side-btn side-right"
                    aria-label="Next movies"
                    onClick={() => scrollByCards(1)}
                >
                    ›
                </button>
            </div>
        </section>
    );
}