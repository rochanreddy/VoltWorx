import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, Clock, Link as LinkIcon, ExternalLink, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchTaskById, joinTask, submitProject, markTopPerformer } from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate, getRemainingSlots, hasUserJoinedTask, hasUserSubmitted } from '../utils/helpers';
import { cn } from '../utils/helpers';

function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectLink, setProjectLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isMarkingTop, setIsMarkingTop] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTaskById(taskId!);
        setTask(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load task details');
        console.error('Error fetching task:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleJoinTask = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsJoining(true);
      await joinTask(taskId!);
      // Refetch task to update UI
      const response = await fetchTaskById(taskId!);
      setTask(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join task');
      console.error('Error joining task:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectLink) return;

    try {
      setIsSubmitting(true);
      await submitProject(taskId!, { link: projectLink });
      // Refetch task to update UI
      const response = await fetchTaskById(taskId!);
      setTask(response.data);
      setProjectLink('');
      // Trigger profile refresh
      navigate('/student/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit project');
      console.error('Error submitting project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkTopPerformer = async (studentId: string) => {
    try {
      setIsMarkingTop(true);
      await markTopPerformer(taskId!, studentId);
      // Refetch task to update UI
      const response = await fetchTaskById(taskId!);
      setTask(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark top performer');
      console.error('Error marking top performer:', err);
    } finally {
      setIsMarkingTop(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-error-600">{error || 'Task not found'}</p>
          <Link to="/" className="mt-4 btn btn-primary inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isStudent = user?.role === 'student';
  const isStartup = user?.role === 'startup';
  const isTaskCreator = isStartup && task.startup === user?._id;
  const userHasJoined = isStudent && hasUserJoinedTask(task, user?._id);
  const userHasSubmitted = isStudent && hasUserSubmitted(task, user?._id);
  const remainingSlots = getRemainingSlots(task.totalSlots, task.filledSlots);
  const isFull = remainingSlots === 0;
  const isJoined = userHasJoined;
  const isPastDeadline = new Date(task.deadline) < new Date();

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Task details card */}
        <div className="group relative">
          {/* Background gradient effect */}
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          
          {/* Card content */}
          <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">{task.title}</h1>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                isPastDeadline
                  ? "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                  : remainingSlots === 0
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-green-500/20 text-green-300 border border-green-500/30"
              )}>
                {isPastDeadline
                  ? "Closed"
                  : remainingSlots === 0
                  ? "Full"
                  : `${remainingSlots} spots left`}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {task.skillTags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center text-gray-300">
                <Calendar className="h-5 w-5 mr-3 text-purple-300" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Deadline</p>
                  <p className="text-sm">{formatDate(task.deadline)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Users className="h-5 w-5 mr-3 text-purple-300" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Participants</p>
                  <p className="text-sm">{task.filledSlots}/{task.totalSlots} spots filled</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-3 text-purple-300" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Posted</p>
                  <p className="text-sm">{formatDate(task.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-white">Description</h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{task.description}</p>
            </div>
            
            {/* Action buttons */}
            {isStudent && !isPastDeadline && (
              <div className="mb-6">
                {!userHasJoined ? (
                  <button
                    onClick={handleJoinTask}
                    disabled={remainingSlots === 0 || isJoining}
                    className={cn(
                      "w-full md:w-auto px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                      {
                        "bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900": !isFull && !isJoined,
                        "bg-green-500/30 text-green-300 border border-green-500/30": isJoined,
                        "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30": isFull && !isJoined
                      }
                    )}
                  >
                    {isJoining ? (
                      <LoadingSpinner size="small" className="mr-2" />
                    ) : null}
                    {remainingSlots > 0 ? "Join This Project" : "No Spots Available"}
                  </button>
                ) : (
                  <div>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                      <p className="text-green-300 font-medium">
                        You've joined this project! Complete the task and submit your work below.
                      </p>
                    </div>
                    {/* Always show the submission form, prefill with existing link if any */}
                    <form onSubmit={handleSubmitProject} className="space-y-4">
                      <div>
                        <label htmlFor="projectLink" className="block text-sm font-medium text-gray-300 mb-2">
                          {userHasSubmitted ? 'Update Your Submission' : 'Submit Your Project'}
                        </label>
                        <div className="flex">
                          <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="url"
                              id="projectLink"
                              value={projectLink}
                              onChange={(e) => setProjectLink(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter your project link (GitHub, Google Drive, etc.)"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                          >
                            {isSubmitting ? (
                              <LoadingSpinner size="small" className="mr-2" />
                            ) : null}
                            {userHasSubmitted ? 'Update Submission' : 'Submit'}
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Submit a link to your completed project (GitHub, Google Drive, live URL, etc.)
                        </p>
                        {/* If already submitted, show the current link */}
                        {userHasSubmitted && task.submissions.map((submission: any) => (
                          submission.student._id === user?._id && (
                            <div key={submission._id} className="flex items-center mt-2">
                              <LinkIcon className="h-4 w-4 text-purple-300 mr-2" />
                              <a
                                href={submission.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-300 hover:text-purple-200 flex items-center transition-colors"
                              >
                                View Current Submission
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )
                        ))}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Submissions section (visible to task creator) */}
        {isTaskCreator && task.submissions.length > 0 && (
          <div className="mt-8 group relative">
            <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
            <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Submissions</h2>
              <div className="divide-y divide-gray-700">
                {task.submissions.map((submission: any) => (
                  <div key={submission._id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{submission.student.name}</p>
                      <div className="flex items-center mt-1">
                        <a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-300 hover:text-purple-200 flex items-center text-sm transition-colors"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          View Submissions
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    <div>
                      {submission.isTopPerformer ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          <Award className="h-4 w-4 mr-1" /> Top Performer
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkTopPerformer(submission.student._id)}
                          disabled={isMarkingTop}
                          className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 border border-purple-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                          {isMarkingTop ? (
                            <LoadingSpinner size="small" className="mr-2" />
                          ) : (
                            <Award className="h-4 w-4 mr-1" />
                          )}
                          Mark as Top Performer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Applicants section (visible to task creator) */}
        {isTaskCreator && task.applicants.length > 0 && (
          <div className="mt-8 group relative">
            <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
            <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Participants ({task.applicants.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.applicants.map((applicant: any) => (
                  <div key={applicant._id} className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-purple-500/30 transition-colors">
                    <p className="font-medium text-white">{applicant.name}</p>
                    <p className="text-sm text-gray-400">{applicant.email}</p>
                    {applicant.skills && applicant.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {applicant.skills.slice(0, 3).map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 3 && (
                          <span className="text-xs text-gray-400 flex items-center">
                            +{applicant.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;