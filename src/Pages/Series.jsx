import React, { useState, useEffect, useCallback } from 'react';
import '../css/Series.css';
import {
    getTrendingSeries,
    getPopularSeries,
    getTopRatedSeries,
    getAiringTodaySeries,
    getOnTheAirSeries,
    searchSeries
} from "../services/api";
import CarouselRow from "../Components/CarouselRow";
import MediaModal from "../Components/MediaModal";
import FeaturedMovieSection from "../Components/FeaturedMovieSection";
import MovieDetail from '../Components/MovieDetail';
import heroImage from '../assets/images/hero.jpg';
import { debounce } from 'lodash';

function Series() {
    const [popularSeries, setPopularSeries] = useState([]);
    const [trendingSeries, setTrendingSeries] = useState([]);
    const [topRatedSeries, setTopRatedSeries] = useState([]);
    const [airingTodaySeries, setAiringTodaySeries] = useState([]);
    const [onTheAirSeries, setOnTheAirSeries] = useState([]);
    const [featuredSeries, setFeaturedSeries] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searching, setSearching] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const filterSeriesOnly = (items) => items.filter(item => (item.name || item.first_air_date) && !item.title);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setHasSearched(false);
                return;
            }
            try {
                setSearching(true);
                setError(null);
                const results = await searchSeries(query);
                setSearchResults(filterSeriesOnly(results));
                setHasSearched(true);
            } catch (err) {
                setError('Failed to search series. Please try again.');
                console.error('Search error:', err);
            } finally {
                setSearching(false);
            }
        }, 400),
        []
    );

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);
                const [trending, popular, topRated, airingToday, onTheAir] = await Promise.all([
                    getTrendingSeries(),
                    getPopularSeries(),
                    getTopRatedSeries(),
                    getAiringTodaySeries(),
                    getOnTheAirSeries()
                ]);
                setTrendingSeries(filterSeriesOnly(trending));
                setPopularSeries(filterSeriesOnly(popular));
                setTopRatedSeries(filterSeriesOnly(topRated));
                setAiringTodaySeries(filterSeriesOnly(airingToday));
                setOnTheAirSeries(filterSeriesOnly(onTheAir));
                setFeaturedSeries(trending?.[0] || popular?.[0] || null);
            } catch (err) {
                console.error(err);
                setError('Failed to load series.');
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    const handleSeriesClick = (show) => setSelectedSeries(show);
    const closeModal = () => setSelectedSeries(null);

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    };

    return (
        <>
            {/* Hero / Featured - Only show when not searching */}
            {!hasSearched && (
                <div className="series-hero" style={{ backgroundImage: `url(${heroImage})` }}>
                    <div className="overlay">
                        <h1>Trending TV Shows</h1>
                        {featuredSeries && (
                            <FeaturedMovieSection movie={featuredSeries} onPlay={() => setSelectedSeries(featuredSeries)} />
                        )}
                    </div>
                </div>
            )}

            {/* Enhanced Search */}
            <div className="search-section">
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search series, actors, genres..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-button"
                                onClick={clearSearch}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="search-button"
                        disabled={!searchQuery.trim()}
                    >
                        🔍 Search
                    </button>
                </form>
            </div>

            <div className="series-content">
                {/* Loading State */}
                {searching && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Searching series database...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}

                {/* Search Results */}
                {hasSearched && !searching && (
                    <div className="search-results">
                        <h2>
                            {searchResults.length > 0
                                ? `Found ${searchResults.length} series for "${searchQuery}"`
                                : `No series found for "${searchQuery}"`
                            }
                        </h2>

                        {searchResults.length > 0 && (
                            <div className="movies-grid">
                                {searchResults.map((series, index) => (
                                    <div
                                        key={series.id}
                                        style={{ '--delay': `${index * 0.05}s` }}
                                    >
                                        <MovieDetail
                                            movie={series}
                                            onMovieClick={handleSeriesClick}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchResults.length === 0 && (
                            <div className="no-results">
                                <p>
                                    Try searching with different keywords, check your spelling,
                                    or browse our popular series below.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Series Categories - Only show when not searching */}
                {!hasSearched && !loading && (
                    <div className="series-sections">
                        <section className="series-section">
                            <CarouselRow title="🔥 Trending Series" movies={trendingSeries} onMovieClick={handleSeriesClick} />
                        </section>
                        <section className="series-section">
                            <CarouselRow title="⭐ Popular Series" movies={popularSeries} onMovieClick={handleSeriesClick} />
                        </section>
                        <section className="series-section">
                            <CarouselRow title="🏆 Top Rated Series" movies={topRatedSeries} onMovieClick={handleSeriesClick} />
                        </section>
                        <section className="series-section">
                            <CarouselRow title="📺 Airing Today" movies={airingTodaySeries} onMovieClick={handleSeriesClick} />
                        </section>
                        <section className="series-section">
                            <CarouselRow title="📡 On The Air" movies={onTheAirSeries} onMovieClick={handleSeriesClick} />
                        </section>
                    </div>
                )}

                {/* Initial loading state */}
                {loading && !hasSearched && (
                    <div className="loading">Loading series...</div>
                )}
            </div>

            {/* Show Modal when series is clicked */}
            {selectedSeries && (
                <MediaModal item={selectedSeries} mediaType="tv" onClose={closeModal} />
            )}
        </>
    );
}

export default Series;