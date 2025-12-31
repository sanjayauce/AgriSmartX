import { Dashboard, Forum, Hub, Mail, School, Science } from '@mui/icons-material';

export const expertSidebarItems = [
  { path: '/expert/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/expert/consultations', label: 'Consultations', icon: <School /> },
  { path: '/expert/research', label: 'Research', icon: <Science /> },
  { path: '/expert/knowledge', label: 'Knowledge', icon: <Hub /> },
  { path: '/expert/community', label: 'Community', icon: <Forum /> },
  { path: '/expert/messages', label: 'Messages', icon: <Mail /> },
]; 