const API_KEY = "294893ac57e719030f84e82bdc7d692b"
const BASE_URL = "https://api.themoviedb.org/3"

// GENRE MAPPING - No separate file needed
const MOVIE_GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

const TV_GENRES = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37: "Western"
};

// Helper function to add genre names to items
const enhanceWithGenres = (items, mediaType = 'movie') => {
    if (!Array.isArray(items)) return items;

    return items.map(item => {
        if (!item.genre_ids || !Array.isArray(item.genre_ids)) {
            return { ...item, genre_names: [] };
        }

        const genreMap = mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES;
        const genre_names = item.genre_ids
            .map(id => genreMap[id])
            .filter(Boolean) // Remove any undefined genres
            .slice(0, 1); // Show only first genre

        return { ...item, genre_names };
    });
};

// MOVIE FUNCTIONS
export const getPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching popular movies:', error)
        throw error
    }
}

export const searchMovies = async (query) => {
    if (!query.trim()) return []

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        )
        if (!response.ok) {
            throw new Error('Failed to search movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error searching movies:', error)
        throw error
    }
}

export const getTrendingMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch trending movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching trending movies:', error)
        throw error
    }
}

export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

export const getMovieCredits = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        return { cast: [], crew: [] };
    }
};

export const getMovieTrailers = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter for YouTube trailers and teasers
        const trailers = data.results.filter(video =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
        );

        return trailers;
    } catch (error) {
        console.error('Error fetching movie trailers:', error);
        return [];
    }
};

// SERIES/TV FUNCTIONS
export const getPopularSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch popular series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error fetching popular series:', error)
        throw error
    }
}

export const getTrendingSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch trending series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error fetching trending series:', error)
        throw error
    }
}

export const searchSeries = async (query) => {
    if (!query.trim()) return []

    try {
        const response = await fetch(
            `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        )
        if (!response.ok) {
            throw new Error('Failed to search series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error searching series:', error)
        throw error
    }
}

export const getTopRatedSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch top rated series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error fetching top rated series:', error)
        throw error
    }
}

export const getAiringTodaySeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch airing today series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error fetching airing today series:', error)
        throw error
    }
}

export const getOnTheAirSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch on the air series')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'tv')
    } catch (error) {
        console.error('Error fetching on the air series:', error)
        throw error
    }
}

export const getSeriesDetails = async (seriesId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching series details:', error);
        return null;
    }
};

export const getSeriesCredits = async (seriesId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching series credits:', error);
        return { cast: [], crew: [] };
    }
};

export const getSeriesTrailers = async (seriesId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter for YouTube trailers and teasers
        const trailers = data.results.filter(video =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
        );

        return trailers;
    } catch (error) {
        console.error('Error fetching series trailers:', error);
        return [];
    }
};

// ADDITIONAL MOVIE FUNCTIONS
export const getTopRatedMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch top rated movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching top rated movies:', error)
        throw error
    }
}

export const getUpcomingMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch upcoming movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching upcoming movies:', error)
        throw error
    }
}

export const getNowPlayingMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch now playing movies')
        }
        const data = await response.json()
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching now playing movies:', error)
        throw error
    }
}