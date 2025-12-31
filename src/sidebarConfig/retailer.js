import { Dashboard, Group, Mail, ShoppingCart, Store, Support } from '@mui/icons-material';

export const retailerSidebarItems = [
  { path: '/retailer/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/retailer/orders', label: 'Orders', icon: <ShoppingCart /> },
  { path: '/retailer/products', label: 'Products', icon: <Store /> },
  { path: '/retailer/customers', label: 'Customers', icon: <Group /> },
  { path: '/retailer/support', label: 'Support', icon: <Support /> },
  { path: '/retailer/messages', label: 'Messages', icon: <Mail /> },
]; 