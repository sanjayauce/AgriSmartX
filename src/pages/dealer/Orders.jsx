import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/dealer-requests/dealer/${user.roleId}`);
        setOrders(res.data || []);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="dealer-orders-dashboard">
      <div className="dealer-orders-header">
        <h1>{t('dealer.orders')}</h1>
        <p className="dealer-orders-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      {/* Orders Table */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <TableContainer component={Paper} className="dealer-orders-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Wholesaler</TableCell>
                <TableCell>Requested Qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const pricePerUnit = order.price ? Number(String(order.price).replace(/[^\d.]/g, '')) : 0;
                const total = pricePerUnit * Number(order.requestedQty);
                return (
                  <TableRow key={order._id}>
                    <TableCell>{order.itemName}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.wholesalerEmail} ({order.wholesalerRoleId})</TableCell>
                    <TableCell>{order.requestedQty} {order.unit}</TableCell>
                    <TableCell>{order.price || '-'}</TableCell>
                    <TableCell>₹{total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        style={{
                          backgroundColor:
                            order.status === 'accepted' ? '#4CAF50' :
                            order.status === 'rejected' ? '#F44336' : '#FFA726',
                          color: 'white',
                          fontWeight: 600
                        }}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Orders;
