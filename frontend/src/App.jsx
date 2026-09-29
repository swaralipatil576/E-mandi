import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import FarmerLayout from './layouts/FarmerLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import RegisterProducePage from './pages/RegisterProducePage';
import ReviewSubmitPage from './pages/ReviewSubmitPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import MyLotsPage from './pages/MyLotsPage';
import LotDetailPage from './pages/LotDetailPage';
import MarketPricesPage from './pages/MarketPricesPage';
import MyProducePage from './pages/MyProducePage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import InventoryPage from './pages/InventoryPage';
import ResourcesPage from './pages/ResourcesPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
          </Route>

          {/* Protected Routes (Farmer Dashboard) */}
          <Route element={<ProtectedRoute><FarmerLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/register-produce" element={<RegisterProducePage />} />
            <Route path="/register-produce/review" element={<ReviewSubmitPage />} />
            <Route path="/register-produce/success" element={<RegistrationSuccessPage />} />
            <Route path="/lots" element={<MyLotsPage />} />
            <Route path="/lots/:lotId" element={<LotDetailPage />} />
            <Route path="/market-prices" element={<MarketPricesPage />} />
            <Route path="/my-produce" element={<MyProducePage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
