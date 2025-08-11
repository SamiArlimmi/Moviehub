import React, { useState, useEffect } from 'react';
import { usePlaylist } from '../../Context/PlaylistContext';
import '../../css/PlaylistModal.css';

function PlaylistModal({ movie, onClose, isOpen }) {
    const {
        playlists,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        isInPlaylist,
        getPlaylistsWithMovie
    } = usePlaylist();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [moviePlaylists, setMoviePlaylists] = useState([]);

    // Debug logging
    console.log('PlaylistModal rendered with:', {
        movie,
        isOpen,
        playlists: playlists?.length,
        movieTitle: movie?.title || movie?.name
    });

    useEffect(() => {
        if (movie?.id) {
            const playlistsWithMovie = getPlaylistsWithMovie(movie.id);
            console.log('Movie playlists updated:', playlistsWithMovie);
            setMoviePlaylists(playlistsWithMovie);
        }
    }, [movie?.id, playlists, getPlaylistsWithMovie]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    console.log('Escape pressed, closing modal');
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'auto';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen || !movie) {
        console.log('Modal not rendering:', { isOpen, hasMovie: !!movie });
        return null;
    }

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) {
            console.log('No playlist name provided');
            return;
        }

        console.log('Creating playlist:', newPlaylistName);
        setIsCreating(true);

        try {
            const newPlaylist = createPlaylist(newPlaylistName, newPlaylistDescription);
            console.log('Playlist created:', newPlaylist);

            if (newPlaylist?.id) {
                addToPlaylist(newPlaylist.id, movie);
                console.log('Movie added to new playlist');
            }

            setNewPlaylistName('');
            setNewPlaylistDescription('');
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleTogglePlaylist = (playlistId) => {
        console.log('Toggling playlist:', { playlistId, movieId: movie.id, isCurrentlyIn: isInPlaylist(playlistId, movie.id) });

        try {
            if (isInPlaylist(playlistId, movie.id)) {
                removeFromPlaylist(playlistId, movie.id);
                console.log('Movie removed from playlist');
            } else {
                addToPlaylist(playlistId, movie);
                console.log('Movie added to playlist');
            }
        } catch (error) {
            console.error('Error toggling playlist:', error);
        }
    };

    const getMovieTitle = () => {
        return movie.title || movie.name || movie.original_title || movie.original_name || 'Unknown Title';
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            console.log('Backdrop clicked, closing modal');
            onClose();
        }
    };

    const handleCloseClick = () => {
        console.log('Close button clicked');
        onClose();
    };

    return (
        <div className="playlist-modal-backdrop" onClick={handleBackdropClick}>
            <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="playlist-modal-header">
                    <h2>Add to Playlist</h2>
                    <button
                        className="playlist-modal-close"
                        onClick={handleCloseClick}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="playlist-modal-movie">
                    <img
                        src={movie.poster_path
                            ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                            : '/placeholder-poster.jpg'
                        }
                        alt={getMovieTitle()}
                        className="modal-movie-poster"
                    />
                    <div className="modal-movie-info">
                        <h3>{getMovieTitle()}</h3>
                        {(movie.release_date || movie.first_air_date) && (
                            <p className="movie-year">
                                {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="playlist-modal-body">
                    {/* Debug info */}
                    <div style={{
                        background: '#333',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#ccc'
                    }}>
                        <strong>Debug Info:</strong><br />
                        Movie ID: {movie.id}<br />
                        Playlists Count: {playlists?.length || 0}<br />
                        Movie in Playlists: {moviePlaylists?.length || 0}
                    </div>

                    {playlists.length === 0 ? (
                        <div className="no-playlists">
                            <div className="no-playlists-icon">📝</div>
                            <p>You don't have any playlists yet.</p>
                            <p>Create your first playlist to organize your movies!</p>
                        </div>
                    ) : (
                        <div className="playlists-list">
                            <h3>Your Playlists ({playlists.length})</h3>
                            {playlists.map(playlist => {
                                const isMovieInPlaylist = isInPlaylist(playlist.id, movie.id);
                                console.log(`Playlist ${playlist.name}: movie ${isMovieInPlaylist ? 'is' : 'is not'} in playlist`);

                                return (
                                    <div
                                        key={playlist.id}
                                        className={`playlist-item ${isMovieInPlaylist ? 'selected' : ''}`}
                                    >
                                        <div className="playlist-info">
                                            <div className="playlist-name">{playlist.name}</div>
                                            <div className="playlist-meta">
                                                {playlist.movies?.length || 0} movie{(playlist.movies?.length || 0) !== 1 ? 's' : ''}
                                                {playlist.description && (
                                                    <span className="playlist-description">
                                                        • {playlist.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className={`playlist-toggle ${isMovieInPlaylist ? 'added' : 'add'}`}
                                            onClick={() => handleTogglePlaylist(playlist.id)}
                                        >
                                            {isMovieInPlaylist ? (
                                                <>
                                                    <span className="toggle-icon">✓</span>
                                                    Added
                                                </>
                                            ) : (
                                                <>
                                                    <span className="toggle-icon">+</span>
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="create-playlist-section">
                        {!showCreateForm ? (
                            <button
                                className="create-playlist-btn"
                                onClick={() => {
                                    console.log('Show create form clicked');
                                    setShowCreateForm(true);
                                }}
                            >
                                <span className="btn-icon">+</span>
                                Create New Playlist
                            </button>
                        ) : (
                            <form className="create-playlist-form" onSubmit={handleCreatePlaylist}>
                                <h4>Create New Playlist</h4>
                                <div className="form-group">
                                    <label htmlFor="playlist-name">Playlist Name *</label>
                                    <input
                                        id="playlist-name"
                                        type="text"
                                        value={newPlaylistName}
                                        onChange={(e) => setNewPlaylistName(e.target.value)}
                                        placeholder="My Awesome Movies"
                                        maxLength={50}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="playlist-description">Description (Optional)</label>
                                    <textarea
                                        id="playlist-description"
                                        value={newPlaylistDescription}
                                        onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                        placeholder="A collection of my favorite action movies..."
                                        maxLength={200}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => {
                                            console.log('Cancel create form clicked');
                                            setShowCreateForm(false);
                                            setNewPlaylistName('');
                                            setNewPlaylistDescription('');
                                        }}
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={!newPlaylistName.trim() || isCreating}
                                    >
                                        {isCreating ? (
                                            <>
                                                <div className="btn-spinner"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <span className="btn-icon">✓</span>
                                                Create & Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {moviePlaylists.length > 0 && (
                        <div className="current-playlists">
                            <h4>Currently in {moviePlaylists.length} playlist{moviePlaylists.length !== 1 ? 's' : ''}:</h4>
                            <div className="current-playlists-list">
                                {moviePlaylists.map(playlist => (
                                    <span key={playlist.id} className="current-playlist-tag">
                                        {playlist.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlaylistModal;