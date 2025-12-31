import {
    Download as DownloadIcon,
    Error as ErrorIcon,
    ExpandMore as ExpandMoreIcon,
    Info as InfoIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
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
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './Logs.css';

const Logs = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for logs data
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalLogs, setTotalLogs] = useState(0);

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // State for auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Available log levels
  const logLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  // Fetch logs data
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...(levelFilter !== 'all' && { level: levelFilter }),
        ...(searchTerm && { search: searchTerm }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await fetch(`http://localhost:5005/api/admin/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      
      const data = await response.json();
      setLogs(data.logs);
      setTotalLogs(data.pagination.totalLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch logs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch log statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('http://localhost:5005/api/admin/logs/stats');
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
    fetchLogs();
  }, [page, rowsPerPage, searchTerm, levelFilter, startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

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

  // Handle level filter
  const handleLevelFilter = (event) => {
    setLevelFilter(event.target.value);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLogs();
    fetchStats();
  };

  // Handle export logs
  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message', 'Details'],
      ...logs.map(log => [
        log.timestamp,
        log.level,
        log.source,
        log.message,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      'info': 'primary',
      'warning': 'warning',
      'error': 'error'
    };
    return colors[level] || 'default';
  };

  // Get level icon
  const getLevelIcon = (level) => {
    const icons = {
      'info': <InfoIcon />,
      'warning': <WarningIcon />,
      'error': <ErrorIcon />
    };
    return icons[level] || <InfoIcon />;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!stats.logsByHour) return [];
    return stats.logsByHour.map(item => ({
      hour: new Date(item.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: item.count
    }));
  };

  const pieChartData = [
    { name: 'Info', value: stats.infoLogs || 0, color: '#2196F3' },
    { name: 'Warning', value: stats.warningLogs || 0, color: '#FF9800' },
    { name: 'Error', value: stats.errorLogs || 0, color: '#F44336' }
  ];

  return (
    <Box className="logs-management">
      <Paper className="logs-paper">
        {/* Header */}
        <Box className="logs-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {t('admin.systemLogs')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor system activity and performance in real-time
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {!statsLoading && (
          <Grid container spacing={3} className="stats-grid">
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Logs
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalLogs || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    System Health
                  </Typography>
                  <Typography variant="h4">
                    {stats.systemHealth || 0}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.systemHealth || 0} 
                    color={stats.systemHealth > 80 ? 'success' : stats.systemHealth > 60 ? 'warning' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Error Logs
                  </Typography>
                  <Typography variant="h4" color="error">
                    {stats.errorLogs || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Warning Logs
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.warningLogs || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Charts Section */}
        {!statsLoading && (
          <Grid container spacing={3} className="charts-section">
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Log Activity (Last 24 Hours)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="count" stroke="#2196F3" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Log Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters and Controls */}
        <Box className="filters-section">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Search logs"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                placeholder="Search by message or source..."
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Log Level</InputLabel>
                <Select
                  value={levelFilter}
                  onChange={handleLevelFilter}
                  label="Log Level"
                >
                  {logLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportLogs}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Logs Table */}
        <TableContainer component={Paper} className="logs-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getLevelIcon(log.level)}
                        label={log.level.toUpperCase()}
                        color={getLevelColor(log.level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.source}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Accordion size="small">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="caption">View Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="textSecondary">
                            {log.details}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
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
          count={totalLogs}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[25, 50, 100, 200]}
        />
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

export default Logs;
