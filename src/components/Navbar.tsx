import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Briefcase as BriefcaseBusiness, Lightbulb, ChevronDown, Home, Users, LayoutDashboard, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user?.role === 'student') {
      navigate('/student/profile');
    } else if (user?.role === 'startup') {
      navigate('/startup/dashboard');
    }
  };
  
  const isStudent = user?.role === 'student';
  const isStartup = user?.role === 'startup';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Users },
    { name: 'Community', path: '/community', icon: Users },
  ];

  const dashboardItems = isStudent ? [
    { name: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard }
  ] : isStartup ? [
    { name: 'Startup Dashboard', path: '/startup/dashboard', icon: LayoutDashboard },
    { name: 'Create Task', path: '/startup/create-task', icon: BriefcaseBusiness }
  ] : [];
  
  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img src="/sample_2-removebg-preview.png" alt="VoltWorx Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">
                VoltWorx
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Dashboard dropdown */}
                <div className="relative group">
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg transition-colors">
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {dashboardItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-purple-300 hover:bg-gray-700/50"
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User menu */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center hover:bg-gray-800/50 rounded-lg transition-colors p-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      {isStudent ? (
                        <User className="h-4 w-4 text-purple-300" />
                      ) : (
                        <BriefcaseBusiness className="h-4 w-4 text-purple-300" />
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-300">
                      {user?.name}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {dashboardItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4 pb-3">
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    {isStudent ? (
                      <User className="h-4 w-4 text-purple-300" />
                    ) : (
                      <BriefcaseBusiness className="h-4 w-4 text-purple-300" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-300">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-400">{user?.role}</div>
                  </div>
                </button>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="border-t border-white/10 pt-4 pb-3">
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-400 mb-3">Account</div>
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-4 py-2.5 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-gray-800/50 rounded-lg border border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center w-full px-4 py-2.5 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;