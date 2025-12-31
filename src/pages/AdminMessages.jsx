import { Send as SendIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminMessages.css';

const AdminMessages = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersByRole, setUsersByRole] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Roles options
  const roles = [
    { value: 'Farmer', label: t('roles.farmer') || 'Farmer' },
    { value: 'Resource Provider', label: t('roles.resourceProvider') || 'Resource Provider' },
    { value: 'Government Agencies', label: t('roles.governmentAgencies') || 'Government Agencies' },
    { value: 'Admin', label: t('roles.admin') || 'Admin' },
    { value: 'Dealer', label: t('roles.dealer') || 'Dealer' },
    { value: 'Agriculture Expert', label: t('roles.agricultureExpert') || 'Agriculture Expert' },
    { value: 'Wholesaler', label: t('roles.wholesaler') || 'Wholesaler' },
    { value: 'Retailer', label: t('roles.retailer') || 'Retailer' },
    { value: 'NGOs', label: t('roles.ngos') || 'NGOs' },
  ];

  // Fetch users when roles change
  useEffect(() => {
    const fetchUsersForRoles = async () => {
      if (selectedRoles.length === 0) {
        setUsersByRole({});
        setSelectedUsers([]);
        return;
      }

      setLoadingUsers(true);
      const newUsersByRole = {};

      try {
        for (const role of selectedRoles) {
          const response = await fetch(`http://localhost:5005/api/admin/users-by-role?role=${encodeURIComponent(role)}`);
          if (response.ok) {
            const data = await response.json();
            newUsersByRole[role] = data.users;
          }
        }
        setUsersByRole(newUsersByRole);
      } catch (error) {
        console.error('Error fetching users:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch users for selected roles',
          severity: 'error',
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersForRoles();
  }, [selectedRoles]);

  // Handle role multi-select
  const handleRoleChange = (event) => {
    setSelectedRoles(event.target.value);
  };

  // Handle user selection
  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all users for a role
  const handleSelectAllForRole = (role) => {
    const roleUsers = usersByRole[role] || [];
    const roleUserIds = roleUsers.map(user => user.id);
    
    setSelectedUsers(prev => {
      const otherUsers = prev.filter(id => !roleUserIds.includes(id));
      return [...otherUsers, ...roleUserIds];
    });
  };

  // Handle deselect all users for a role
  const handleDeselectAllForRole = (role) => {
    const roleUsers = usersByRole[role] || [];
    const roleUserIds = roleUsers.map(user => user.id);
    
    setSelectedUsers(prev => prev.filter(id => !roleUserIds.includes(id)));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!subject.trim() || !message.trim() || selectedRoles.length === 0) {
      setSnackbar({
        open: true,
        message: t('adminMessages.validationError') || 'Please fill in all fields.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Call your Express API
      const response = await fetch('http://localhost:5005/api/admin/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          roles: selectedRoles,
          targetUsers: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Server response:', result);

      // Show success
      setSnackbar({
        open: true,
        message: t('adminMessages.success') || 'Message sent successfully!',
        severity: 'success',
      });

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedRoles([]);
      setSelectedUsers([]);
      setUsersByRole({});

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setSnackbar({
        open: true,
        message: t('adminMessages.error') || 'Something went wrong. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="admin-messages">
      <Paper className="admin-messages-paper">
        <Typography variant="h5" component="h1" gutterBottom>
          {t('adminMessages.title') || 'Send Message to Users'}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {t('adminMessages.description') || 'Select user roles and send them important updates.'}
        </Typography>

        <form onSubmit={handleSubmit} className="admin-messages-form">
          <FormControl fullWidth margin="normal">
            <InputLabel id="roles-label">
              {t('adminMessages.selectRoles') || 'Select Roles'}
            </InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={selectedRoles}
              onChange={handleRoleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={roles.find((role) => role.value === value)?.label || value}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* User Selection Section */}
          {selectedRoles.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Users ({selectedUsers.length} selected)
              </Typography>
              {loadingUsers ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography>Loading users...</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                  {selectedRoles.map((role) => {
                    const roleUsers = usersByRole[role] || [];
                    const selectedRoleUsers = roleUsers.filter(user => selectedUsers.includes(user.id));
                    
                    return (
                      <Box key={role}>
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: 'grey.100', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <Typography variant="subtitle2">
                            {roles.find(r => r.value === role)?.label || role} ({roleUsers.length} users)
                          </Typography>
                          <Box>
                            <Button 
                              size="small" 
                              onClick={() => handleSelectAllForRole(role)}
                              disabled={roleUsers.length === 0}
                            >
                              Select All
                            </Button>
                            <Button 
                              size="small" 
                              onClick={() => handleDeselectAllForRole(role)}
                              disabled={roleUsers.length === 0}
                            >
                              Deselect All
                            </Button>
                          </Box>
                        </Box>
                        <List dense>
                          {roleUsers.length === 0 ? (
                            <ListItem>
                              <ListItemText 
                                primary="No users found for this role" 
                                secondary="Users will appear here once they register"
                              />
                            </ListItem>
                          ) : (
                            roleUsers.map((user) => (
                              <ListItem key={user.id} dense>
                                <Checkbox
                                  edge="start"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleUserToggle(user.id)}
                                  size="small"
                                />
                                <ListItemText
                                  primary={user.email}
                                  secondary={`${user.roleId} • ${new Date(user.createdAt).toLocaleDateString()}`}
                                />
                              </ListItem>
                            ))
                          )}
                        </List>
                        {selectedRoles.indexOf(role) < selectedRoles.length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </Box>
              )}
              <FormHelperText>
                {selectedUsers.length > 0 
                  ? `Selected ${selectedUsers.length} user(s) from ${selectedRoles.length} role(s)`
                  : 'No users selected. Message will be sent to all users in selected roles.'
                }
              </FormHelperText>
            </Box>
          )}

          <TextField
            fullWidth
            margin="normal"
            label={t('adminMessages.subject') || 'Subject'}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label={t('adminMessages.message') || 'Message'}
            multiline
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder={t('adminMessages.messagePlaceholder') || 'Type your message here...'}
          />

          <Box className="admin-messages-actions">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={loading}
            >
              {loading
                ? t('common.sending') || 'Sending...'
                : t('adminMessages.send') || 'Send'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMessages;
