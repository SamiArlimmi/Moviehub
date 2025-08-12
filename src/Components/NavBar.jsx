// Components/NavBar.jsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../css/NavBar.css';

function NavBar() {
    const { user, logout, isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    // Generate avatar text from email or name
    const getAvatarText = (user) => {
        if (!user) return 'U';
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        return 'U';
    };

    // Check if current path matches button path
    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/movies', label: 'Movies' },
        { path: '/series', label: 'Series' },
        { path: '/search', label: 'Search' },
        { path: '/favorites', label: 'Favorites' }
    ];

    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                {/* Brand Logo */}
                <Typography
                    variant="h6"
                    className="navbar-title"
                    component={Link}
                    to="/"
                    style={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    🎬 MovieHub
                </Typography>

                {/* Navigation Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {navLinks.map((link) => (
                        <Button
                            key={link.path}
                            color="inherit"
                            component={Link}
                            to={link.path}
                            className={`navbar-button ${isActivePath(link.path) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Button>
                    ))}
                </div>

                {/* User Section */}
                {isAuthenticated ? (
                    <div className="user-section">
                        <Typography
                            variant="body2"
                            className="user-name"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </Typography>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar
                                className="user-avatar"
                                sx={{
                                    width: 36,
                                    height: 36,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {getAvatarText(user)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            className="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                sx: {
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                                    marginTop: '0.5rem',
                                    minWidth: '180px'
                                }
                            }}
                        >
                            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                                👤 Profile
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                ⚙️ Settings
                            </MenuItem>
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    color: '#ff6b6b !important',
                                    '&:hover': {
                                        background: 'rgba(220, 53, 69, 0.1) !important',
                                        color: '#ff4757 !important'
                                    }
                                }}
                            >
                                🚪 Logout
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        className="navbar-button login-button"
                        sx={{
                            background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
                            borderRadius: '25px',
                            padding: '0.6rem 1.5rem',
                            fontWeight: 600,
                            marginLeft: '1rem',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #f40612 0%, #e50914 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(229, 9, 20, 0.4)'
                            }
                        }}
                    >
                        🔐 Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;