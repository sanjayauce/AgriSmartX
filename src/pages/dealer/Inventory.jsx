import {
  Add,
  Inventory as InventoryIcon,
  Search,
  TrendingDown,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Inventory.css';

const Inventory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [wholesalers, setWholesalers] = useState([]);
  const [selectedWholesaler, setSelectedWholesaler] = useState('');
  const [stockAmount, setStockAmount] = useState('');
  const [loadingWholesalers, setLoadingWholesalers] = useState(false);
  const [error, setError] = useState(null);
  const [wholesalerInventory, setWholesalerInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [requestedItems, setRequestedItems] = useState([]);
  const [dealerInventory, setDealerInventory] = useState([]);
  const [priceInputs, setPriceInputs] = useState({});

  // Add polling for dealer requests to update status in real time
  useEffect(() => {
    if (!user?.roleId) return;
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/dealer-requests/dealer/${user.roleId}`);
        // Only keep accepted requests for inventory table
        setRequestedItems((res.data || []).filter(req => req.status === 'accepted'));
        // Set initial price inputs
        const priceMap = {};
        (res.data || []).filter(req => req.status === 'accepted').forEach(item => {
          priceMap[item._id] = item.price || '';
        });
        setPriceInputs(priceMap);
      } catch (err) {
        setRequestedItems([]);
        setPriceInputs({});
      }
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Fetch dealer's successful inventory (accepted transactions)
  useEffect(() => {
    if (!user?.roleId) return;
    const fetchDealerInventory = async () => {
      try {
        // Fetch all transactions for this dealer
        const res = await axios.get(`http://localhost:5005/api/inventory/transactions/dealer/${user.roleId}`);
        // Only show accepted (successful) items
        setDealerInventory(res.data.filter(txn => txn.paymentStatus === 'done' || txn.paymentStatus === 'due'));
      } catch (err) {
        setDealerInventory([]);
      }
    };
    fetchDealerInventory();
  }, [user]);

  const stats = [
    { 
      label: t('dealer.totalItems'), 
      value: '1,250', 
      icon: <InventoryIcon />,
      color: '#4CAF50' 
    },
    { 
      label: t('dealer.lowStock'), 
      value: '5', 
      icon: <Warning />,
      color: '#FFA726' 
    },
    { 
      label: t('dealer.outOfStock'), 
      value: '2', 
      icon: <TrendingDown />,
      color: '#F44336' 
    },
    { 
      label: t('dealer.totalValue'), 
      value: '₹2,50,000', 
      icon: <TrendingUp />,
      color: '#2196F3' 
    },
  ];

  const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Tools'];

  const getStockStatusColor = (status) => {
    const colors = {
      'in-stock': '#4CAF50',
      'low-stock': '#FFA726',
      'out-of-stock': '#F44336',
    };
    return colors[status] || '#757575';
  };

  const filteredInventory = dealerInventory.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || item.quantity === stockFilter; // Assuming quantity is the stock status
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddItem = async () => {
    setOpenAddDialog(true);
    setSelectedWholesaler('');
    setStockAmount('');
    setError(null);
    setLoadingWholesalers(true);
    try {
      const res = await axios.get('http://localhost:5005/api/admin/users-by-role?role=Wholesaler');
      setWholesalers(res.data.users || []);
    } catch (err) {
      setError('Failed to fetch wholesalers');
    } finally {
      setLoadingWholesalers(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedWholesaler('');
    setStockAmount('');
    setError(null);
  };

  const handleWholesalerSelect = async (e) => {
    const roleId = e.target.value;
    setSelectedWholesaler(roleId);
    setStockAmount('');
    setSelectedItem('');
    setWholesalerInventory([]);
    if (!roleId) return;
    setLoadingInventory(true);
    try {
      const res = await axios.get(`http://localhost:5005/api/inventory/${roleId}`);
      setWholesalerInventory(res.data || []);
    } catch (err) {
      setError('Failed to fetch wholesaler inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleItemSelect = (e) => {
    setSelectedItem(e.target.value);
    setStockAmount('');
  };

  const handleStockAmountChange = (e) => {
    setStockAmount(e.target.value);
  };

  const handleRequest = async () => {
    if (!selectedWholesaler || !selectedItem || !stockAmount) return;
    const wholesaler = wholesalers.find(w => w.roleId === selectedWholesaler);
    const item = wholesalerInventory.find(i => i._id === selectedItem);
    if (!item?.price || isNaN(Number(String(item.price).replace(/[^\d.]/g, '')))) {
      window.alert('This item does not have a valid price. Please contact the wholesaler.');
      return;
    }
    if (Number(stockAmount) > Number(item?.quantity)) {
      window.alert('The wholesaler you have selected does not have enough stock. Please try with a lower quantity.');
      return;
    }
    const payload = {
      dealerId: user.roleId,
      dealerEmail: user.email,
      wholesalerRoleId: wholesaler?.roleId,
      wholesalerEmail: wholesaler?.email,
      itemId: item?._id,
      itemName: item?.name,
      category: item?.category,
      requestedQty: Number(stockAmount),
      unit: item?.unit,
      status: 'requested',
      price: item?.price,
    };
    try {
      await axios.post('http://localhost:5005/api/inventory/dealer-requests', payload);
      // Refresh requests
      const res = await axios.get(`http://localhost:5005/api/inventory/dealer-requests/dealer/${user.roleId}`);
      setRequestedItems(res.data || []);
    } catch (err) {
      // Optionally handle error
    }
    setOpenAddDialog(false);
    setSelectedWholesaler('');
    setSelectedItem('');
    setStockAmount('');
    setWholesalerInventory([]);
  };

  // Handle price input change
  const handlePriceInputChange = (id, value) => {
    setPriceInputs(prev => ({ ...prev, [id]: value }));
  };

  // Handle save price
  const handleSavePrice = async (id) => {
    const newPrice = priceInputs[id];
    if (!newPrice) return;
    const item = requestedItems.find(i => i._id === id);
    if (!item) return;
    try {
      await axios.post('http://localhost:5005/api/inventory/dealer-stock', {
        dealerId: user.roleId,
        dealerEmail: user.email,
        itemName: item.itemName,
        category: item.category,
        quantity: item.requestedQty,
        unit: item.unit,
        price: newPrice,
        dealerRequestId: item._id
      });
      // Optionally update UI
      setRequestedItems(prev => prev.map(row => row._id === id ? { ...row, price: newPrice } : row));
    } catch (err) {
      window.alert('Failed to update price.');
    }
  };

  return (
    <div className="dealer-inventory-dashboard">
      <div className="dealer-inventory-header">
        <h1>{t('dealer.inventory', 'Inventory Management')}</h1>
        <p className="dealer-inventory-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="dealer-inventory-stats">
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Actions */}
      <div className="dealer-inventory-filters">
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder={t('dealer.searchInventory')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('dealer.category')}</InputLabel>
            <Select
              value={categoryFilter}
              label={t('dealer.category')}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">{t('dealer.allCategories')}</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('dealer.stockStatus')}</InputLabel>
            <Select
              value={stockFilter}
              label={t('dealer.stockStatus')}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="all">{t('dealer.allStatus')}</MenuItem>
              <MenuItem value="in-stock">{t('dealer.inStock')}</MenuItem>
              <MenuItem value="low-stock">{t('dealer.lowStock')}</MenuItem>
              <MenuItem value="out-of-stock">{t('dealer.outOfStock')}</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{ mb: 2 }}
          >
            {t('dealer.addItem')}
          </Button>
        </Box>
      </div>

      {/* Inventory Table - Only show accepted requests as inventory */}
      {requestedItems.length > 0 && (
        <table className="requested-items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Update Price</th>
            </tr>
          </thead>
          <tbody>
            {requestedItems.map((item) => (
              <tr key={item._id}>
                <td>{item.itemName}</td>
                <td>{item.category}</td>
                <td>{item.requestedQty}</td>
                <td>{item.unit}</td>
                <td>
                  <input
                    type="text"
                    value={priceInputs[item._id] || ''}
                    onChange={e => handlePriceInputChange(item._id, e.target.value)}
                    style={{ width: '80px', marginRight: '8px' }}
                  />
                  <button onClick={() => handleSavePrice(item._id)} style={{ padding: '2px 8px' }}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Requested Items Table */}
      {requestedItems.length > 0 && (
        <table className="requested-items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Wholesaler</th>
              <th>Requested Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requestedItems.map((req) => {
              const pricePerUnit = req.price ? Number(String(req.price).replace(/[^\d.]/g, '')) : 0;
              const total = pricePerUnit * Number(req.requestedQty);
              return (
                <tr key={req._id}>
                  <td>{req.itemName}</td>
                  <td>{req.category}</td>
                  <td>{req.wholesalerEmail} ({req.wholesalerRoleId})</td>
                  <td>{req.requestedQty} {req.unit}</td>
                  <td>{req.price || '-'}</td>
                  <td>₹{total.toLocaleString()}</td>
                  <td><span className={`requested-badge ${req.status}`}>{req.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Add Item Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Wholesaler & Stock Amount</DialogTitle>
        <DialogContent>
          {loadingWholesalers ? (
            <p>Loading wholesalers...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Wholesaler</InputLabel>
                <Select
                  value={selectedWholesaler}
                  label="Wholesaler"
                  onChange={handleWholesalerSelect}
                >
                  {wholesalers.map(w => (
                    <MenuItem key={w.roleId} value={w.roleId}>
                      {w.email} ({w.roleId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loadingInventory && <p>Loading inventory...</p>}
              {selectedWholesaler && !loadingInventory && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Item</InputLabel>
                  <Select
                    value={selectedItem}
                    label="Item"
                    onChange={handleItemSelect}
                  >
                    {wholesalerInventory.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name} ({item.category}) - {item.quantity} {item.unit} available
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {selectedItem && (
                <TextField
                  fullWidth
                  label="Required Quantity"
                  value={stockAmount}
                  onChange={handleStockAmountChange}
                  type="number"
                  sx={{ mb: 2 }}
                />
              )}
              {selectedItem && stockAmount && (() => {
                const item = wholesalerInventory.find(i => i._id === selectedItem);
                const pricePerUnit = item?.price || '-';
                const priceNum = item?.price ? Number(String(item.price).replace(/[^\d.]/g, '')) : 0;
                const total = priceNum * Number(stockAmount);
                return (
                  <div style={{marginTop: '0.5rem', fontWeight: 500}}>
                    Price per unit: {pricePerUnit}<br />
                    Total: ₹{total.toLocaleString()}
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRequest} disabled={!selectedWholesaler || !selectedItem || !stockAmount} variant="contained">Request</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;
