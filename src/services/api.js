const API_KEY = "294893ac57e719030f84e82bdc7d692b"
const BASE_URL = "https://api.themoviedb.org/3"

// MOVIE FUNCTIONS
export const getPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies')
        }
        const data = await response.json()
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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
        return data.results
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

// ADDITIONAL MOVIE FUNCTIONS (optional)
export const getTopRatedMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
        if (!response.ok) {
            throw new Error('Failed to fetch top rated movies')
        }
        const data = await response.json()
        return data.results
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
        return data.results
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
        return data.results
    } catch (error) {
        console.error('Error fetching now playing movies:', error)
        throw error
    }
}

