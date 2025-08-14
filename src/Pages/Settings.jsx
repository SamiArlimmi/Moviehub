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
import '../css/Settings.css';

function Settings() {
    // Henter bruger data og update funktion fra AuthContext
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // State til at holde brugerens profil information
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: ''
    });

    // Tom state til præferencer (ikke brugt i øjeblikket)
    const [preferences, setPreferences] = useState({});

    // UI state til at kontrollere forskellige tilstande
    const [isEditing, setIsEditing] = useState(false); // Om redigering er aktiv
    const [showPasswordDialog, setShowPasswordDialog] = useState(false); // Om password dialog er åben
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' }); // Password formular data
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' }); // Alert besked state
    const [loading, setLoading] = useState(false); // Loading tilstand for async operationer

    // Opdaterer profil state når brugeren ændrer sig
    useEffect(() => {
        if (user) {
            // Indlæser brugerens basis information
            setProfile({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || ''
            });
            // Indlæser brugerens præferencer hvis de eksisterer
            if (user.preferences) {
                setPreferences(prev => ({ ...prev, ...user.preferences }));
            }
        }
    }, [user]);

    // Håndterer gem profil operation
    const handleSave = async () => {
        // Validerer at navn og email er udfyldt
        if (!profile.name.trim() || !profile.email.trim()) {
            showAlert('error', 'Name and email are required');
            return;
        }
        setLoading(true);
        try {
            // Opdaterer brugeren gennem AuthContext
            await updateUser({ ...profile, preferences });
            setIsEditing(false); // Afslutter redigerings tilstand
            showAlert('success', 'Profile updated successfully!');
        } catch (error) {
            showAlert('error', 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    // Håndterer password ændring
    const handlePasswordChange = async () => {
        // Validerer at passwords matcher
        if (passwordData.new !== passwordData.confirm) {
            showAlert('error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            // Opdaterer password gennem AuthContext
            await updateUser({ password: passwordData.new });
            setShowPasswordDialog(false); // Lukker dialog
            setPasswordData({ new: '', confirm: '' }); // Rydder formular
            showAlert('success', 'Password updated successfully!');
        } catch (error) {
            showAlert('error', 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    // Hjælpe funktion til at vise alert beskeder
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    // Genererer initialer til avatar baseret på navn eller email
    const getInitials = (name, email) => {
        if (name) return name.charAt(0).toUpperCase();
        if (email) return email.charAt(0).toUpperCase();
        return 'U'; // Fallback til 'U' hvis ingen data
    };

    return (
        <div className="settings-container">
            {/* Toast besked til bruger feedback */}
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

            {/* Hoved settings kort med glassmorphism effekt */}
            <Card className="settings-card">
                <CardContent className="settings-content">
                    {/* Header med tilbage knap, titel og ikon */}
                    <div className="settings-header">
                        <IconButton
                            onClick={() => navigate('/profile')}
                            className="back-btn"
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h4" className="settings-title">
                            Account Settings
                        </Typography>
                        <SettingsIcon className="settings-icon" />
                    </div>

                    {/* Profil sektion med avatar og basis info */}
                    <div className="profile-section">
                        <Avatar className="profile-avatar">
                            {getInitials(profile.name, profile.email)}
                        </Avatar>
                        <div className="profile-info">
                            <Typography variant="h6" className="profile-name">
                                {profile.name || 'User'}
                            </Typography>
                            <Typography variant="body2" className="profile-email">
                                {profile.email}
                            </Typography>
                        </div>
                        <Button
                            startIcon={<Camera />}
                            onClick={() => showAlert('info', 'Photo upload coming soon!')}
                            className="change-photo-btn"
                        >
                            Change Photo
                        </Button>
                    </div>

                    {/* Personlig information sektion med redigerings funktionalitet */}
                    <div className="info-section">
                        <div className="section-header">
                            <Typography variant="h6" className="section-title">
                                Personal Information
                            </Typography>
                            {/* Toggle knap til redigering */}
                            <Button
                                startIcon={isEditing ? <Close /> : <Edit />}
                                onClick={() => setIsEditing(!isEditing)}
                                className="edit-btn"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>

                        {/* Formular felter til profil redigering */}
                        <TextField
                            label="Full Name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            fullWidth
                            className="form-field"
                        />
                        <TextField
                            label="Email Address"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            fullWidth
                            className="form-field"
                        />
                        <TextField
                            label="Bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                            multiline
                            rows={3}
                            fullWidth
                            className="form-field"
                            placeholder="Tell us about yourself..."
                        />

                        {/* Gem knap vises kun i redigerings tilstand */}
                        {isEditing && (
                            <div className="action-buttons">
                                <Button
                                    startIcon={<Save />}
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="save-btn"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Sektion divider */}
                    <Divider className="section-divider" />

                    {/* Sikkerhed sektion med password ændring */}
                    <div className="security-section">
                        <Typography variant="h6" className="section-title">
                            Security
                        </Typography>
                        <Button
                            startIcon={<Lock />}
                            onClick={() => setShowPasswordDialog(true)}
                            className="password-btn"
                        >
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Password ændring dialog modal */}
            <Dialog
                open={showPasswordDialog}
                onClose={() => setShowPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
                className="password-dialog"
            >
                <DialogContent className="dialog-content">
                    <Typography variant="h6" className="dialog-title">
                        Change Password
                    </Typography>
                    {/* Nyt password felt */}
                    <TextField
                        label="New Password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                        fullWidth
                        className="dialog-field"
                    />
                    {/* Bekræft password felt */}
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                        fullWidth
                        className="dialog-field"
                    />
                    {/* Dialog action knapper */}
                    <div className="dialog-actions">
                        <Button
                            onClick={() => setShowPasswordDialog(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordChange}
                            disabled={loading}
                            className="update-btn"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Settings;