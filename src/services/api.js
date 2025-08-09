const API_KEY = "294893ac57e719030f84e82bdc7d692b";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    const reponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await reponse.json();
    return data.results;
}

export const SearchMovies = async () => {
    const reponse = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent}(query)`);
    const data = await reponse.json();
    return data.results;
}