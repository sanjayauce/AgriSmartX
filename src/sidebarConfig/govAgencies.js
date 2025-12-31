import { BarChart, Dashboard, Gavel, Grain, LocalShipping, Mail, Settings, Storage } from '@mui/icons-material';

export const govAgenciesSidebarItems = [
  { path: '/gov-agencies/overview', label: 'Overview', icon: <Dashboard /> },
  { path: '/gov-agencies/food-grain-flow', label: 'Food Grain Flow', icon: <Grain /> },
  { path: '/gov-agencies/storage', label: 'Storage', icon: <Storage /> },
  { path: '/gov-agencies/distribution', label: 'Distribution', icon: <LocalShipping /> },
  { path: '/gov-agencies/policy', label: 'Policy', icon: <Gavel /> },
  { path: '/gov-agencies/reports', label: 'Reports', icon: <BarChart /> },
  { path: '/gov-agencies/messages', label: 'Messages', icon: <Mail /> },
  { path: '/gov-agencies/settings', label: 'Settings', icon: <Settings /> },
]; 