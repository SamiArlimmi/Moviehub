// Components/Profile.jsx
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Box,
    Divider,
    IconButton
} from '@mui/material';
import { Settings, Edit } from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Generer avatar tekst fra email eller navn
    const getAvatarText = (user) => {
        if (!user) return 'U';
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        return 'U';
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <Card className="profile-card">
                    <CardContent>
                        {/* Header Sektion */}
                        <Box className="profile-header">
                            <Avatar
                                className="profile-avatar"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '3rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
                                    marginBottom: 2
                                }}
                            >
                                {getAvatarText(user)}
                            </Avatar>

                            <Box className="profile-actions">
                                <IconButton
                                    onClick={() => navigate('/settings')}
                                    color="primary"
                                    title="Edit Profile"
                                >
                                    <Settings />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Profil Information */}
                        <Box className="profile-info">
                            <Typography variant="h4" className="profile-name">
                                {user?.name || 'Anonymous User'}
                            </Typography>
                            <Typography variant="body1" className="profile-email">
                                {user?.email}
                            </Typography>
                            <Typography variant="body2" className="profile-bio">
                                {user?.bio || 'Movie enthusiast exploring the world of cinema.'}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Statistik Sektion */}
                        <Box className="profile-stats">
                            <Typography variant="h6" className="stats-title">
                                Your MovieHub Stats
                            </Typography>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <Typography variant="h3" className="stat-number">
                                        {user?.favoriteMovies?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Favorite Movies
                                    </Typography>
                                </div>
                                <div className="stat-item">
                                    <Typography variant="h3" className="stat-number">
                                        {user?.watchedMovies?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Movies Watched
                                    </Typography>
                                </div>
                                <div className="stat-item">
                                    <Typography variant="h3" className="stat-number">
                                        {user?.reviews?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Reviews Written
                                    </Typography>
                                </div>
                            </div>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Seneste Aktivitet */}
                        <Box className="recent-activity">
                            <Typography variant="h6" className="activity-title">
                                Recent Activity
                            </Typography>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-icon">⭐</span>
                                    <span className="activity-text">Joined MovieHub</span>
                                    <span className="activity-date">Recently</span>
                                </div>
                                {user?.favoriteMovies?.length > 0 && (
                                    <div className="activity-item">
                                        <span className="activity-icon">❤️</span>
                                        <span className="activity-text">
                                            Added {user.favoriteMovies.length} movie{user.favoriteMovies.length !== 1 ? 's' : ''} to favorites
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Handlings Knapper */}
                        <Box className="profile-buttons">
                            <Button
                                variant="contained"
                                onClick={() => navigate('/favorites')}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '25px',
                                    padding: '0.8rem 2rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                                    }
                                }}
                            >
                                💖 View Favorites
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/settings')}
                                sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    borderRadius: '25px',
                                    padding: '0.8rem 2rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)'
                                    }
                                }}
                            >
                                ⚙️ Settings
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleLogout}
                                sx={{
                                    borderColor: '#ff6b6b',
                                    color: '#ff6b6b',
                                    borderRadius: '25px',
                                    padding: '0.8rem 2rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#ff4757',
                                        color: '#ff4757',
                                        backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                    }
                                }}
                            >
                                🚪 Logout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Profile;