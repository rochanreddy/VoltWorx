import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Archive, Clock, CheckCircle2 } from 'lucide-react';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fetchTasks, deleteTask } from '../../utils/api';
import { isPastDeadline } from '../../utils/helpers';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  submissions: Array<{
    _id: string;
    student: {
      _id: string;
      name: string;
      email: string;
      skills: string[];
      github?: string;
    };
    link: string;
  }>;
}

function StartupDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.volt-worx.com/api'}/tasks/startup`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      
      // Fetch top students and no top students for all tasks
      const [topStudentsResponse, noTopStudentsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'https://api.volt-worx.com/api'}/top-students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'https://api.volt-worx.com/api'}/no-top-students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      const [topStudentsData, noTopStudentsData] = await Promise.all([
        topStudentsResponse.json(),
        noTopStudentsResponse.json()
      ]);

      // Create maps for quick lookup
      const topStudentMap = new Map(topStudentsData.data.map((ts: any) => [ts.projectId, ts]));
      const noTopStudentMap = new Map(noTopStudentsData.data.map((nts: any) => [nts.projectId, nts]));

      // Update tasks with selection information
      const tasksWithSelection = data.data.map((task: any) => ({
        ...task,
        topStudentSelected: topStudentMap.has(task._id),
        noTopStudentSelected: noTopStudentMap.has(task._id)
      }));

      setTasks(tasksWithSelection);
    } catch (error) {
      console.error('Error loading tasks:', error);
      alert('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user?._id]);

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        
        const response = await deleteTask(taskId);
        
        if (response.data) {
          // Remove the task from the local state
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete project. Please try again.';
        setError(errorMessage);
        console.error('Error deleting task:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectTopStudent = async (submission: Task['submissions'][0], task: Task) => {
    try {
      console.log('Starting top student selection process...');
      console.log('Submission data:', submission);
      console.log('Task data:', task);
      console.log('User data:', user);

      if (!submission.student?._id) {
        console.error('Invalid student data:', submission.student);
        alert('Invalid student data. Please try again.');
        return;
      }

      if (!user?._id || !user?.name || !user?.company) {
        console.error('Invalid startup data:', user);
        alert('Invalid startup data. Please try again.');
        return;
      }

      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please log in again to continue');
        return;
      }

      // Prepare the data
      const topStudentData = {
        studentId: submission.student._id,
        startupId: user._id,
        startupName: user.name,
        company: user.company,
        startupEmail: user.email,
        projectId: task._id,
        submissionLink: submission.student.github || submission.link || '',
      };

      console.log('Sending top student data:', topStudentData);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.volt-worx.com/api'}/top-students/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(topStudentData),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to select top student');
      }

      if (data.success) {
        alert('Top student selected successfully!');
        // Refresh the tasks list
        await loadTasks();
      } else {
        throw new Error(data.message || 'Failed to select top student');
      }
    } catch (error) {
      console.error('Error selecting top student:', error);
      alert(error instanceof Error ? error.message : 'Failed to select top student');
    }
  };

  const handleNoTopStudent = async (task: Task) => {
    try {
      if (!user?._id || !user?.name || !user?.company) {
        alert('Invalid startup data. Please try again.');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again to continue');
        return;
      }
      const noTopStudentData = {
        startupId: user._id,
        startupName: user.name,
        company: user.company,
        startupEmail: user.email,
        projectId: task._id,
        reason: '' // Optionally, prompt for a reason
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.volt-worx.com/api'}/no-top-students/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noTopStudentData),
      });
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record No Top Student');
      }

      if (data.success) {
        alert('No Top Student recorded successfully!');
        await loadTasks();
      } else {
        throw new Error(data.message || 'Failed to record No Top Student');
      }
    } catch (error) {
      console.error('Error recording no top student:', error);
      alert(error instanceof Error ? error.message : 'Failed to record No Top Student');
    }
  };

  // Filter tasks based on active tab
  const activeTasks = tasks.filter((task: any) => !isPastDeadline(task.deadline));
  const completedTasks = tasks.filter((task: any) => isPastDeadline(task.deadline));
  
  const displayedTasks = 
    activeTab === 'active' 
      ? activeTasks 
      : activeTab === 'completed' 
        ? completedTasks 
        : tasks;

  // Helper to check if selection is already made
  const isSelectionMade = (task: any) => task.topStudentSelected || task.noTopStudentSelected;

  return (
    <div className="container max-w-full px-2 py-8">
      {/* Header Section */}
      <div className="group relative mb-8">
        <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
        <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Startup Dashboard</h1>
            <Link 
              to="/startup/create-task" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Project
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="group relative mb-8">
        <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
        <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm",
                activeTab === 'active'
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              <Clock className="h-5 w-5 mr-2" />
              Active Projects
              {activeTasks.length > 0 && (
                <span className="ml-2 bg-purple-500/20 text-purple-300 py-0.5 px-2.5 rounded-full text-xs">
                  {activeTasks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                "py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm",
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
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm",
                activeTab === 'all'
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              )}
            >
              <Archive className="h-5 w-5 mr-2" />
              All Projects
              {tasks.length > 0 && (
                <span className="ml-2 bg-purple-500/20 text-purple-300 py-0.5 px-2.5 rounded-full text-xs">
                  {tasks.length}
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
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayedTasks.map((task: any) => (
              <div key={task._id} className="group relative min-w-0">
                <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
                <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
                  <TaskCard
                    task={task}
                    showJoinButton={false}
                    isStartup={true}
                    onDelete={() => handleDeleteTask(task._id)}
                  />
                  
                  {/* Submissions Section */}
                  {task.submissions && task.submissions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Submissions</h3>
                      <div className="space-y-2">
                        {task.submissions.map((submission: Task['submissions'][0]) => (
                          <div key={submission._id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-300">
                                {submission.student.name}
                              </span>
                            </div>
                            <a
                              href={submission.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                            >
                              View Submission
                            </a>
                            {/* Show Select Top Student button only after deadline and if no selection made */}
                            {isPastDeadline(task.deadline) && !isSelectionMade(task) && (
                              <button
                                onClick={() => handleSelectTopStudent(submission, task)}
                                className="ml-4 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                              >
                                Select Top Student
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Show No Top Student button only after deadline and if no selection made */}
                      {isPastDeadline(task.deadline) && !isSelectionMade(task) && (
                        <button
                          onClick={() => handleNoTopStudent(task)}
                          className="mt-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          No Top Student
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-white mb-2">
                {activeTab === 'active' ? 'No active projects found' :
                 activeTab === 'completed' ? 'You don\'t have any completed projects yet' :
                 'You haven\'t created any projects yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'active' || activeTab === 'all' 
                  ? 'Create your first project to start finding student talent'
                  : 'Projects with passed deadlines will appear here'}
              </p>
              <Link 
                to="/startup/create-task" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartupDashboard;