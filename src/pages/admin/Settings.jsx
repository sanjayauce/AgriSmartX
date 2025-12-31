import {
    NotificationsActive as NotificationsActiveIcon,
    Notifications as NotificationsIcon,
    Refresh as RefreshIcon,
    Save as SaveIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Speed as SpeedIcon,
    Storage as StorageIcon,
    Tune as TuneIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for settings data
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // State for form validation
  const [errors, setErrors] = useState({});

  // Fetch settings data
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5005/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch settings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle setting changes
  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Validate settings
  const validateSettings = () => {
    const newErrors = {};

    // Validate system settings
    if (settings.system?.maxUsersPerRole < 1) {
      newErrors.maxUsersPerRole = 'Maximum users per role must be at least 1';
    }
    if (settings.system?.sessionTimeout < 300) {
      newErrors.sessionTimeout = 'Session timeout must be at least 5 minutes (300 seconds)';
    }

    // Validate security settings
    if (settings.security?.passwordMinLength < 6) {
      newErrors.passwordMinLength = 'Password minimum length must be at least 6 characters';
    }
    if (settings.security?.maxLoginAttempts < 1) {
      newErrors.maxLoginAttempts = 'Maximum login attempts must be at least 1';
    }
    if (settings.security?.lockoutDuration < 1) {
      newErrors.lockoutDuration = 'Lockout duration must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    if (!validateSettings()) {
      setSnackbar({
        open: true,
        message: 'Please fix validation errors before saving',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('http://localhost:5005/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchSettings();
  };

  // Get backup frequency options
  const backupFrequencies = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  // Get notification frequency options
  const notificationFrequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  return (
    <Box className="settings-management">
      <Paper className="settings-paper">
        {/* Header */}
        <Box className="settings-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {t('admin.settings')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Configure system settings and preferences
          </Typography>
        </Box>

        {/* Controls */}
        <Box className="controls-section">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="primary">
                System Configuration
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={saving || loading}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* System Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TuneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      System Settings
                    </Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.system?.maintenanceMode || false}
                        onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                        color="warning"
                      />
                    }
                    label="Maintenance Mode"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.system?.registrationEnabled || true}
                        onChange={(e) => handleSettingChange('system', 'registrationEnabled', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable User Registration"
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <TextField
                    fullWidth
                    label="Maximum Users per Role"
                    type="number"
                    value={settings.system?.maxUsersPerRole || 1000}
                    onChange={(e) => handleSettingChange('system', 'maxUsersPerRole', parseInt(e.target.value))}
                    error={!!errors.maxUsersPerRole}
                    helperText={errors.maxUsersPerRole}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Users</InputAdornment>,
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Session Timeout"
                    type="number"
                    value={settings.system?.sessionTimeout || 3600}
                    onChange={(e) => handleSettingChange('system', 'sessionTimeout', parseInt(e.target.value))}
                    error={!!errors.sessionTimeout}
                    helperText={errors.sessionTimeout || 'Session timeout in seconds'}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Seconds</InputAdornment>,
                    }}
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.system?.backupFrequency || 'daily'}
                      onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                      label="Backup Frequency"
                    >
                      {backupFrequencies.map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Security Settings
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Password Minimum Length"
                    type="number"
                    value={settings.security?.passwordMinLength || 8}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    error={!!errors.passwordMinLength}
                    helperText={errors.passwordMinLength}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Chars</InputAdornment>,
                    }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security?.requireTwoFactor || false}
                        onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                        color="error"
                      />
                    }
                    label="Require Two-Factor Authentication"
                  />
                  
                  <TextField
                    fullWidth
                    label="Maximum Login Attempts"
                    type="number"
                    value={settings.security?.maxLoginAttempts || 5}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    error={!!errors.maxLoginAttempts}
                    helperText={errors.maxLoginAttempts}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Attempts</InputAdornment>,
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Lockout Duration"
                    type="number"
                    value={settings.security?.lockoutDuration || 15}
                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                    error={!!errors.lockoutDuration}
                    helperText={errors.lockoutDuration || 'Lockout duration in minutes'}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Minutes</InputAdornment>,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NotificationsIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Notification Settings
                    </Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications?.emailNotifications || true}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications?.smsNotifications || false}
                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="SMS Notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications?.pushNotifications || true}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        color="success"
                      />
                    }
                    label="Push Notifications"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Notification Frequency</InputLabel>
                    <Select
                      value={settings.notifications?.notificationFrequency || 'realtime'}
                      onChange={(e) => handleSettingChange('notifications', 'notificationFrequency', e.target.value)}
                      label="Notification Frequency"
                    >
                      {notificationFrequencies.map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SettingsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Feature Settings
                    </Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features?.enableMessaging || true}
                        onChange={(e) => handleSettingChange('features', 'enableMessaging', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable Messaging System"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features?.enableReports || true}
                        onChange={(e) => handleSettingChange('features', 'enableReports', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable Reports & Analytics"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features?.enableLogs || true}
                        onChange={(e) => handleSettingChange('features', 'enableLogs', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable System Logs"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features?.enableUserManagement || true}
                        onChange={(e) => handleSettingChange('features', 'enableUserManagement', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable User Management"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* System Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <StorageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6">Database</Typography>
                        <Chip label="Connected" color="success" size="small" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <SpeedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6">Performance</Typography>
                        <Chip label="Optimal" color="success" size="small" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6">Security</Typography>
                        <Chip label="Active" color="success" size="small" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <NotificationsActiveIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6">Notifications</Typography>
                        <Chip label="Enabled" color="success" size="small" />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
