import { Assessment, Dashboard, Inventory, Mail, Receipt } from '@mui/icons-material';

export const wholesalerSidebarItems = [
  { path: '/wholesaler/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/wholesaler/inventory', label: 'Inventory', icon: <Inventory /> },
  { path: '/wholesaler/transactions', label: 'Transactions', icon: <Receipt /> },
  { path: '/wholesaler/analytics', label: 'Analytics', icon: <Assessment /> },
  { path: '/wholesaler/messages', label: 'Messages', icon: <Mail /> },
]; 