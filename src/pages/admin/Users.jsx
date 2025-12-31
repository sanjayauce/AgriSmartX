import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const Users = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // State for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for form data
  const [editForm, setEditForm] = useState({
    email: '',
    role: ''
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Available roles
  const roles = [
    'Farmer',
    'Resource Provider',
    'Retailer',
    'Wholesaler',
    'Dealer',
    'Agriculture Expert',
    'Government Agencies',
    'NGOs',
    'Admin'
  ];

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`http://localhost:5005/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
      setTotalUsers(data.pagination.totalUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: t('admin.failedToFetch'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('http://localhost:5005/api/admin/users/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle role filter
  const handleRoleFilter = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(0);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5005/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSnackbar({
        open: true,
        message: t('admin.userUpdated'),
        severity: 'success'
      });

      setEditDialogOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || t('admin.failedToUpdate'),
        severity: 'error'
      });
    }
  };

  // Handle delete user
  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5005/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSnackbar({
        open: true,
        message: t('admin.userDeleted'),
        severity: 'success'
      });

      setDeleteDialogOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || t('admin.failedToDelete'),
        severity: 'error'
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
    fetchStats();
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      'Farmer': 'primary',
      'Resource Provider': 'secondary',
      'Retailer': 'success',
      'Wholesaler': 'info',
      'Dealer': 'warning',
      'Agriculture Expert': 'error',
      'Government Agencies': 'default',
      'NGOs': 'default',
      'Admin': 'error'
    };
    return colors[role] || 'default';
  };

  return (
    <Box className="users-management">
      <Paper className="users-paper">
        {/* Header */}
        <Box className="users-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {t('admin.userManagement')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('admin.userManagementDesc')}
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {!statsLoading && (
          <Grid container spacing={3} className="stats-grid">
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('admin.totalUsers')}
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('admin.recentRegistrations')}
                  </Typography>
                  <Typography variant="h4">
                    {stats.recentRegistrations || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('admin.last7Days')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('admin.todayRegistrations')}
                  </Typography>
                  <Typography variant="h4">
                    {stats.todayRegistrations || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('admin.topRole')}
                  </Typography>
                  <Typography variant="h6">
                    {stats.usersByRole?.[0]?._id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stats.usersByRole?.[0]?.count || 0} {t('admin.users')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters and Search */}
        <Box className="filters-section">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('admin.searchUsers')}
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                placeholder={t('admin.searchPlaceholder')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t('admin.filterByRole')}</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={handleRoleFilter}
                  label={t('admin.filterByRole')}
                >
                  <MenuItem value="all">{t('admin.allRoles')}</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t('admin.sortBy')}</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  label={t('admin.sortBy')}
                >
                  <MenuItem value="createdAt">{t('admin.registrationDate')}</MenuItem>
                  <MenuItem value="email">{t('admin.email')}</MenuItem>
                  <MenuItem value="role">{t('admin.role')}</MenuItem>
                  <MenuItem value="roleId">{t('admin.roleId')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                {t('admin.refresh')}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Users Table */}
        <TableContainer component={Paper} className="users-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.email')}</TableCell>
                <TableCell>{t('admin.roleId')}</TableCell>
                <TableCell>{t('admin.role')}</TableCell>
                <TableCell>{t('admin.registrationDate')}</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">{t('admin.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {t('admin.noUsersFound')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roleId}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status || t('admin.active')}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('admin.editUser')}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('admin.deleteUser')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('admin.editUser')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('admin.email')}
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('admin.role')}</InputLabel>
            <Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              label={t('admin.role')}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>{t('admin.cancel')}</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            {t('admin.updateUser')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('admin.deleteUser')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('admin.deleteConfirmation')} <strong>{selectedUser?.email}</strong>?
            {t('admin.deleteWarning')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('admin.cancel')}</Button>
          <Button onClick={handleDeleteSubmit} variant="contained" color="error">
            {t('admin.deleteUser')}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Users;
