import MovieDetail from "../Components/MovieDetail";
import React from 'react';
import { useState } from 'react';
import '../css/Home.css'; // Hvis du er i src/
import { SearchMovies } from "../services/api";
import { getPopularMovies } from "../services/api";
import { useEffect } from 'react';


function Home() {
    const [serachQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        }
        loadPopularMovies();
    }, []);


    const handleSearch = () => {
        alert(`Searching for: ${serachQuery}`)
    };
    // Implement search functionality here

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    className="search-input"
                    value={serachQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="movie-grid">
                {movies.map((movie) => (
                    movie.title.toLowerCase().startsWith(serachQuery) && (< MovieDetail movie={movie} key={movie.id} />)))}
            </div>
        </div>

    );
}

export default Home;