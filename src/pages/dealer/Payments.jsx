import {
  AccountBalance,
  Add,
  Download,
  Payment as PaymentIcon,
  Receipt,
  Search,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Payments.css';

const Payments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [payables, setPayables] = useState([]); // Dealer to Wholesaler
  const [receivables, setReceivables] = useState([]); // Retailer to Dealer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        // Fetch dealer requests (to wholesaler)
        const dealerRes = await fetch(`http://localhost:5005/api/inventory/dealer-requests/dealer/${user.roleId}`);
        const dealerData = await dealerRes.json();
        // Only accepted by wholesaler
        const payablesData = (dealerData || []).filter(r => r.status === 'accepted');
        setPayables(payablesData);
        // Fetch retailer requests (from retailers)
        const retailerRes = await fetch(`http://localhost:5005/api/inventory/retailer-requests/dealer/${user.roleId}`);
        const retailerData = await retailerRes.json();
        // Only accepted by dealer
        const receivablesData = (retailerData || []).filter(r => r.status === 'accepted');
        setReceivables(receivablesData);
      } catch (err) {
        setError('Failed to fetch payment data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Mock data - replace with actual API calls
  const payments = [
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      customer: 'John Farmer',
      date: '2024-03-14',
      amount: '₹12,500',
      method: 'UPI',
      status: 'completed',
      type: 'received',
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      customer: 'Sarah Agriculturist',
      date: '2024-03-13',
      amount: '₹8,750',
      method: 'Bank Transfer',
      status: 'pending',
      type: 'received',
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      supplier: 'Agro Supplies Ltd',
      date: '2024-03-12',
      amount: '₹25,000',
      method: 'Bank Transfer',
      status: 'completed',
      type: 'sent',
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      customer: 'Mike Cultivator',
      date: '2024-03-11',
      amount: '₹15,200',
      method: 'Cash',
      status: 'failed',
      type: 'received',
    },
  ];

  // Calculate real-time stats
  const totalRevenue = receivables.filter(r => r.paymentStatus === 'done').reduce((sum, r) => sum + (parseFloat(r.price) * r.requestedQty), 0);
  const pendingPayments = receivables.filter(r => r.paymentStatus !== 'done').reduce((sum, r) => sum + (parseFloat(r.price) * r.requestedQty), 0);
  const totalPayables = payables.filter(p => p.paymentStatus !== 'done').reduce((sum, p) => sum + (parseFloat(p.price) * p.requestedQty), 0);
  const totalReceived = receivables.filter(r => r.paymentStatus === 'done').reduce((sum, r) => sum + (parseFloat(r.price) * r.requestedQty), 0);
  const totalPaid = payables.filter(p => p.paymentStatus === 'done').reduce((sum, p) => sum + (parseFloat(p.price) * p.requestedQty), 0);
  const bankBalance = totalReceived - totalPaid;

  const stats = [
    {
      label: t('dealer.totalRevenue', 'Total Revenue'),
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp />, color: '#4CAF50', change: '',
    },
    {
      label: t('dealer.pendingPayments', 'Pending Payments'),
      value: `₹${pendingPayments.toLocaleString()}`,
      icon: <Warning />, color: '#FFA726', change: '',
    },
    {
      label: t('dealer.totalPayables', 'Total Payables'),
      value: `₹${totalPayables.toLocaleString()}`,
      icon: <PaymentIcon />, color: '#F44336', change: '',
    },
    {
      label: t('dealer.bankBalance', 'Bank Balance'),
      value: `₹${bankBalance.toLocaleString()}`,
      icon: <AccountBalance />, color: '#2196F3', change: 'Updated now',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: '#4CAF50',
      pending: '#FFA726',
      failed: '#F44336',
    };
    return colors[status] || '#757575';
  };

  const getTypeColor = (type) => {
    return type === 'received' ? '#4CAF50' : '#F44336';
  };

  // Filtered payments logic updated to use real transactions
  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      (payment.itemName && payment.itemName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.dealerEmail && payment.dealerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
    // For dealer, received = paymentStatus 'done', sent = 'due' (or customize as needed)
    const matchesType = activeTab === 0 ? payment.paymentStatus === 'done' : payment.paymentStatus === 'due';
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPayment = () => {
    setOpenPaymentDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="dealer-payments-dashboard">
      <div className="dealer-payments-header">
        <h1>{t('dealer.payments', 'Payments Management')}</h1>
        <p className="dealer-payments-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="dealer-payments-stats">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: stat.color, mr: 1 }}>{stat.icon}</Box>
                  <Typography variant="h6" component="div" style={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for Received/Sent Payments */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="payment tabs">
          <Tab label={t('dealer.receivedPayments')} />
          <Tab label={t('dealer.sentPayments')} />
        </Tabs>
      </Box>

      {/* Filters and Actions */}
      <div className="dealer-payments-filters">
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder={t('dealer.searchPayments')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('dealer.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('dealer.status')}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">{t('dealer.allStatus')}</MenuItem>
              <MenuItem value="completed">{t('dealer.completed')}</MenuItem>
              <MenuItem value="pending">{t('dealer.pending')}</MenuItem>
              <MenuItem value="failed">{t('dealer.failed')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('dealer.date')}</InputLabel>
            <Select
              value={dateFilter}
              label={t('dealer.date')}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">{t('dealer.allTime')}</MenuItem>
              <MenuItem value="today">{t('dealer.today')}</MenuItem>
              <MenuItem value="week">{t('dealer.thisWeek')}</MenuItem>
              <MenuItem value="month">{t('dealer.thisMonth')}</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddPayment}
          >
            {t('dealer.addPayment')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            {t('dealer.export')}
          </Button>
        </Box>
      </div>

      {/* Payments Table */}
      <TableContainer component={Paper} className="dealer-payments-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('dealer.paymentId')}</TableCell>
              <TableCell>{t('dealer.orderId')}</TableCell>
              <TableCell>{activeTab === 0 ? t('dealer.customer') : t('dealer.supplier')}</TableCell>
              <TableCell>{t('dealer.date')}</TableCell>
              <TableCell>{t('dealer.amount')}</TableCell>
              <TableCell>{t('dealer.method')}</TableCell>
              <TableCell>{t('dealer.status')}</TableCell>
              <TableCell>{t('dealer.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.customer || payment.supplier}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell style={{ color: getTypeColor(payment.type) }}>
                  {payment.type === 'sent' ? '-' : '+'}{payment.amount}
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Chip
                    label={t(`dealer.${payment.status}`)}
                    style={{
                      backgroundColor: getStatusColor(payment.status),
                      color: 'white',
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" title={t('dealer.viewReceipt')}>
                    <Receipt fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title={t('dealer.download')}>
                    <Download fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dealer.addNewPayment')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('dealer.paymentType')}</InputLabel>
              <Select label={t('dealer.paymentType')}>
                <MenuItem value="received">{t('dealer.received')}</MenuItem>
                <MenuItem value="sent">{t('dealer.sent')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('dealer.orderId')}
              fullWidth
              size="small"
            />
            <TextField
              label={activeTab === 0 ? t('dealer.customer') : t('dealer.supplier')}
              fullWidth
              size="small"
            />
            <TextField
              label={t('dealer.amount')}
              type="number"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t('dealer.paymentMethod')}</InputLabel>
              <Select label={t('dealer.paymentMethod')}>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="bank">Bank Transfer</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('dealer.notes')}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('dealer.cancel')}</Button>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            {t('dealer.add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payables Section */}
      <h2>Payables (to Wholesaler)</h2>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Wholesaler</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payables.map((row) => {
              const priceNum = row.price ? Number(String(row.price).replace(/[^\d.]/g, '')) : 0;
              const total = priceNum * Number(row.requestedQty);
              return (
                <TableRow key={row._id}>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.wholesalerEmail}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.requestedQty}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>₹{total.toLocaleString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.paymentStatus || '-'}</TableCell>
                  <TableCell>{new Date(row.updatedAt || row.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Receivables Section */}
      <h2>Receivables (from Retailers)</h2>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Retailer</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivables.map((row) => {
              const priceNum = row.price ? Number(String(row.price).replace(/[^\d.]/g, '')) : 0;
              const total = priceNum * Number(row.requestedQty);
              return (
                <TableRow key={row._id}>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.retailerEmail}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.requestedQty}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>₹{total.toLocaleString()}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.paymentStatus || '-'}</TableCell>
                  <TableCell>{new Date(row.updatedAt || row.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Payments;
