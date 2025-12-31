import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AdminSidebar from './components/AdminSidebar';
import AgricultureExpertSidebar from './components/AgricultureExpertSidebar';
import BlankSidebar from './components/BlankSidebar';
import DealerSidebar from './components/DealerSidebar';
import FarmerSidebar from './components/FarmerSidebar';
import GovernmentAgenciesSidebar from './components/GovernmentAgenciesSidebar';
import HamburgerMenu from './components/HamburgerMenu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Login from './components/Login';
import NGOSidebar from './components/NGOSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ResourceProviders from './components/ResourceProviders';
import ResourceProviderSidebar from './components/ResourceProviderSidebar';
import RetailerSidebar from './components/RetailerSidebar';
import RoleBasedContent from './components/RoleBasedContent';
import WholesalerSidebar from './components/WholesalerSidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n'; // Import i18n configuration
import Logs from './pages/admin/Logs';
import AdminReports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages';
import CropHealth from './pages/CropHealth';
import Dashboard from './pages/Dashboard';
import DealerDashboard from './pages/dealer/Dashboard';
import Inventory from './pages/dealer/Inventory';
import Orders from './pages/dealer/Orders';
import Payments from './pages/dealer/Payments';
import Support from './pages/dealer/Support';
import Community from './pages/expert/Community';
import Consultations from './pages/expert/Consultations';
import ExpertDashboard from './pages/expert/Dashboard';
import Knowledge from './pages/expert/Knowledge';
import Research from './pages/expert/Research';
import GovAgencyDistribution from './pages/gov-agencies/Distribution';
import GovAgencyFoodGrainFlow from './pages/gov-agencies/FoodGrainFlow';
import GovAgencyMessages from './pages/gov-agencies/Messages';
import GovAgencyPolicy from './pages/gov-agencies/Policy';
import GovAgencyReports from './pages/gov-agencies/Reports';
import GovAgencySettings from './pages/gov-agencies/Settings';
import GovAgencyStorage from './pages/gov-agencies/Storage';
import GovernmentAgencies from './pages/GovernmentAgencies';
import GovernmentAgenciesDashboard from './pages/GovernmentAgenciesDashboard';
import GovtOverview from './pages/govt/Overview';
import HistoryPage from './pages/HistoryPage';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import UserReports from './pages/Reports';
import ResourceProviderDashboard from './pages/ResourceProviderDashboard';
import RetailerCustomers from './pages/retailer/Customers';
import RetailerDashboard from './pages/retailer/Dashboard';
import RetailerOrders from './pages/retailer/Orders';
import RetailerProducts from './pages/retailer/Products';
import RetailerSupport from './pages/retailer/Support';
import Analytics from './pages/wholesaler/Analytics';
import WholesalerDashboard from './pages/wholesaler/Dashboard';
import WholesalerInventory from './pages/wholesaler/Inventory';
import Transactions from './pages/wholesaler/Transactions';

const getRoleBasedDashboardPath = (role) => {
  switch (role) {
    case 'Farmer':
      return '/farmer/dashboard';
    case 'Resource Provider':
      return '/provider/dashboard';
    case 'Government Agencies':
    case 'Government Agency':
      return '/gov-agencies/overview';
    case 'Admin':
      return '/admin/dashboard';
    case 'Dealer':
      return '/dealer/dashboard';
    case 'Agriculture Expert':
      return '/expert/dashboard';
    case 'Wholesaler':
      return '/wholesaler/dashboard';
    case 'Retailer':
      return '/retailer/dashboard';
    case 'NGOs':
      return '/ngo/dashboard';
    default:
      return '/dashboard';
  }
};

