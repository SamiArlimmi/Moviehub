import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Switch,
    Dialog,
    DialogContent,
    Snackbar,
    Alert,
    IconButton,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { ArrowBack, Edit, Camera, Lock, Save, Close, Settings as SettingsIcon } from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: ''
    });

    const [preferences, setPreferences] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || ''
            });
            if (user.preferences) {
                setPreferences(prev => ({ ...prev, ...user.preferences }));
            }
        }
    }, [user]);

    const handleSave = async () => {
        if (!profile.name.trim() || !profile.email.trim()) {
            showAlert('error', 'Name and email are required');
            return;
        }
        setLoading(true);
        try {
            await updateUser({ ...profile, preferences });
            setIsEditing(false);
            showAlert('success', 'Profile updated successfully!');
        } catch (error) {
            showAlert('error', 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new !== passwordData.confirm) {
            showAlert('error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await updateUser({ password: passwordData.new });
            setShowPasswordDialog(false);
            setPasswordData({ new: '', confirm: '' });
            showAlert('success', 'Password updated successfully!');
        } catch (error) {
            showAlert('error', 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    const getInitials = (name, email) => {
        if (name) return name.charAt(0).toUpperCase();
        if (email) return email.charAt(0).toUpperCase();
        return 'U';
    };

    // Styles matching Profile theme
    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    };

    const cardStyle = {
        background: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        color: 'white',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        maxWidth: '800px',
        width: '100%',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)'
        }
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        position: 'relative'
    };

    const titleStyle = {
        color: 'white',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const profileSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-3px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }
    };

    const avatarStyle = {
        width: 80,
        height: 80,
        background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
        fontSize: '2rem',
        fontWeight: 600,
        color: 'white'
    };

    const sectionStyle = {
        marginBottom: '2rem'
    };

    const sectionHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    };

    const sectionTitleStyle = {
        color: 'white',
        fontWeight: 600
    };

    const buttonStyle = {
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '0.75rem 1.5rem',
        transition: 'all 0.3s ease'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #f40612 0%, #e50914 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
        }
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05)'
        }
    };

    const fieldStyle = {
        marginBottom: '1rem',
        '& .MuiOutlinedInput-root': {
            color: 'white',
            borderRadius: '10px',
            background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)'
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#e50914'
            }
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
                color: '#e50914'
            }
        }
    };

    const preferenceItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '0.75rem',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateX(5px)'
        }
    };

    return (
        <Box sx={containerStyle}>
            <Snackbar
                open={alert.show}
                autoHideDuration={4000}
                onClose={() => setAlert({ show: false, type: '', message: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={alert.type} variant="filled">
                    {alert.message}
                </Alert>
            </Snackbar>

            <Card sx={cardStyle}>
                <CardContent sx={{ padding: '2rem' }}>
                    {/* Header */}
                    <Box sx={headerStyle}>
                        <IconButton
                            onClick={() => navigate('/profile')}
                            sx={secondaryButtonStyle}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h4" sx={titleStyle}>
                            Account Settings
                        </Typography>
                        <SettingsIcon sx={{ color: '#e50914', ml: 'auto' }} />
                    </Box>

                    {/* Profile Section */}
                    <Box sx={profileSectionStyle}>
                        <Avatar sx={avatarStyle}>
                            {getInitials(profile.name, profile.email)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                                {profile.name || 'User'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {profile.email}
                            </Typography>
                        </Box>
                        <Button
                            startIcon={<Camera />}
                            onClick={() => showAlert('info', 'Photo upload coming soon!')}
                            sx={secondaryButtonStyle}
                        >
                            Change Photo
                        </Button>
                    </Box>

                    {/* Personal Information */}
                    <Box sx={sectionStyle}>
                        <Box sx={sectionHeaderStyle}>
                            <Typography variant="h6" sx={sectionTitleStyle}>
                                Personal Information
                            </Typography>
                            <Button
                                startIcon={isEditing ? <Close /> : <Edit />}
                                onClick={() => setIsEditing(!isEditing)}
                                sx={secondaryButtonStyle}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                        </Box>

                        <TextField
                            label="Full Name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            fullWidth
                            sx={fieldStyle}
                        />
                        <TextField
                            label="Email Address"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            fullWidth
                            sx={fieldStyle}
                        />
                        <TextField
                            label="Bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                            multiline
                            rows={3}
                            fullWidth
                            sx={fieldStyle}
                            placeholder="Tell us about yourself..."
                        />

                        {isEditing && (
                            <Button
                                startIcon={<Save />}
                                onClick={handleSave}
                                disabled={loading}
                                sx={primaryButtonStyle}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                    {/* Security */}
                    <Box sx={sectionStyle}>
                        <Typography variant="h6" sx={{ ...sectionTitleStyle, mb: 2 }}>
                            Security
                        </Typography>
                        <Button
                            startIcon={<Lock />}
                            onClick={() => setShowPasswordDialog(true)}
                            sx={secondaryButtonStyle}
                        >
                            Change Password
                        </Button>
                    </Box>

                    <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                    {/* Preferences - Section removed as no preferences to show */}
                </CardContent>
            </Card>

            {/* Password Dialog */}
            <Dialog
                open={showPasswordDialog}
                onClose={() => setShowPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(26, 26, 46, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        color: 'white'
                    }
                }}
            >
                <DialogContent sx={{ padding: '2rem' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                        Change Password
                    </Typography>
                    <TextField
                        label="New Password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                        fullWidth
                        sx={{ ...fieldStyle, mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                        fullWidth
                        sx={{ ...fieldStyle, mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => setShowPasswordDialog(false)}
                            sx={secondaryButtonStyle}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordChange}
                            disabled={loading}
                            sx={primaryButtonStyle}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Settings;