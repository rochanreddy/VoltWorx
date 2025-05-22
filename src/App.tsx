import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Lazy-loaded components
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StartupDashboard = lazy(() => import('./pages/startup/Dashboard'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));
const CreateTask = lazy(() => import('./pages/startup/CreateTask'));
const Community = lazy(() => import('./pages/Community'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const StudentCodeOfConduct = lazy(() => import('./pages/StudentCodeOfConduct'));
const StartupGuidelines = lazy(() => import('./pages/StartupGuidelines'));

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="student-code-of-conduct" element={<StudentCodeOfConduct />} />
          <Route path="startup-guidelines" element={<StartupGuidelines />} />
          
          {/* Student routes */}
          <Route
            path="student/dashboard"
            element={
              <ProtectedRoute userType="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/profile"
            element={
              <ProtectedRoute userType="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Startup routes */}
          <Route
            path="startup/dashboard"
            element={
              <ProtectedRoute userType="startup">
                <StartupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="startup/create-task"
            element={
              <ProtectedRoute userType="startup">
                <CreateTask />
              </ProtectedRoute>
            }
          />
          
          {/* Shared routes */}
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          <Route path="community" element={<Community />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;