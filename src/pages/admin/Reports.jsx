import {
  Assessment as AssessmentIcon,
  Computer as ComputerIcon,
  Download as DownloadIcon,
  Memory as MemoryIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import './Reports.css';

const Reports = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for reports data
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // State for auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute

  // Available periods
  const periods = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  // Available report types
  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'users', label: 'User Analytics' },
    { value: 'messages', label: 'Message Analytics' },
    { value: 'system', label: 'System Performance' }
  ];

  // Fetch reports data
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: reportType,
        period
      });

      const response = await fetch(`http://localhost:5005/api/admin/reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch reports',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [period, reportType]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchReports();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Handle refresh
  const handleRefresh = () => {
    fetchReports();
  };

  // Handle export report
  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period,
      reportType,
      data: reports
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrihelp-report-${reportType}-${period}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format memory usage
  const formatMemoryUsage = (bytes) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Format uptime
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Prepare chart data for user registrations
  const prepareUserChartData = () => {
    if (!reports.userMetrics?.dailyRegistrations) return [];
    return reports.userMetrics.dailyRegistrations.map(item => ({
      date: item._id,
      users: item.count
    }));
  };

  // Prepare chart data for role distribution
  const prepareRoleChartData = () => {
    if (!reports.userMetrics?.usersByRole) return [];
    return reports.userMetrics.usersByRole.map(item => ({
      role: item._id,
      count: item.count
    }));
  };

  // Prepare chart data for message distribution
  const prepareMessageChartData = () => {
    if (!reports.messageMetrics?.messagesByRole) return [];
    return reports.messageMetrics.messagesByRole.map(item => ({
      role: item._id,
      count: item.count
    }));
  };

  // Pie chart colors
  const pieColors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#607D8B', '#795548', '#E91E63'];

  return (
    <Box className="reports-management">
      <Paper className="reports-paper">
        {/* Header */}
        <Box className="reports-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {t('admin.reports')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive analytics and system performance reports
          </Typography>
        </Box>

        {/* Controls */}
        <Box className="controls-section">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  label="Time Period"
                >
                  {periods.map((period) => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportReport}
                >
                  Export Report
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
          <>
            {/* Overview Section */}
            {reportType === 'overview' && (
              <>
                {/* Key Metrics */}
                <Grid container spacing={3} className="metrics-grid">
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PeopleIcon color="primary" sx={{ mr: 1 }} />
                          <Typography color="textSecondary">
                            Total Users
                          </Typography>
                        </Box>
                        <Typography variant="h4">
                          {reports.userMetrics?.totalUsers || 0}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {reports.userMetrics?.growthRate > 0 ? (
                            <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                          ) : (
                            <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                          )}
                          <Typography variant="body2" color={reports.userMetrics?.growthRate > 0 ? 'success.main' : 'error.main'}>
                            {reports.userMetrics?.growthRate?.toFixed(1) || 0}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MessageIcon color="secondary" sx={{ mr: 1 }} />
                          <Typography color="textSecondary">
                            Total Messages
                          </Typography>
                        </Box>
                        <Typography variant="h4">
                          {reports.messageMetrics?.totalMessages || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SpeedIcon color="info" sx={{ mr: 1 }} />
                          <Typography color="textSecondary">
                            System Uptime
                          </Typography>
                        </Box>
                        <Typography variant="h4">
                          {formatUptime(reports.systemMetrics?.uptime || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MemoryIcon color="warning" sx={{ mr: 1 }} />
                          <Typography color="textSecondary">
                            Memory Usage
                          </Typography>
                        </Box>
                        <Typography variant="h4">
                          {formatMemoryUsage(reports.systemMetrics?.memoryUsage?.heapUsed || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={3} className="charts-section">
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          User Registrations (Last 30 Days)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={prepareUserChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Area type="monotone" dataKey="users" stroke="#2196F3" fill="#2196F3" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          User Distribution by Role
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={prepareRoleChartData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {prepareRoleChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            {/* User Analytics Section */}
            {reportType === 'users' && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          User Growth Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={prepareUserChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="users" stroke="#4CAF50" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Top User Roles
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={prepareRoleChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="role" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#2196F3" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            {/* Message Analytics Section */}
            {reportType === 'messages' && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Message Distribution by Role
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={prepareMessageChartData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {prepareMessageChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Message Activity
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={prepareMessageChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="role" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#FF9800" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            {/* System Performance Section */}
            {reportType === 'system' && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          System Information
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <ComputerIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Platform"
                              secondary={reports.systemMetrics?.platform || 'Unknown'}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Node Version"
                              secondary={reports.systemMetrics?.nodeVersion || 'Unknown'}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <SpeedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Uptime"
                              secondary={formatUptime(reports.systemMetrics?.uptime || 0)}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Memory Usage
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            Heap Used
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(reports.systemMetrics?.memoryUsage?.heapUsed / reports.systemMetrics?.memoryUsage?.heapTotal) * 100 || 0}
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {formatMemoryUsage(reports.systemMetrics?.memoryUsage?.heapUsed || 0)} / {formatMemoryUsage(reports.systemMetrics?.memoryUsage?.heapTotal || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            External Memory
                          </Typography>
                          <Typography variant="body2">
                            {formatMemoryUsage(reports.systemMetrics?.memoryUsage?.external || 0)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Array Buffers
                          </Typography>
                          <Typography variant="body2">
                            {formatMemoryUsage(reports.systemMetrics?.memoryUsage?.arrayBuffers || 0)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </>
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

export default Reports;
