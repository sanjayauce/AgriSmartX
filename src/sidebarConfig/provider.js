import { AccountBalance, AcUnit, Agriculture, Dashboard, Grass, LocalPharmacy, LocalShipping, Mail, Person, PrecisionManufacturing, School, Science, WaterDrop } from '@mui/icons-material';

export const providerSidebarItems = [
  { path: '/provider/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/provider/profile', label: 'Profile', icon: <Person /> },
  { path: '/provider/equipment', label: 'Equipment', icon: <Agriculture /> },
  { path: '/provider/seeds-fertilizers', label: 'Seeds & Fertilizers', icon: <Grass /> },
  { path: '/provider/pesticides', label: 'Pesticides', icon: <LocalPharmacy /> },
  { path: '/provider/livestock-feed', label: 'Livestock Feed', icon: <Grass /> },
  { path: '/provider/irrigation', label: 'Irrigation', icon: <WaterDrop /> },
  { path: '/provider/precision-farming', label: 'Precision Farming', icon: <PrecisionManufacturing /> },
  { path: '/provider/cold-storage', label: 'Cold Storage', icon: <AcUnit /> },
  { path: '/provider/logistics', label: 'Logistics', icon: <LocalShipping /> },
  { path: '/provider/financial', label: 'Financial', icon: <AccountBalance /> },
  { path: '/provider/government', label: 'Government', icon: <Science /> },
  { path: '/provider/training', label: 'Training', icon: <School /> },
  { path: '/provider/messages', label: 'Messages', icon: <Mail /> },
]; 