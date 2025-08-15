import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../css/NavBar.css';

function NavBar() {
    // Hent bruger autentificering data fra context
    const { user, logout, isAuthenticated } = useAuth();

    // State til at kontrollere bruger dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);

    // Hent nuværende side placering for at fremhæve aktiv nav knap
    const location = useLocation();

    // Funktion til at åbne bruger dropdown menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Funktion til at lukke bruger dropdown menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Funktion til at håndtere bruger logout
    const handleLogout = () => {
        logout(); // Kald logout funktion fra auth context
        handleMenuClose(); // Luk dropdown menuen
    };

    // Funktion til at få det første bogstav til bruger avatar
    const getAvatarText = (user) => {
        if (!user) return 'U'; // Standard hvis ingen bruger
        if (user.name) return user.name.charAt(0).toUpperCase(); // Brug første bogstav af navn
        if (user.email) return user.email.charAt(0).toUpperCase(); // Brug første bogstav af email
        return 'U'; // Fallback til 'U'
    };

    // Funktion til at tjekke om nuværende side matcher navigations knap sti
    const isActivePath = (path) => {
        return location.pathname === path;
    };

    // Array af navigations links for nem administration
    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/movies', label: 'Movies' },
        { path: '/series', label: 'Series' },
        { path: '/search', label: 'Search' },
        { path: '/favorites', label: 'Favorites' }
    ];

    return (
        <AppBar position="static" className="navbar">
            <Toolbar className="navbar-toolbar">
                {/* Website Logo/Brand */}
                <Typography
                    variant="h6"
                    className="navbar-title"
                    component={Link}
                    to="/"
                >
                    MovieHub
                </Typography>

                {/* Hoved Navigations Knapper */}
                <div className="nav-buttons-container">
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

                {/* Bruger Sektion - Viser forskelligt indhold baseret på login status */}
                {isAuthenticated ? (
                    // Logget ind bruger sektion
                    <div className="user-section">
                        {/* Vis brugernavn */}
                        <Typography variant="body2" className="user-name">
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </Typography>

                        {/* Bruger avatar knap der åbner dropdown menu */}
                        <div className="avatar-wrapper">
                            <IconButton
                                onClick={handleMenuOpen}
                                className="avatar-button"
                                size="small"
                            >
                                <Avatar className="user-avatar">
                                    {getAvatarText(user)}
                                </Avatar>
                            </IconButton>
                        </div>

                        {/* Dropdown menu for bruger muligheder */}
                        <Menu
                            className="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            slotProps={{
                                paper: {
                                    className: 'user-menu-paper'
                                }
                            }}
                        >
                            {/* Profil menu punkt */}
                            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                                👤 Profile
                            </MenuItem>

                            {/* Indstillinger menu punkt */}
                            <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
                                ⚙️ Settings
                            </MenuItem>

                            {/* Logout menu punkt */}
                            <MenuItem onClick={handleLogout} className="logout-menu-item">
                                🚪 Logout
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    // Ikke logget ind - vis sign in knap
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