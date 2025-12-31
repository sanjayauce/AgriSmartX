import React from 'react';
import { useTranslation } from 'react-i18next';
import './DealerDashboard.css';

const DealerDashboard = () => {
  const { t } = useTranslation();
  const dealerStats = [
    { label: t('dealer.pendingOrdersCount'), value: 8, icon: '📦' },
    { label: t('dealer.inventoryItemsCount'), value: 120, icon: '📊' },
    { label: t('dealer.pendingPaymentsCount'), value: 3, icon: '💰' },
  ];
  const recentOrders = [
    { id: 'ORD-1001', date: '2024-06-01', status: t('dealer.pending'), amount: '₹12,000' },
    { id: 'ORD-1000', date: '2024-05-28', status: t('dealer.completed'), amount: '₹8,500' },
    { id: 'ORD-0999', date: '2024-05-25', status: t('dealer.shipped'), amount: '₹15,200' },
  ];
  return (
    <div className="dealer-dashboard-container">
      <div className="dealer-welcome-card">
        <h1>{t('dealer.welcomeTitle')}</h1>
        <p>{t('dealer.dealerDashboardWelcome')}</p>
      </div>
      <div className="dealer-stats-grid">
        {dealerStats.map(stat => (
          <div className="dealer-stat-card" key={stat.label}>
            <span className="dealer-stat-icon">{stat.icon}</span>
            <div>
              <div className="dealer-stat-value">{stat.value}</div>
              <div className="dealer-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dealer-main-content">
        <div className="dealer-recent-orders">
          <h2>{t('dealer.recentOrdersTitle')}</h2>
          <table className="dealer-orders-table">
            <thead>
              <tr>
                <th>{t('dealer.orderTable.orderId')}</th>
                <th>{t('dealer.orderTable.date')}</th>
                <th>{t('dealer.orderTable.status')}</th>
                <th>{t('dealer.orderTable.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dealer-inventory-overview">
          <h2>{t('dealer.inventoryTitle')}</h2>
          <ul>
            <li>{t('dealer.inventoryItems.wheat')}: 40 {t('dealer.inventoryItems.units')}</li>
            <li>{t('dealer.inventoryItems.rice')}: 30 {t('dealer.inventoryItems.units')}</li>
            <li>{t('dealer.inventoryItems.maize')}: 20 {t('dealer.inventoryItems.units')}</li>
            <li>{t('dealer.inventoryItems.soybean')}: 15 {t('dealer.inventoryItems.units')}</li>
          </ul>
        </div>
      </div>
      <div className="dealer-quick-actions-support">
        <div className="dealer-quick-actions">
          <h3>{t('dealer.quickActions')}</h3>
          <button className="dealer-action-btn">{t('dealer.addItem')}</button>
          <button className="dealer-action-btn">{t('dealer.inventory')}</button>
          <button className="dealer-action-btn">{t('dealer.payments')}</button>
        </div>
        <div className="dealer-support-info">
          <h3>{t('dealer.support')}</h3>
          <p>{t('dealer.dealerSupportText')}</p>
          <a href="mailto:support@agrihelp.com" className="dealer-support-link">support@agrihelp.com</a>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard; 