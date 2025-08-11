import React, { useState, useEffect, useCallback } from 'react';
import '../css/Movies.css';
import {
    getPopularMovies,
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    searchMovies
} from "../services/api";
import CarouselRow from "../Components/CarouselRow";
import MediaModal from "../Components/Modals/MediaModal";
import FeaturedMovieSection from "../Components/FeaturedMovieSection";
import heroImage from '../assets/images/hero.jpg';
import { debounce } from 'lodash';

function Movies() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searching, setSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Filter function to ensure only movies are included
    const filterMoviesOnly = (items) => items.filter(item => !item.first_air_date && item.title);

    // Debounced search for movies only
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            try {
                setSearching(true);
                const results = await searchMovies(query);
                setSearchResults(filterMoviesOnly(results));
            } catch (err) {
                console.error('Search error:', err);
                setError('Search failed. Please try again.');
            } finally {
                setSearching(false);
            }
        }, 500),
        []
    );

    // Trigger search when query changes
    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);
                setError(null);
                const [popular, trending, topRated, upcoming, nowPlaying] = await Promise.all([
                    getPopularMovies(),
                    getTrendingMovies(),
                    getTopRatedMovies(),
                    getUpcomingMovies(),
                    getNowPlayingMovies()
                ]);

                const filteredPopular = filterMoviesOnly(popular);
                const filteredTrending = filterMoviesOnly(trending);
                const filteredTopRated = filterMoviesOnly(topRated);
                const filteredUpcoming = filterMoviesOnly(upcoming);
                const filteredNowPlaying = filterMoviesOnly(nowPlaying);

                setPopularMovies(filteredPopular);
                setTrendingMovies(filteredTrending);
                setTopRatedMovies(filteredTopRated);
                setUpcomingMovies(filteredUpcoming);
                setNowPlayingMovies(filteredNowPlaying);

                // Set featured movie as the first popular or trending movie
                setFeaturedMovie(filteredPopular?.[0] || filteredTrending?.[0] || null);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    const handleMovieClick = (movie) => setSelectedMovie(movie);
    const closeModal = () => setSelectedMovie(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setError(null);
    };

    if (loading) {
        return (
            <div className="movies-loading">
                <div className="loading-spinner"></div>
                <p>Loading amazing movies...</p>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section with Featured Movie */}
            <section className="movies-hero" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="movies-hero__overlay" />
                <div className="movies-hero__content">
                    <div className="hero-badge">
                        <span className="badge-icon">🎬</span>
                        Movies Collection
                    </div>
                    <h1 className="movies-hero__title">Discover Great Movies</h1>
                    <p className="movies-hero__subtitle">
                        From blockbusters to indie gems, find your next favorite film
                    </p>

                    {/* Enhanced Search */}
                    <form className="movies-search" onSubmit={handleSubmit}>
                        <div className="search-wrapper">
                            <input
                                type="text"
                                className="movies-search__input"
                                placeholder="Search movies, genres, actors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="clear-search-btn"
                                    onClick={clearSearch}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                            <button
                                type="submit"
                                className="movies-search__button"
                                disabled={!searchQuery.trim()}
                            >
                                <span className="search-icon">🔍</span>
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Featured Movie Section - Only show if no search */}
            {!searchQuery.trim() && featuredMovie && (
                <section className="featured-section">
                    <FeaturedMovieSection
                        movie={featuredMovie}
                        onPlayClick={() => setSelectedMovie(featuredMovie)}
                        onInfoClick={() => setSelectedMovie(featuredMovie)}
                    />
                </section>
            )}

            {/* Main Content */}
            <main className="movies-main">
                <div className="movies-content">
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Search Results */}
                    {searchQuery.trim() ? (
                        <div className="search-results-section">
                            {searching ? (
                                <div className="search-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Searching movies...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="search-header">
                                        <h2>
                                            {searchResults.length > 0
                                                ? `Found ${searchResults.length} movie${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
                                                : `No movies found for "${searchQuery}"`
                                            }
                                        </h2>
                                    </div>
                                    {searchResults.length > 0 && (
                                        <CarouselRow
                                            title=""
                                            movies={searchResults}
                                            onMovieClick={handleMovieClick}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        /* Movie Sections */
                        <div className="movies-sections">
                            <section className="movies-section">
                                <CarouselRow title="🔥 Trending Movies" movies={trendingMovies} onMovieClick={handleMovieClick} />
                            </section>
                            <section className="movies-section">
                                <CarouselRow title="⭐ Popular Movies" movies={popularMovies} onMovieClick={handleMovieClick} />
                            </section>
                            <section className="movies-section">
                                <CarouselRow title="🏆 Top Rated Movies" movies={topRatedMovies} onMovieClick={handleMovieClick} />
                            </section>
                            <section className="movies-section">
                                <CarouselRow title="📅 Upcoming Movies" movies={upcomingMovies} onMovieClick={handleMovieClick} />
                            </section>
                            <section className="movies-section">
                                <CarouselRow title="🎬 Now Playing" movies={nowPlayingMovies} onMovieClick={handleMovieClick} />
                            </section>
                        </div>
                    )}
                </div>
            </main>

            {/* Movie Modal */}
            {selectedMovie && (
                <MediaModal item={selectedMovie} mediaType="movie" onClose={closeModal} />
            )}
        </>
    );
}

export default Movies;