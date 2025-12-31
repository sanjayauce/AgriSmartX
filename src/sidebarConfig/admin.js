import { BarChart, Dashboard, ListAlt, Mail, People, Settings } from '@mui/icons-material';

export const adminSidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/admin/users', label: 'Users', icon: <People /> },
  { path: '/admin/messages', label: 'Messages', icon: <Mail /> },
  { path: '/admin/logs', label: 'Logs', icon: <ListAlt /> },
  { path: '/admin/reports', label: 'Reports', icon: <BarChart /> },
  { path: '/admin/settings', label: 'Settings', icon: <Settings /> },
]; 