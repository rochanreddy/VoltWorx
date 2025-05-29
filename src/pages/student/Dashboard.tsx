import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Clock, CheckCircle2, User, Settings, Filter, Github } from 'lucide-react';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fetchTasks, joinTask, submitTask } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { hasUserJoinedTask, isPastDeadline } from '../../utils/helpers';
import { cn } from '../../utils/helpers';
import { SKILLS } from '../../utils/constants';

interface Task {
  _id: string;
  title: string;
  description: string;
  skillTags: string[];
  deadline: string;
  totalSlots: number;
  filledSlots: number;
  applicants: any[];
  submissions: any[];
}

function StudentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'joined' | 'completed'>('available');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joiningTaskId, setJoiningTaskId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [githubLink, setGithubLink] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTasks();
        setTasks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleJoinTask = async (taskId: string) => {
    try {
      setIsJoining(true);
      setJoiningTaskId(taskId);
      await joinTask(taskId);
      
      // Refetch tasks to update UI
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join task');
      console.error('Error joining task:', err);
    } finally {
      setIsJoining(false);
      setJoiningTaskId(null);
    }
  };

  const handleSubmitTask = async (taskId: string) => {
    if (!githubLink) {
      setError('Please provide a GitHub link');
      return;
    }

    try {
      setSubmittingTaskId(taskId);
      await submitTask(taskId, { link: githubLink });
      
      // Refetch tasks to update UI
      const response = await fetchTasks();
      setTasks(response.data);
      setGithubLink('');
      setSubmittingTaskId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit task');
      console.error('Error submitting task:', err);
    } finally {
      setSubmittingTaskId(null);
    }
  };

  // Filter tasks based on active tab and selected category
  const skillMatched = (task: Task) => user?.skills?.some((skill: string) => task.skillTags.includes(skill));
  const availableTasks = tasks.filter(
    task => 
      !isPastDeadline(task.deadline) && 
      task.filledSlots < task.totalSlots && 
      !hasUserJoinedTask(task, user?._id || '') &&
      (!selectedCategory || task.skillTags.includes(selectedCategory)) &&
      (showAll || skillMatched(task))
  );
  
  const joinedTasks = tasks.filter(
    task => 
      hasUserJoinedTask(task, user?._id || '') && 
      !isPastDeadline(task.deadline) &&
      (!selectedCategory || task.skillTags.includes(selectedCategory))
  );
  
  const completedTasks = tasks.filter(
    task => 
      hasUserJoinedTask(task, user?._id || '') && 
      isPastDeadline(task.deadline) &&
      (!selectedCategory || task.skillTags.includes(selectedCategory))
  );

  const displayedTasks = 
    activeTab === 'available' 
      ? availableTasks 
      : activeTab === 'joined' 
        ? joinedTasks 
        : completedTasks;

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="group relative mb-8">
        <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
        <div className="relative p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {user?.skills && user.skills.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-300">Your Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="text-xs text-gray-400 flex items-center">
                        +{user.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <Link
                to="/student/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>View Profile</span>
              </Link>
            </div>
          </div>

          {/* Note about checking email */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
             1. After the deadline of a task, check your email (including spam folder) within 24 hours to know if you've been selected.
            </p>
            <p className="text-sm text-blue-300">
             2. Contacting startups before the project deadline is strictly prohibited and may lead to disqualification or a permanent ban.
            </p>
          </div>

          {/* Category Filter and Show All/Matched Toggle */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="h-5 w-5 text-purple-300" />
              <span className="text-sm font-medium text-gray-300">Filter by Category:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full sm:w-auto px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {SKILLS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors whitespace-nowrap"
              >
                {showAll ? 'Show Matched Projects' : 'Show All Projects'}
              </button>
            </div>
            <span className="text-xs text-gray-400">{showAll ? 'Showing all available projects' : 'Showing projects matched to your skills'}</span>
          </div>

          <nav className="flex flex-wrap gap-4 mt-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('available')}
              className={cn(
                "py-2 px-1 inline-flex items-center border-b-2 font-medium text-sm",
                activeTab === 'available'
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              <Archive className="h-5 w-5 mr-2" />
              Available Projects
              {availableTasks.length > 0 && (
                <span className="ml-2 bg-purple-500/20 text-purple-300 py-0.5 px-2.5 rounded-full text-xs">
                  {availableTasks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={cn(
                "py-2 px-1 inline-flex items-center border-b-2 font-medium text-sm",
                activeTab === 'joined'
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              <Clock className="h-5 w-5 mr-2" />
              Active Projects
              {joinedTasks.length > 0 && (
                <span className="ml-2 bg-purple-500/20 text-purple-300 py-0.5 px-2.5 rounded-full text-xs">
                  {joinedTasks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                "py-2 px-1 inline-flex items-center border-b-2 font-medium text-sm",
                activeTab === 'completed'
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Completed Projects
              {completedTasks.length > 0 && (
                <span className="ml-2 bg-purple-500/20 text-purple-300 py-0.5 px-2.5 rounded-full text-xs">
                  {completedTasks.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="group relative mb-8">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-red-600/30 via-red-600/30 to-red-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-6 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Tasks grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : displayedTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayedTasks.map((task) => (
            <div key={task._id} className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
              <div className="relative p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl h-full flex flex-col">
                <TaskCard
                  task={task}
                  showJoinButton={activeTab === 'available'}
                  isJoined={hasUserJoinedTask(task, user?._id || '')}
                  onJoin={() => handleJoinTask(task._id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <div className="text-center py-8 md:py-16">
              <h3 className="text-lg font-medium text-white mb-2">
                {activeTab === 'available' ? 'No available projects found' :
                 activeTab === 'joined' ? 'You haven\'t joined any active projects yet' :
                 'You don\'t have any completed projects yet'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                {activeTab === 'available' ? 'Check back later for new opportunities or update your skills to find more matches' :
                 activeTab === 'joined' ? 'Browse available projects and join ones that match your skills' :
                 'Projects you\'ve completed will appear here'}
              </p>
              {activeTab !== 'available' && (
                <button
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Browse Available Projects
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;