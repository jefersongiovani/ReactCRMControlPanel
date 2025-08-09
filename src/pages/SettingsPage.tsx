/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  TextField,
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useAuth } from '@/store/AuthContext';
import { useNotification } from '@/store/NotificationContext';
import { AppSettings } from '@/types';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
    },
  });

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSettingsChange = (
    section: keyof AppSettings,
    key: string,
    value: unknown
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(profileData);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Here you would typically save to backend
      localStorage.setItem('appSettings', JSON.stringify(settings));
      showSuccess('Settings saved successfully');
    } catch (error) {
      showError('Failed to save settings');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Profile Settings</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                {...(user?.avatar ? { src: user.avatar } : {})}
                sx={{ width: 80, height: 80, mr: 2 }}
              >
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Avatar>
              <Button variant="outlined" size="small">
                Change Photo
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                value={profileData.firstName}
                onChange={e => handleProfileChange('firstName', e.target.value)}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={profileData.lastName}
                onChange={e => handleProfileChange('lastName', e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={profileData.email}
                onChange={e => handleProfileChange('email', e.target.value)}
                fullWidth
                type="email"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                sx={{ alignSelf: 'flex-start' }}
              >
                Save Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Appearance Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PaletteIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Appearance</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Theme"
                  secondary="Choose your preferred theme"
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.theme}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          theme: e.target.value as 'light' | 'dark',
                        }))
                      }
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Language"
                  secondary="Select your preferred language"
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.language}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={e =>
                      handleSettingsChange(
                        'notifications',
                        'email',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications in browser"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={e =>
                      handleSettingsChange(
                        'notifications',
                        'push',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="In-App Notifications"
                  secondary="Show notifications within the application"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.inApp}
                    onChange={e =>
                      handleSettingsChange(
                        'notifications',
                        'inApp',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Privacy Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Privacy & Security</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Profile Visibility"
                  secondary="Control who can see your profile"
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onChange={e =>
                        handleSettingsChange(
                          'privacy',
                          'profileVisibility',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Data Sharing"
                  secondary="Allow sharing of anonymized usage data"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onChange={e =>
                      handleSettingsChange(
                        'privacy',
                        'dataSharing',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Button variant="outlined" color="error" fullWidth>
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          size="large"
        >
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
};
