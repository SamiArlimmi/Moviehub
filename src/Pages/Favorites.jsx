import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Favorites.css';


function favorite() {
    return (
        <div className="favorites-empty">
            <h1>Favorites Page</h1>
            <p>This is where your favorite movies will be displayed.</p>
        </div>
    );
}

export default favorite;