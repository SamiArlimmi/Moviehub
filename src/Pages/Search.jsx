import React, { useState, useEffect, useCallback } from 'react'
import MovieDetail from "../Components/MovieDetail"
import MovieModal from "../Components/MediaModal"
import '../css/Search.css'
import { searchMovies, getPopularMovies } from "../services/api"
import { debounce } from 'lodash'

// Simpel cache til nylige søgninger (max 10 entries)
const searchCache = new Map()
const MAX_CACHE_SIZE = 10

function Search() {
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasSearched, setHasSearched] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    // Debounced search funktion med caching
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setMovies([])
                setHasSearched(false)
                setLoading(false)
                return
            }

            const cacheKey = query.toLowerCase().trim()

            // Tjek cache først
            if (searchCache.has(cacheKey)) {
                const cachedResults = searchCache.get(cacheKey)
                setMovies(cachedResults)
                setHasSearched(true)
                setLoading(false)
                return
            }

            try {
                setError(null)
                const results = await searchMovies(query)
                setMovies(results)
                setHasSearched(true)

                // Cache resultaterne
                if (searchCache.size >= MAX_CACHE_SIZE) {
                    const firstKey = searchCache.keys().next().value
                    searchCache.delete(firstKey)
                }
                searchCache.set(cacheKey, results)

            } catch (err) {
                setError('Failed to search movies. Please try again.')
                console.error('Search error:', err)
            } finally {
                setLoading(false)
            }
        }, 500),
        []
    )

    // Indlæs populære film som forslag ved mount
    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const popular = await getPopularMovies()
                setSuggestions(popular.slice(0, 8))
            } catch (err) {
                console.error('Error loading suggestions:', err)
            }
        }
        loadSuggestions()
    }, [])

    // Håndter input ændringer med øjeblikkelig loading feedback
    const handleInputChange = (e) => {
        const value = e.target.value
        setSearchQuery(value)

        // Øjeblikkelig feedback: vis loading med det samme hvis der er en query
        if (value.trim()) {
            setLoading(true)
        }
    }

    // Udløs søgning når query ændres
    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => debouncedSearch.cancel()
    }, [searchQuery, debouncedSearch])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setLoading(true)
            debouncedSearch(searchQuery)
        }
    }

    const clearSearch = () => {
        setSearchQuery("")
        setMovies([])
        setHasSearched(false)
        setError(null)
        setLoading(false)
    }

    // Håndter film klik for at åbne modal
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie)
    }

    // Luk modal
    const closeModal = () => {
        setSelectedMovie(null)
    }

    return (
        <>
            <div className="search-page">
                {/* Søge Header */}
                <div className="search-header">
                    <h1>Search Movies</h1>
                    <p>Find movies by title, genre, or keyword from our vast collection</p>
                </div>

                {/* Forbedret Søge Form */}
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search for movies, actors, directors..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleInputChange}
                            autoFocus
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

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Searching our movie database...</p>
                    </div>
                )}

                {/* Fejl State */}
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}

                {/* Søge Resultater */}
                {hasSearched && !loading && (
                    <div className="search-results">
                        <h2>
                            {movies.length > 0
                                ? `Found ${movies.length} movie${movies.length !== 1 ? 's' : ''} for "${searchQuery}"`
                                : `No movies found for "${searchQuery}"`
                            }
                        </h2>

                        {movies.length > 0 && (
                            <div className="movies-grid">
                                {movies.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        style={{ '--delay': `${index * 0.05}s` }}
                                    >
                                        <MovieDetail
                                            movie={movie}
                                            onMovieClick={handleMovieClick}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {movies.length === 0 && (
                            <div className="no-results">
                                <p>
                                    Try searching with different keywords, check your spelling,
                                    or browse our popular movies below.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Forslag når ingen søgning */}
                {!hasSearched && !loading && suggestions.length > 0 && (
                    <div className="suggestions">
                        <h2>Popular Movies</h2>
                        <p>Discover trending and popular movies</p>
                        <div className="movies-grid">
                            {suggestions.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    style={{ '--delay': `${index * 0.1}s` }}
                                >
                                    <MovieDetail
                                        movie={movie}
                                        onMovieClick={handleMovieClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Film Modal */}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={closeModal} />
            )}
        </>
    )
}

export default Search