import React, { useState, useEffect, useCallback } from 'react'
import MovieDetail from "../Components/MovieDetail"
import MovieModal from "../Components/MediaModal"
import '../css/Search.css'
import { searchMovies, getPopularMovies } from "../services/api"
import { debounce } from 'lodash'

function Search() {
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasSearched, setHasSearched] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setMovies([])
                setHasSearched(false)
                return
            }

            try {
                setLoading(true)
                setError(null)
                const results = await searchMovies(query)
                setMovies(results)
                setHasSearched(true)
            } catch (err) {
                setError('Failed to search movies. Please try again.')
                console.error('Search error:', err)
            } finally {
                setLoading(false)
            }
        }, 500),
        []
    )

    // Load popular movies as suggestions on mount
    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const popular = await getPopularMovies()
                setSuggestions(popular.slice(0, 8)) // Show more suggestions for better grid
            } catch (err) {
                console.error('Error loading suggestions:', err)
            }
        }
        loadSuggestions()
    }, [])

    // Trigger search when query changes
    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => debouncedSearch.cancel()
    }, [searchQuery, debouncedSearch])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery)
        }
    }

    const clearSearch = () => {
        setSearchQuery("")
        setMovies([])
        setHasSearched(false)
        setError(null)
    }

    // Handle movie click to open modal
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie)
    }

    // Close modal
    const closeModal = () => {
        setSelectedMovie(null)
    }

    return (
        <>
            <div className="search-page">
                {/* Search Header */}
                <div className="search-header">
                    <h1>Search Movies</h1>
                    <p>Find movies by title, genre, or keyword from our vast collection</p>
                </div>

                {/* Enhanced Search Form */}
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search for movies, actors, directors..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                {/* Error State */}
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}

                {/* Search Results */}
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

                {/* Suggestions when no search */}
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

            {/* Movie Modal */}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={closeModal} />
            )}
        </>
    )
}

export default Search