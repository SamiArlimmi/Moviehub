import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../css/NavBar.css';

function NavBar() {
    // Get user authentication data from context
    const { user, logout, isAuthenticated } = useAuth();

    // State to control the user dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);

    // Get current page location for highlighting active nav button
    const location = useLocation();

    // Function to open the user dropdown menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to close the user dropdown menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Function to handle user logout
    const handleLogout = () => {
        logout(); // Call logout function from auth context
        handleMenuClose(); // Close the dropdown menu
    };

    // Function to get the first letter for user avatar
    const getAvatarText = (user) => {
        if (!user) return 'U'; // Default if no user
        if (user.name) return user.name.charAt(0).toUpperCase(); // Use first letter of name
        if (user.email) return user.email.charAt(0).toUpperCase(); // Use first letter of email
        return 'U'; // Fallback to 'U'
    };

    // Function to check if current page matches navigation button path
    const isActivePath = (path) => {
        return location.pathname === path;
    };

    // Array of navigation links for easy management
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
                {/* Website Logo/Brand */}
                <Typography
                    variant="h6"
                    className="navbar-title"
                    component={Link}
                    to="/"
                >
                    🎬 MovieHub
                </Typography>

                {/* Main Navigation Buttons */}
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

                {/* User Section - Shows different content based on login status */}
                {isAuthenticated ? (
                    // Logged in user section
                    <div className="user-section">
                        {/* Display user name */}
                        <Typography variant="body2" className="user-name">
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </Typography>

                        {/* User avatar button that opens dropdown menu */}
                        <IconButton onClick={handleMenuOpen} className="avatar-button">
                            <Avatar className="user-avatar">
                                {getAvatarText(user)}
                            </Avatar>
                        </IconButton>

                        {/* Dropdown menu for user options */}
                        <Menu
                            className="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* Profile menu item */}
                            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                                👤 Profile
                            </MenuItem>

                            {/* Settings menu item */}
                            <MenuItem onClick={handleMenuClose}>
                                ⚙️ Settings
                            </MenuItem>

                            {/* Logout menu item */}
                            <MenuItem onClick={handleLogout} className="logout-menu-item">
                                🚪 Logout
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    // Not logged in - show sign in button
                    <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        className="navbar-button login-button"
                    >
                        🔐 Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;