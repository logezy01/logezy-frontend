import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import BottomNav from './components/common/BottomNav';
import CompareBar from './components/common/CompareBar';
import ChatBot from './components/common/ChatBot';
import NotFound from './pages/NotFound';

// Lazy loading — chaque page est chargée seulement quand nécessaire
const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Settings = lazy(() => import('./pages/Settings'));
const Compare = lazy(() => import('./pages/Compare'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));
const GoogleComplete = lazy(() => import('./pages/auth/GoogleComplete'));
const DashboardOwner = lazy(() => import('./pages/dashboard/DashboardOwner'));
const DashboardAgent = lazy(() => import('./pages/dashboard/DashboardAgent'));
const DashboardTenant = lazy(() => import('./pages/dashboard/DashboardTenant'));
const DashboardAdmin = lazy(() => import('./pages/dashboard/DashboardAdmin'));
const DashboardCommercial = lazy(() => import('./pages/dashboard/DashboardCommercial'));
const Agencies = lazy(() => import('./pages/Agencies'));
const AgencyDetail = lazy(() => import('./pages/AgencyDetail'));

// Composant de chargement pendant le lazy loading
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080B14]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#EBF5ED] border-t-[#3A7D44] rounded-full animate-spin" />
        <p className="text-sm text-[#94A3B8] font-medium">Chargement...</p>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annonces" element={<Listings />} />
        <Route path="/annonces/:id" element={<ListingDetail />} />
        <Route path="/confidentialite" element={<Privacy />} />
        <Route path="/conditions" element={<Terms />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/comparer" element={<Compare />} />
        <Route path="/comment-ca-marche" element={<HowItWorks />} />
        <Route path="/parametres" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />
        <Route path="/agences" element={<Agencies />} />
        <Route path="/agences/:id" element={<AgencyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/complete" element={<GoogleComplete />} />
        <Route path="/dashboard/proprietaire/*" element={
          <ProtectedRoute roles={['proprietaire']}><DashboardOwner /></ProtectedRoute>
        } />
        <Route path="/dashboard/agent/*" element={
          <ProtectedRoute roles={['agent']}><DashboardAgent /></ProtectedRoute>
        } />
        <Route path="/dashboard/locataire/*" element={
          <ProtectedRoute roles={['locataire']}><DashboardTenant /></ProtectedRoute>
        } />
        <Route path="/dashboard/admin/*" element={
          <ProtectedRoute roles={['admin']}><DashboardAdmin /></ProtectedRoute>
        } />
        <Route path="/dashboard/commercial/*" element={
          <ProtectedRoute roles={['commercial']}><DashboardCommercial /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
      <BottomNav />
      <CompareBar />
      <ChatBot />
    </Suspense>
  );
}