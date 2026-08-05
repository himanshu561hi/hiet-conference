import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts & Guards
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

// Utilities
import { PageTransition } from './utils/PageTransition';

// Pages
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { TracksPage } from './pages/TracksPage';
import { TimelinePage } from './pages/TimelinePage';
import { ContactPage } from './pages/ContactPage';
import { Register } from './pages/Register';
import { Signup } from './pages/auth/Signup';
import { Login } from './pages/auth/Login';
import { AdminLogin } from './pages/auth/AdminLogin';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { InitializeProfile } from './pages/profile/InitializeProfile';
// Dashboard & Admin Pages
import { TeamDashboard } from './pages/dashboard/TeamDashboard';
import { CreateTeam } from './pages/dashboard/CreateTeam';
import { MemberDashboard } from './pages/dashboard/MemberDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRegistrationReview } from './pages/admin/AdminRegistrationReview';
import { AdminAnalyticsDashboard } from './pages/admin/AdminAnalyticsDashboard';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminReports } from './pages/admin/AdminReports';


function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Routes>
          {/* Public Website Routes (Multi-Page Architecture) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/tracks" element={<PageTransition><TracksPage /></PageTransition>} />
            <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/register" element={<Register />} />
          </Route>


          {/* Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/auth/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route path="/auth/verify" element={<PageTransition><VerifyEmail /></PageTransition>} />
            <Route path="/auth/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PublicLayout />}>
            <Route 
              path="/profile/initialize" 
              element={
                <ProtectedRoute>
                  <PageTransition><InitializeProfile /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <PageTransition><TeamDashboard /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/member" 
              element={
                <ProtectedRoute>
                  <PageTransition><MemberDashboard /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/team/create" 
              element={
                <ProtectedRoute>
                  <PageTransition><CreateTeam /></PageTransition>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PageTransition><AdminDashboard /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/queue" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PageTransition><AdminDashboard /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PageTransition><AdminSettings /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PageTransition><AdminReports /></PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/registration/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PageTransition><AdminRegistrationReview /></PageTransition>
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;