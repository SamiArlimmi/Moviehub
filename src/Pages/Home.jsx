import React, { useState, useEffect, useCallback } from 'react';
import '../css/Home.css';
import { getPopularMovies, getTrendingMovies, searchMovies } from "../services/api";
import CarouselRow from "../Components/CarouselRow";
import MediaModal from "../Components/MediaModal";
import FeaturedMovieSection from "../Components/FeaturedMovieSection";
import heroImage from '../assets/images/hero.jpg';
import { debounce } from 'lodash';

// Simple cache for recent searches (max 10 entries)
const searchCache = new Map()
const MAX_CACHE_SIZE = 10

function Home() {
    // State til at gemme forskellige film lister
    const [popularMovies, setPopularMovies] = useState([]); // Array af populære film
    const [trendingMovies, setTrendingMovies] = useState([]); // Array af trending film
    const [featuredMovie, setFeaturedMovie] = useState(null); // Enkelt fremhævet film

    // State til søgefunktionalitet
    const [searchQuery, setSearchQuery] = useState(""); // Brugerens søge input
    const [searchResults, setSearchResults] = useState([]); // Resultater fra søgning
    const [searching, setSearching] = useState(false); // Loading state for søgning

    // State til loading, fejl og modal
    const [loading, setLoading] = useState(true); // Loading state for initial data
    const [error, setError] = useState(null); // Fejl beskeder
    const [selectedMovie, setSelectedMovie] = useState(null); // Film valgt til modal

    // Debounced search - forsinker søgning til bruger stopper med at skrive
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            // Return tidligt hvis tom søgning
            if (!query.trim()) {
                setSearchResults([]);
                setSearching(false);
                return;
            }

            const cacheKey = query.toLowerCase().trim()

            // Check cache first
            if (searchCache.has(cacheKey)) {
                const cachedResults = searchCache.get(cacheKey)
                setSearchResults(cachedResults)
                setSearching(false)
                return
            }

            try {
                // Kald API for at søge efter film
                const results = await searchMovies(query);
                setSearchResults(results);

                // Cache the results
                if (searchCache.size >= MAX_CACHE_SIZE) {
                    const firstKey = searchCache.keys().next().value
                    searchCache.delete(firstKey)
                }
                searchCache.set(cacheKey, results)

            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setSearching(false);
            }
        }, 500), // 500ms delay
        []
    );

    // Hent film data når komponenten loader
    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                console.log("Fetching movies...");

                // Hent både populære og trending film samtidigt
                const [popular, trending] = await Promise.all([
                    getPopularMovies(),
                    getTrendingMovies()
                ]);

                console.log("Popular Movies:", popular);
                console.log("Trending Movies:", trending);

                // Sæt film data i state
                setPopularMovies(popular);
                setTrendingMovies(trending);

                // Sæt den første trending film som fremhævet film
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
    }, []); // Tom dependency array - kør kun én gang

    // Handle input changes with instant loading feedback
    const handleInputChange = (e) => {
        const value = e.target.value
        setSearchQuery(value)

        // Instant feedback: show loading immediately if there's a query
        if (value.trim()) {
            setSearching(true)
        }

        debouncedSearch(value)
    }

    // Start søgning når søge query ændres
    useEffect(() => {
        debouncedSearch(searchQuery);

        // Cleanup function til at cancel debounced search
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    // Håndter søge form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearching(true);
            debouncedSearch(searchQuery);
        }
    };

    // Håndter klik på film kort - åbn modal
    const handleMovieClick = (movie) => {
        console.log("Selected Movie:", movie);
        setSelectedMovie(movie);
    };

    // Håndter "play" knap klik på fremhævet film
    const handlePlayClick = (movie) => {
        console.log("Play clicked for:", movie.title);
        setSelectedMovie(movie);
    };

    // Håndter "info" knap klik på fremhævet film
    const handleInfoClick = (movie) => {
        setSelectedMovie(movie);
    };

    // Luk modal funktion
    const closeModal = () => {
        setSelectedMovie(null);
    };

    // Vis loading state
    if (loading) {
        return (
            <div className="home-loading">
                <p>Loading amazing movies...</p>
            </div>
        );
    }

    // Vis fejl state
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
            {/* Hero sektion med baggrundsbillede og søgefelt */}
            <section className="hero-banner" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-banner__overlay" />
                <div className="hero-banner__content">
                    <h1 className="hero-banner__title">Discover Amazing Movies</h1>
                    <p className="hero-banner__subtitle">
                        Find your next favorite film from thousands of titles
                    </p>

                    {/* Søge form */}
                    <form className="hero-search" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="hero-search__input"
                            placeholder="Search movies, genres, people…"
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="hero-search__button">Search</button>
                    </form>
                </div>
            </section>

            {/* Hovedindhold sektion */}
            <div className="home">
                {/* Conditional rendering - vis enten søgeresultater eller standard indhold */}
                {searchQuery.trim() ? (
                    // Vis søgeresultater eller loading
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
                    // Vis standard indhold når der ikke søges
                    <>
                        {/* Trending film sektion */}
                        <CarouselRow
                            title="Trending This Week"
                            movies={trendingMovies}
                            onMovieClick={handleMovieClick}
                        />

                        {/* Fremhævet film sektion - RETTET: fjernet duplikeret onPlay prop */}
                        {featuredMovie && (
                            <FeaturedMovieSection
                                movie={featuredMovie}
                                onPlayClick={handlePlayClick}
                                onInfoClick={handleInfoClick}
                            />
                        )}

                        {/* Populære film sektion */}
                        <CarouselRow
                            title="Popular Movies"
                            movies={popularMovies}
                            onMovieClick={handleMovieClick}
                        />
                    </>
                )}
            </div>

            {/* Vis modal når en film er valgt */}
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