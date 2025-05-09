import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase as BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../utils/helpers';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'startup'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, setUser } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await login(email, password, role);
      navigate(role === 'student' ? '/student/dashboard' : '/startup/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = async (credentialResponse: any) => {
    setGoogleError(null);
    setGoogleLoading(true);
    try {
      if (!credentialResponse.credential) {
        setGoogleError('No credential received from Google.');
        setGoogleLoading(false);
        return;
      }
      // Log for debugging
      console.log('Google credential received:', credentialResponse.credential);
      // Send credential to backend
      const payload = { 
        credential: credentialResponse.credential,
        role: role // Send the selected role to the backend
      };
      console.log('Sending payload to backend:', payload);
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data: any = {};
      let rawText = '';
      try {
        rawText = await response.clone().text();
        data = JSON.parse(rawText);
      } catch (e) {
        data = {};
      }
      console.log('Backend response status:', response.status);
      console.log('Backend response body:', data);
      
      if (response.status === 404) {
        // User needs to register first
        setGoogleError('No account found. Please register first.');
        // Store the email and role for registration
        if (data.email) {
          localStorage.setItem('googleEmail', data.email);
          localStorage.setItem('googleRegistrationRole', role);
          // Redirect to register page
          navigate('/register');
        }
        setGoogleLoading(false);
        return;
      }
      
      if (!response.ok) {
        // Log the full error object and raw text
        console.error('Google login error (full object):', data);
        console.error('Google login error (raw text):', rawText);
        setGoogleError(
          data.message ||
          rawText ||
          `Google login failed (status ${response.status})`
        );
        setGoogleLoading(false);
        return;
      }

      // Verify that the user's role matches the selected role
      if (data.user?.role !== role) {
        setGoogleError(`This email is registered as a ${data.user?.role}. Please select the correct role.`);
        setGoogleLoading(false);
        return;
      }

      // Store token/session as needed (example: JWT)
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored in localStorage:', data.token);
      } else {
        setGoogleError('No token received from backend.');
        console.error('No token in backend response:', data);
        setGoogleLoading(false);
        return;
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User stored in localStorage:', data.user);
        // Update auth context
        setUser(data.user);
      } else {
        setGoogleError('No user info received from backend.');
        console.error('No user in backend response:', data);
        setGoogleLoading(false);
        return;
      }
      // Redirect to dashboard (role-based if available)
      if (data.user?.role === 'startup') {
        console.log('Redirecting to /startup/dashboard');
        navigate('/startup/dashboard');
      } else {
        console.log('Redirecting to /student/dashboard');
        navigate('/student/dashboard');
      }
    } catch (err) {
      setGoogleError('Google login failed. Please try again.');
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={cn(
                    'py-2 px-4 border rounded-lg flex justify-center items-center transition-all duration-200',
                    role === 'student'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  )}
                  onClick={() => setRole('student')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Student
                </button>
                <button
                  type="button"
                  className={cn(
                    'py-2 px-4 border rounded-lg flex justify-center items-center transition-all duration-200',
                    role === 'startup'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  )}
                  onClick={() => setRole('startup')}
                >
                  <BriefcaseBusiness className="h-5 w-5 mr-2" />
                  Startup
                </button>
              </div>
            </div>

            {/* Google Auth Button */}
            <div className="mb-6 relative">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setGoogleError('Google Sign In was unsuccessful. Try again later');
                }}
                width="100%"
                theme="filled_black"
                text="continue_with"
                shape="pill"
                useOneTap
              />
              {googleLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg z-10">
                  <div className="text-purple-300">Signing in with Google...</div>
                </div>
              )}
              {googleError && (
                <div className="mt-2 text-center text-red-400">{googleError}</div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="small" className="mr-2" />
                  ) : null}
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;