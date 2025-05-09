import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Award, Users, Sparkles, CheckCircle, User } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import InteractiveBackground from '../components/InteractiveBackground';
import { fetchTasks } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedTasks = async () => {
      try {
        const response = await fetchTasks();
        setFeaturedTasks(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured tasks:', error);
        setFeaturedTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedTasks();
  }, []);

  const getStartedLink = () => {
    if (!isAuthenticated) return '/register';
    return user?.role === 'student' ? '/student/dashboard' : '/startup/dashboard';
  };

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/startup/dashboard');
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'student') {
      navigate('/student/profile');
    } else {
      navigate('/startup/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <InteractiveBackground />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-sm font-medium text-purple-200 tracking-wide">
                  <span className="mr-2">✨</span> No Platform Fee
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-400 font-display tracking-tight">
                Real Work. Real Skills. Real Impact.
              </h1>
              <p className="text-xl text-purple-200/90 font-medium tracking-wide leading-relaxed">
                VoltWorx connects startups with top student talent — pay only for what impresses you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={isAuthenticated ? (user?.role === 'startup' ? '/startup/dashboard' : '/student/dashboard') : '/register'}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-purple-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-purple-500 border-2 border-purple-600 group-hover:bg-purple-600"></span>
                  <span className="relative">I'm a Startup</span>
                </Link>
                <Link
                  to={isAuthenticated ? (user?.role === 'student' ? '/student/dashboard' : '/startup/dashboard') : '/register'}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-purple-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 border-2 border-purple-400 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="relative">I'm a Student</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-3xl opacity-20"></div>
              <div className="relative bg-purple-800/20 backdrop-blur-md rounded-xl p-10 border border-purple-500/30 shadow-lg">
                <div className="flex items-center mb-6 relative">
                  <div className="h-12 w-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-300" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-2xl font-semibold text-white">Innovation Challenge</h3>
                    <p className="text-purple-200/80 text-sm">Submit by Dec 15, 2025</p>
                  </div>
                  <span className="ml-auto bg-blue-500/30 text-blue-300 text-xs px-2 py-0.5 rounded-full whitespace-nowrap absolute right-0 top-0 mt-2 mr-2 sm:static sm:mt-0 sm:mr-0 sm:ml-4 sm:relative sm:px-3 sm:py-1">
                    5 spots left
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="ml-3 text-purple-100/90 text-sm">Create a groundbreaking app prototype</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="ml-3 text-purple-100/90 text-sm">Win a mentorship session with industry leaders</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs">Innovation</span>
                    <span className="bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs">Prototype</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleJoinClick}
                      className="bg-purple-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      {!isAuthenticated ? 'Join Now' : user?.role === 'student' ? 'View Dashboard' : 'Post Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-400">How VoltWorx Works</h2>
            <p className="text-xl text-purple-200/90 font-medium tracking-wide leading-relaxed">
              Our platform connects startups and students in a simple, effective process that benefits both parties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Zap className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">1. Post Your Task</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Startups post tasks like logos, landing pages, and more.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Users className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">2. Students Submit Work</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Talented students submit their work for your review.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Award className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">3. Pick & Pay</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Choose the work you love and pay directly to the student.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-400">Key Features</h2>
            <p className="text-xl text-purple-200/90 font-medium tracking-wide leading-relaxed">
              Discover the unique features that make VoltWorx the perfect platform for students and startups.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Users className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">Zero Platform Fee</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Keep 100% of your earnings with no hidden charges.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Award className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">Built for Early-Stage Startups</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Perfect for startups looking for quality work at affordable rates.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <Sparkles className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">Students Get Paid + Build Portfolio</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed">
                Earn money while building your professional portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-400">Student Success Stories</h2>
            <p className="text-xl text-purple-200/90 font-medium tracking-wide leading-relaxed">
              Hear from our students about their transformative experiences with VoltWorx.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <User className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">John Doe</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed italic">
                "VoltWorx opened doors to real-world projects and boosted my confidence."
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <User className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">Jane Smith</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed italic">
                "The community and projects at VoltWorx have been invaluable to my growth."
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.02] hover:bg-white/10 group">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-all duration-300">
                <User className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-100 text-center group-hover:text-purple-200 transition-colors duration-300 font-display tracking-tight">Alex Johnson</h3>
              <p className="text-purple-200/90 text-center group-hover:text-purple-100 transition-colors duration-300 font-medium tracking-wide leading-relaxed italic">
                "I found my co-founder through VoltWorx's community hub."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white">Featured Projects</h2>
            <Link
              to={isAuthenticated ? (user?.role === 'student' ? '/student/dashboard' : '/startup/dashboard') : '/register'}
              className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : featuredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
              {featuredTasks.map((task: any) => (
                <div key={task._id} className="flex">
                  <TaskCard
                    task={task}
                    showJoinButton={isAuthenticated && user?.role === 'student'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-purple-100/80 mb-6">No projects available at the moment.</p>
              {isAuthenticated && user?.role === 'startup' && (
                <Link 
                  to="/startup/create-task" 
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-purple-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-purple-500 border-2 border-purple-600 group-hover:bg-purple-600"></span>
                  <span className="relative">Create Your First Project</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-400">Ready to Build the Future Together?</h2>
            <p className="text-xl mb-12 text-purple-200/90 font-medium tracking-wide leading-relaxed">
              Join SkillBridge today to start matching skills with opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to={isAuthenticated ? (user?.role === 'startup' ? '/startup/create-task' : '/student/dashboard') : '/register'}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-purple-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-purple-500 border-2 border-purple-600 group-hover:bg-purple-600"></span>
                <span className="relative">
                  {isAuthenticated
                    ? user?.role === 'startup'
                      ? 'Post a Project'
                      : 'Find Projects'
                    : 'Sign Up Now'}
                </span>
              </Link>
              <Link
                to="#how-it-works"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-purple-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 border-2 border-purple-400 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="relative">Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;