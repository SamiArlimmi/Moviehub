import React, { useState, useEffect, useCallback } from 'react';
import '../css/Home.css';
import { getPopularMovies, getTrendingMovies, searchMovies } from "../services/api";
import CarouselRow from "../Components/CarouselRow";
import MediaModal from "../Components/Modals/MediaModal";
import FeaturedMovieSection from "../Components/FeaturedMovieSection";
import heroImage from '../assets/images/hero.jpg';
import { debounce } from 'lodash';

function Home() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searching, setSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            try {
                setSearching(true);
                const results = await searchMovies(query);
                setSearchResults(results);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setSearching(false);
            }
        }, 500),
        []
    );

    // Fetch movies (popular and trending)
    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                console.log("Fetching movies...");
                const [popular, trending] = await Promise.all([
                    getPopularMovies(),
                    getTrendingMovies()
                ]);
                console.log("Popular Movies:", popular);
                console.log("Trending Movies:", trending);
                setPopularMovies(popular);
                setTrendingMovies(trending);

                // Set featured movie as the first trending movie
                if (trending && trending.length > 0) {
                    setFeaturedMovie(trending[0]);
                }
            } catch (err) {
                setError('Failed to load movies. Please try again later.');
                console.error('Error loading movies:', err);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    // Trigger search when query changes
    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    };

    // Handle movie click (set selected movie)
    const handleMovieClick = (movie) => {
        console.log("Selected Movie:", movie);
        setSelectedMovie(movie);
    };

    // Handle featured movie actions
    const handlePlayClick = (movie) => {
        console.log("Play clicked for:", movie.title);
        setSelectedMovie(movie);
    };

    const handleInfoClick = (movie) => {
        setSelectedMovie(movie);
    };

    // Close modal
    const closeModal = () => {
        setSelectedMovie(null);
    };

    if (loading) {
        return (
            <div className="home-loading">
                <p>Loading amazing movies...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            {/* Full-width Hero Banner */}
            <section className="hero-banner" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-banner__overlay" />
                <div className="hero-banner__content">
                    <h1 className="hero-banner__title">Discover Amazing Movies</h1>
                    <p className="hero-banner__subtitle">
                        Find your next favorite film from thousands of titles
                    </p>
                    <form className="hero-search" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="hero-search__input"
                            placeholder="Search movies, genres, people…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="hero-search__button">Search</button>
                    </form>
                </div>
            </section>

            {/* Padded content area */}
            <div className="home">
                {searchQuery.trim() ? (
                    searching ? (
                        <div className="search-loading">
                            <div className="search-loading-spinner" />
                            <p className="search-loading-text">Searching...</p>
                        </div>
                    ) : (
                        <CarouselRow
                            title={`Results for "${searchQuery}"`}
                            movies={searchResults}
                            onMovieClick={handleMovieClick}
                        />
                    )
                ) : (
                    <>
                        <CarouselRow
                            title="Trending This Week"
                            movies={trendingMovies}
                            onMovieClick={handleMovieClick}
                        />

                        {/* Featured Movie Section - appears after Trending */}
                        {featuredMovie && (
                            <FeaturedMovieSection
                                movie={featuredMovie}
                                onPlay={() => setSelectedMovie(featuredMovie)}
                                onPlayClick={handlePlayClick}
                                onInfoClick={handleInfoClick}
                            />
                        )}

                        <CarouselRow
                            title="Popular Movies"
                            movies={popularMovies}
                            onMovieClick={handleMovieClick}
                        />
                    </>
                )}
            </div>

            {/* Show Modal when movie is clicked */}
            {selectedMovie && (
                <MediaModal
                    item={selectedMovie}
                    mediaType="movie"
                    onClose={closeModal}
                />
            )}
        </>
    );
}

export default Home;