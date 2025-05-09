import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentProjects, fetchStudentProfile } from '../../utils/api';
import { Award, Calendar, Building, Star, CheckCircle, Code, BookOpen, Briefcase, Mail, MapPin, Github, Linkedin, Download } from 'lucide-react';
import Badges from '../../components/Badges';
import { useNavigate, useLocation } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress';
  rating?: number;
  feedback?: string;
  category?: string;
  collaborators?: string[];
  isIdea?: boolean;
}

interface StudentProfile {
  bio: string;
  skills: string[];
  interests: string[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  location: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

function StudentProfile() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [projectsResponse, profileResponse] = await Promise.all([
        fetchStudentProjects(user?._id || ''),
        fetchStudentProfile()
      ]);
      console.log('Fetched Projects:', projectsResponse.data);
      setProjects(projectsResponse.data);
      console.log('Projects State:', projects);
      setProfile(profileResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      loadData();
    }
  }, [user?._id, loadData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData]);

  // Refetch data when navigating back to the profile
  useEffect(() => {
    if (location.pathname === '/student/profile') {
      loadData();
    }
  }, [location, loadData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateResume = async () => {
    if (!profile || !user) return;
    
    try {
      setIsDownloading(true);

      const completedProjects = projects.filter(p => p.status === 'completed');
      const activeProjects = projects.filter(p => p.status === 'in-progress');
      const averageRating = completedProjects
        .filter(p => p.rating)
        .reduce((acc, p) => acc + (p.rating || 0), 0) / 
        completedProjects.filter(p => p.rating).length || 0;

      const resumeContent = `
${user.name}
${user.email}
${profile.location ? `Location: ${profile.location}` : ''}
${profile.github ? `GitHub: ${profile.github}` : ''}
${profile.linkedin ? `LinkedIn: ${profile.linkedin}` : ''}

ABOUT
${profile.bio}

SKILLS
${profile.skills.join(', ')}

EDUCATION
${profile.education.map(edu => `
  ${edu.degree}
  ${edu.institution}
  ${edu.year}
`).join('\n')}

PROJECT EXPERIENCE
${completedProjects.map(project => `
  ${project.title} - ${project.company}
  ${project.description}
  Duration: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}
  ${project.rating ? `Rating: ${project.rating}/5` : ''}
  ${project.feedback ? `Feedback: ${project.feedback}` : ''}
`).join('\n')}

ACTIVE PROJECTS
${activeProjects.map(project => `
  ${project.title} - ${project.company}
  ${project.description}
  Duration: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}
`).join('\n')}

STATISTICS
Completed Projects: ${completedProjects.length}
Active Projects: ${activeProjects.length}
Average Rating: ${averageRating.toFixed(1)}/5
      `.trim();

      // Create and download the file
      const element = document.createElement('a');
      const file = new Blob([resumeContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${user.name.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculate student stats for badges
  const calculateStats = () => {
    const completedTasks = projects.filter(p => p.status === 'completed').length;
    const frontendTasks = projects.filter(p => 
      p.status === 'completed' && 
      (p.category === 'UI/UX' || p.category === 'Frontend')
    ).length;
    const bugFixes = projects.filter(p => 
      p.status === 'completed' && 
      p.category === 'Bug Fix'
    ).length;
    const designTasks = projects.filter(p => 
      p.status === 'completed' && 
      p.category === 'Design'
    ).length;
    const logoTasks = projects.filter(p => 
      p.status === 'completed' && 
      p.category === 'Logo Design'
    ).length;
    const collaborations = projects.filter(p => 
      p.status === 'completed' && 
      (p.collaborators?.length || 0) > 0
    ).length;
    const ideasPosted = projects.filter(p => 
      p.status === 'completed' && 
      p.isIdea
    ).length;
    const quickSubmissions = projects.filter(p => {
      if (p.status !== 'completed') return false;
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);
      const hoursDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }).length;

    return {
      completedTasks,
      frontendTasks,
      bugFixes,
      designTasks,
      logoTasks,
      collaborations,
      ideasPosted,
      quickSubmissions
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-4xl text-purple-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-purple-200/80 mb-4">{user?.email}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {profile?.location && (
                    <div className="flex items-center text-purple-200/80">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.github && (
                    <a 
                      href={profile.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-purple-200/80 hover:text-purple-300"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a 
                      href={profile.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-purple-200/80 hover:text-purple-300"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Bio and Skills */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
                <p className="text-purple-100/80">{profile.bio}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Areas of Interest</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Education and Stats */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-purple-500/30 pl-4">
                      <h3 className="text-white font-medium">{edu.degree}</h3>
                      <p className="text-purple-200/80">{edu.institution}</p>
                      <p className="text-purple-200/60 text-sm">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/80">Projects Completed</span>
                    <span className="text-white font-semibold">
                      {projects.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/80">Active Projects</span>
                    <span className="text-white font-semibold">
                      {projects.filter(p => p.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/80">Average Rating</span>
                    <span className="text-white font-semibold">
                      {projects
                        .filter(p => p.rating)
                        .reduce((acc, p) => acc + (p.rating || 0), 0) / 
                        projects.filter(p => p.rating).length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Section */}
        <div className="mb-8">
          <Badges stats={calculateStats()} />
        </div>
      </div>
    </div>
  );
}

export default StudentProfile; 