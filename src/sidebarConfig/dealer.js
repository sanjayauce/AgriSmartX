// sidebarConfig/dealer.js

import { Dashboard, Inventory, Mail, Payment, ShoppingCart, Support } from '@mui/icons-material';

export const dealerSidebarItems = [
  { path: '/dealer/dashboard', label: 'dealer.dashboard', icon: <Dashboard /> },
  { path: '/dealer/orders', label: 'dealer.orders', icon: <ShoppingCart /> },
  { path: '/dealer/inventory', label: 'dealer.inventory', icon: <Inventory /> },
  { path: '/dealer/payments', label: 'dealer.payments', icon: <Payment /> },
  { path: '/dealer/messages', label: 'dealer.messages', icon: <Mail /> },
  { path: '/dealer/support', label: 'dealer.support', icon: <Support /> },
];
