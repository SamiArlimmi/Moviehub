// services/api.js
// Dette fil håndterer alle API kald til The Movie Database (TMDB)
// Indeholder funktioner til at hente film og TV serie data

// TMDB API konfiguration
const API_KEY = "294893ac57e719030f84e82bdc7d692b"
const BASE_URL = "https://api.themoviedb.org/3"

// GENRE MAPPING - Konverter genre ID'er til navne
// Film genrer fra TMDB API
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

// TV serie genrer fra TMDB API
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

// Hjælpe funktion til at tilføje genre navne til film/serier
const enhanceWithGenres = (items, mediaType = 'movie') => {
    // Tjek om items er et array
    if (!Array.isArray(items)) return items;

    // Map over hvert item og tilføj genre navne
    return items.map(item => {
        // Tjek om item har genre_ids
        if (!item.genre_ids || !Array.isArray(item.genre_ids)) {
            return { ...item, genre_names: [] };
        }

        // Vælg det rigtige genre map baseret på media type
        const genreMap = mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES;

        // Konverter genre IDs til navne
        const genre_names = item.genre_ids
            .map(id => genreMap[id])
            .filter(Boolean) // Fjern undefined genrer
            .slice(0, 1); // Vis kun første genre

        // Return item med tilføjede genre navne
        return { ...item, genre_names };
    });
};

// ============ FILM FUNKTIONER ============

// Hent populære film
export const getPopularMovies = async () => {
    try {
        // Lav API kald til TMDB
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)

        // Tjek om response er ok
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies')
        }

        // Konverter response til JSON
        const data = await response.json()

        // Return data med tilføjede genre navne
        return enhanceWithGenres(data.results, 'movie')
    } catch (error) {
        console.error('Error fetching popular movies:', error)
        throw error
    }
}

// Søg efter film
export const searchMovies = async (query) => {
    // Return tom array hvis ingen søgning
    if (!query.trim()) return []

    try {
        // Lav API kald med søge query
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

// Hent trending film (denne uge)
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

// Hent detaljerede informationer om en specifik film
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

// Hent cast og crew for en film
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
        // Return tom objekt hvis fejl
        return { cast: [], crew: [] };
    }
};

// Hent trailere for en film
export const getMovieTrailers = async (movieId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filtrer kun YouTube trailere og teasers
        const trailers = data.results.filter(video =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
        );

        return trailers;
    } catch (error) {
        console.error('Error fetching movie trailers:', error);
        return []; // Return tom array hvis fejl
    }
};

// Hent top-ratede film
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

// Hent kommende film
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

// Hent film der vises i biograferne nu
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

// ============ TV SERIE FUNKTIONER ============

// Hent populære TV serier
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

// Hent trending TV serier (denne uge)
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

// Søg efter TV serier
export const searchSeries = async (query) => {
    // Return tom array hvis ingen søgning
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

// Hent top-ratede TV serier
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

// Hent serier der sendes i dag
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

// Hent serier der sendes på luften nu
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

// Hent detaljerede informationer om en specifik TV serie
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

// Hent cast og crew for en TV serie
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
        // Return tom objekt hvis fejl
        return { cast: [], crew: [] };
    }
};

// Hent trailere for en TV serie
export const getSeriesTrailers = async (seriesId) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filtrer kun YouTube trailere og teasers
        const trailers = data.results.filter(video =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
        );

        return trailers;
    } catch (error) {
        console.error('Error fetching series trailers:', error);
        return []; // Return tom array hvis fejl
    }
};