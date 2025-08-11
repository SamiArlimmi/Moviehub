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
import MediaModal from "../Components/Modals/MediaModal"; // renamed import for clarity
import FeaturedMovieSection from "../Components/FeaturedMovieSection"; // consider renaming to a generic component later
import heroImage from '../assets/images/hero.jpg';
import { debounce } from 'lodash';
import MovieDetail from '../Components/MovieDetail';

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

    const filterSeriesOnly = (items) => items.filter(item => (item.name || item.first_air_date) && !item.title);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) { setSearchResults([]); return; }
            try {
                setSearching(true);
                const results = await searchSeries(query);
                setSearchResults(filterSeriesOnly(results));
            } catch (err) {
                console.error(err);
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

    return (
        <>
            {/* Hero / Featured */}
            <div className="series-hero" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="overlay">
                    <h1>Trending TV Shows</h1>
                    {featuredSeries && (
                        <FeaturedMovieSection movie={featuredSeries} onPlay={() => setSelectedSeries(featuredSeries)} />
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search series..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        debouncedSearch(e.target.value);
                    }}
                />
            </div>

            <div className="series-content">
                {error ? (
                    <div className="error">{error}</div>
                ) : loading ? (
                    <div className="loading">Loading…</div>
                ) : (
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
            </div>

            {/* Show Modal when series is clicked */}
            {selectedSeries && (
                <MediaModal item={selectedSeries} mediaType="tv" onClose={closeModal} />
            )}
        </>
    );
}

export default Series;