const AppContent = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && isSidebarOpen) {
        const sidebar = document.querySelector('.resource-provider-sidebar, .sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        if (sidebar && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Updated PostLoginRedirect component with better role handling
  const PostLoginRedirect = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
      if (user) {
        // Get the dashboard path based on user role
        const dashboardPath = getRoleBasedDashboardPath(user.role);
        
        // Check if we're already on a role-specific path
        const currentPath = window.location.pathname;
        const roleSpecificPaths = [
          '/farmer',
          '/provider',
          '/gov-agencies',
          '/admin',
          '/dealer',
          '/expert',
          '/wholesaler',
          '/retailer',
          '/ngo'
        ];

        // Only redirect if we're not already on a role-specific path
        const isOnRoleSpecificPath = roleSpecificPaths.some(path => currentPath.startsWith(path));
        if (!isOnRoleSpecificPath) {
        navigate(dashboardPath, { replace: true });
        }
      }
    }, [user, navigate]);

    return null; 
  };

  const renderSidebar = () => {
    if (!user) return null;
    
    const sidebarProps = {
      isOpen: isSidebarOpen,
      onToggle: toggleSidebar
    };

    switch (user.role) {
      case 'Farmer':
        return <FarmerSidebar {...sidebarProps} />;
      case 'Resource Provider':
        return <ResourceProviderSidebar {...sidebarProps} />;
      case 'Government Agencies':
      case 'Government Agency':
        return <GovernmentAgenciesSidebar {...sidebarProps} />;
      case 'Admin':
        return <AdminSidebar {...sidebarProps} />;
      case 'Dealer':
        return <DealerSidebar {...sidebarProps} />;
      case 'Agriculture Expert':
        return <AgricultureExpertSidebar {...sidebarProps} />;
      case 'Wholesaler':
        return <WholesalerSidebar {...sidebarProps} />;
      case 'Retailer':
        return <RetailerSidebar {...sidebarProps} />;
      case 'NGOs':
        return <NGOSidebar {...sidebarProps} />;
      default:
        return <BlankSidebar {...sidebarProps} />;
    }
  };

  const getMainClassName = () => {
    if (!user) return '';
    return 'main-with-sidebar';
  };

  // Updated dashboard rendering logic
  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Farmer':
        return <RoleBasedContent><Dashboard /></RoleBasedContent>;
      case 'Resource Provider':
        return <ResourceProviderDashboard />;
      case 'Government Agencies':
      case 'Government Agency':
        return <GovernmentAgenciesDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'Dealer':
        return <DealerDashboard />;
      default:
        return <div style={{ padding: '2rem' }}>Dashboard not available for this role.</div>;
    }
  };

  return (
    <div className="app">
      <LanguageSwitcher />
      {user && <HamburgerMenu isOpen={isSidebarOpen} onToggle={toggleSidebar} />}
      {renderSidebar()}
      <main className={getMainClassName()}>
        <Routes>
          <Route path="/" element={user ? <PostLoginRedirect /> : <Login />} />
          <Route path="/login" element={user ? <PostLoginRedirect /> : <Login />} />
          
          {/* Add a catch-all route for role-specific paths */}
          <Route path="/:role/*" element={
            <ProtectedRoute>
              <PostLoginRedirect />
            </ProtectedRoute>
          } />
          
          {/* Common routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {renderDashboard()}
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <RoleBasedContent>
                <Profile />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/logs" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Logs />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/messages" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminMessages />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <RoleBasedContent>
                <UserReports />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <RoleBasedContent>
                <HistoryPage />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          
          <Route path="/resource-providers" element={<ResourceProviders />} />
          
          <Route path="/government-agencies" element={
            <ProtectedRoute>
              <RoleBasedContent>
                <GovernmentAgencies />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          
          <Route path="/gov-agencies/overview" element={
            <ProtectedRoute allowedRoles={['Government Agencies', 'Government Agency']}>
              <GovtOverview />
            </ProtectedRoute>
          } />
          <Route path="/gov-agencies/food-grain-flow" element={<ProtectedRoute><GovAgencyFoodGrainFlow /></ProtectedRoute>} />
          <Route path="/gov-agencies/storage" element={<ProtectedRoute><GovAgencyStorage /></ProtectedRoute>} />
          <Route path="/gov-agencies/distribution" element={<ProtectedRoute><GovAgencyDistribution /></ProtectedRoute>} />
          <Route path="/gov-agencies/policy" element={<ProtectedRoute><GovAgencyPolicy /></ProtectedRoute>} />
          <Route path="/gov-agencies/reports" element={<ProtectedRoute><GovAgencyReports /></ProtectedRoute>} />
          <Route path="/gov-agencies/messages" element={<ProtectedRoute allowedRoles={['Government Agencies', 'Government Agency']}><GovAgencyMessages /></ProtectedRoute>} />
          <Route path="/gov-agencies/settings" element={<ProtectedRoute allowedRoles={['Government Agencies', 'Government Agency']}><GovAgencySettings /></ProtectedRoute>} />

          {/* Dealer routes */}
          <Route path="/dealer/dashboard" element={<ProtectedRoute allowedRoles={['Dealer']}><DealerDashboard /></ProtectedRoute>} />
          <Route path="/dealer/orders" element={<ProtectedRoute allowedRoles={['Dealer']}><Orders /></ProtectedRoute>} />
          <Route path="/dealer/inventory" element={<ProtectedRoute allowedRoles={['Dealer']}><Inventory /></ProtectedRoute>} />
          <Route path="/dealer/payments" element={<ProtectedRoute allowedRoles={['Dealer']}><Payments /></ProtectedRoute>} />
          <Route path="/dealer/support" element={
            <ProtectedRoute allowedRoles={['Dealer']}>
              <Support />
            </ProtectedRoute>
          } />

          {/* Agriculture Expert routes */}
          <Route path="/expert/dashboard" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><ExpertDashboard /></ProtectedRoute>} />
          <Route path="/expert/consultations" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><Consultations /></ProtectedRoute>} />
          <Route path="/expert/research" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><Research /></ProtectedRoute>} />
          <Route path="/expert/knowledge" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><Knowledge /></ProtectedRoute>} />
          <Route path="/expert/community" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><Community /></ProtectedRoute>} />

          {/* NGO routes */}
          <Route path="/ngo/dashboard" element={<ProtectedRoute allowedRoles={['NGOs']}><div>NGO Dashboard Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/ngo/projects" element={<ProtectedRoute allowedRoles={['NGOs']}><div>NGO Projects Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/ngo/beneficiaries" element={<ProtectedRoute allowedRoles={['NGOs']}><div>NGO Beneficiaries Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/ngo/volunteers" element={<ProtectedRoute allowedRoles={['NGOs']}><div>NGO Volunteers Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/ngo/reports" element={<ProtectedRoute allowedRoles={['NGOs']}><div>NGO Reports Page (Coming Soon)</div></ProtectedRoute>} />

          {/* Resource Provider routes */}
          <Route path="/provider/dashboard" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Dashboard Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/profile" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Profile Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/equipment" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Equipment Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/seeds-fertilizers" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Seeds & Fertilizers Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/pesticides" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Pesticides Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/livestock-feed" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Livestock Feed Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/irrigation" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Irrigation Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/precision-farming" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Precision Farming Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/cold-storage" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Post-Harvest & Storage Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/logistics" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Logistics Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/financial" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Financial Institutions Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/government" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Government & Research Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/provider/training" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Resource Provider Training & Advisory Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute allowedRoles={['Resource Provider']}><div>Blogs Page (Coming Soon)</div></ProtectedRoute>} />

          {/* Retailer routes */}
          <Route path="/retailer/dashboard" element={<ProtectedRoute allowedRoles={['Retailer']}><RetailerDashboard /></ProtectedRoute>} />
          <Route path="/retailer/orders" element={
            <ProtectedRoute allowedRoles={['Retailer']}>
              <RetailerOrders />
            </ProtectedRoute>
          } />
          <Route path="/retailer/products" element={
            <ProtectedRoute allowedRoles={['Retailer']}>
              <RetailerProducts />
            </ProtectedRoute>
          } />
          <Route path="/retailer/customers" element={
            <ProtectedRoute allowedRoles={['Retailer']}>
              <RetailerCustomers />
            </ProtectedRoute>
          } />
          <Route path="/retailer/support" element={
            <ProtectedRoute allowedRoles={['Retailer']}>
              <RetailerSupport />
            </ProtectedRoute>
          } />
          <Route path="/retailer/messages" element={
            <ProtectedRoute allowedRoles={['Retailer']}>
              <Messages />
            </ProtectedRoute>
          } />

          {/* Wholesaler routes */}
          <Route path="/wholesaler/dashboard" element={<ProtectedRoute allowedRoles={['Wholesaler']}><WholesalerDashboard /></ProtectedRoute>} />
          <Route path="/wholesaler/inventory" element={<ProtectedRoute allowedRoles={['Wholesaler']}><WholesalerInventory /></ProtectedRoute>} />
          <Route path="/wholesaler/transactions" element={<ProtectedRoute allowedRoles={['Wholesaler']}><Transactions /></ProtectedRoute>} />
          <Route path="/wholesaler/analytics" element={<ProtectedRoute allowedRoles={['Wholesaler']}><Analytics /></ProtectedRoute>} />

          {/* Role-specific Messages routes */}
          <Route path="/farmer/messages" element={<ProtectedRoute allowedRoles={['Farmer']}><Messages /></ProtectedRoute>} />
          <Route path="/provider/messages" element={<ProtectedRoute allowedRoles={['Resource Provider']}><Messages /></ProtectedRoute>} />
          <Route path="/gov-agencies/messages" element={<ProtectedRoute allowedRoles={['Government Agencies', 'Government Agency']}><Messages /></ProtectedRoute>} />
          <Route path="/dealer/messages" element={<ProtectedRoute allowedRoles={['Dealer']}><Messages /></ProtectedRoute>} />
          <Route path="/expert/messages" element={<ProtectedRoute allowedRoles={['Agriculture Expert']}><Messages /></ProtectedRoute>} />
          <Route path="/wholesaler/messages" element={<ProtectedRoute allowedRoles={['Wholesaler']}><Messages /></ProtectedRoute>} />
          <Route path="/ngo/messages" element={<ProtectedRoute allowedRoles={['NGOs']}><Messages /></ProtectedRoute>} />
          <Route path="/retailer/messages" element={<ProtectedRoute allowedRoles={['Retailer']}><Messages /></ProtectedRoute>} />


          {/* Routes that might still use the generic /messages if not linked from sidebars */}
          {/* Depending on your application flow, you might want to remove or redirect this */}
           <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          {/* Added Farmer specific routes */}
          <Route path="/farmer/profile" element={
            <ProtectedRoute allowedRoles={['Farmer']}>
              <RoleBasedContent>
                <Profile />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          <Route path="/farmer/dashboard" element={
            <ProtectedRoute allowedRoles={['Farmer']}>
              <RoleBasedContent>
                <Dashboard />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
           <Route path="/farmer/reports" element={
            <ProtectedRoute allowedRoles={['Farmer']}>
              <RoleBasedContent>
                <UserReports />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
           <Route path="/farmer/history" element={
            <ProtectedRoute allowedRoles={['Farmer']}>
              <RoleBasedContent>
                <HistoryPage />
              </RoleBasedContent>
            </ProtectedRoute>
          } />
          <Route path="/farmer/crop-health" element={
            <ProtectedRoute allowedRoles={['Farmer']}>
              <RoleBasedContent>
                <CropHealth />
              </RoleBasedContent>
            </ProtectedRoute>
          } />

        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App; 