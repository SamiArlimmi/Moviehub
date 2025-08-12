// Components/Settings.jsx
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Divider,
    IconButton,
    Avatar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel
} from '@mui/material';
import { ArrowBack, PhotoCamera, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Settings.css';

function Settings() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        password: '',
        confirmPassword: ''
    });

    // UI state
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
    const [errors, setErrors] = useState({});

    // Preferences state
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        darkMode: false,
        autoplay: true
    });

    // Initialize form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    // Generate avatar text
    const getAvatarText = (user) => {
        if (!user) return 'U';
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        return 'U';
    };

    // Handle input changes
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle preference changes
    const handlePreferenceChange = (field) => (event) => {
        setPreferences(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) {
            showAlert('error', 'Please fix the errors below');
            return;
        }

        try {
            // Prepare update data (exclude password fields if empty)
            const updateData = {
                name: formData.name,
                email: formData.email,
                bio: formData.bio,
                preferences: preferences
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            // Call updateUser function from AuthContext
            await updateUser(updateData);

            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            showAlert('success', 'Profile updated successfully!');
        } catch (error) {
            showAlert('error', error.message || 'Failed to update profile');
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
        setErrors({});
    };

    // Show alert
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    };

    // Handle password change
    const handleChangePassword = () => {
        setShowPasswordDialog(true);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    };

    return (
        <div className="settings-container">
            <div className="settings-wrapper">
                {/* Alert */}
                {alert.show && (
                    <Alert
                        severity={alert.type}
                        onClose={() => setAlert({ show: false, type: '', message: '' })}
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>
                )}

                <Card className="settings-card">
                    <CardContent>
                        {/* Header */}
                        <Box className="settings-header">
                            <IconButton
                                onClick={() => navigate('/profile')}
                                sx={{ mr: 2 }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h4" className="settings-title">
                                Account Settings
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Profile Picture Section */}
                        <Box className="profile-picture-section">
                            <Typography variant="h6" className="section-title">
                                Profile Picture
                            </Typography>
                            <Box className="avatar-section">
                                <Avatar
                                    className="settings-avatar"
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        fontSize: '2.5rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
                                        mr: 2
                                    }}
                                >
                                    {getAvatarText(user)}
                                </Avatar>
                                <Button
                                    variant="outlined"
                                    startIcon={<PhotoCamera />}
                                    onClick={() => showAlert('info', 'Profile picture upload coming soon!')}
                                    sx={{ ml: 2 }}
                                >
                                    Change Picture
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Personal Information */}
                        <Box className="personal-info-section">
                            <Box className="section-header">
                                <Typography variant="h6" className="section-title">
                                    Personal Information
                                </Typography>
                                {!isEditing && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(true)}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                )}
                            </Box>

                            <Box className="form-grid">
                                <TextField
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    disabled={!isEditing}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    disabled={!isEditing}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Bio"
                                    value={formData.bio}
                                    onChange={handleInputChange('bio')}
                                    disabled={!isEditing}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Tell us about yourself..."
                                    sx={{ mb: 2 }}
                                />
                            </Box>

                            {isEditing && (
                                <Box className="form-actions">
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleSave}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            mr: 2
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={handleCancel}
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Security Section */}
                        <Box className="security-section">
                            <Typography variant="h6" className="section-title">
                                Security
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleChangePassword}
                                color="primary"
                            >
                                Change Password
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Preferences Section */}
                        <Box className="preferences-section">
                            <Typography variant="h6" className="section-title">
                                Preferences
                            </Typography>
                            <Box className="preferences-list">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.emailNotifications}
                                            onChange={handlePreferenceChange('emailNotifications')}
                                            color="primary"
                                        />
                                    }
                                    label="Email Notifications"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.darkMode}
                                            onChange={handlePreferenceChange('darkMode')}
                                            color="primary"
                                        />
                                    }
                                    label="Dark Mode"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.autoplay}
                                            onChange={handlePreferenceChange('autoplay')}
                                            color="primary"
                                        />
                                    }
                                    label="Autoplay Trailers"
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </div>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPasswordDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (validateForm()) {
                                setShowPasswordDialog(false);
                                handleSave();
                            }
                        }}
                        variant="contained"
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Settings;