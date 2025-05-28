import React from 'react';
import { 
  Code2, 
  Bug, 
  Palette, 
  Image, 
  Users, 
  Lightbulb, 
  Trophy, 
  Zap,
  Star,
  Rocket,
  Target,
  Sparkles
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: any) => boolean;
}

interface BadgesProps {
  stats: {
    completedTasks: number;
    frontendTasks: number;
    bugFixes: number;
    designTasks: number;
    logoTasks: number;
    collaborations: number;
    ideasPosted: number;
    quickSubmissions: number;
  };
}

const badges: Badge[] = [
  {
    id: 'frontend-wizard',
    name: 'Frontend Wizard',
    description: 'Completed 5+ UI/UX or frontend tasks',
    icon: <Code2 className="h-6 w-6" />,
    condition: (stats) => stats.frontendTasks >= 5
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Fixed bugs or improved someone else\'s code',
    icon: <Bug className="h-6 w-6" />,
    condition: (stats) => stats.bugFixes > 0
  },
  {
    id: 'design-guru',
    name: 'Design Guru',
    description: 'Delivered standout UI/UX projects',
    icon: <Palette className="h-6 w-6" />,
    condition: (stats) => stats.designTasks >= 3
  },
  {
    id: 'logo-legend',
    name: 'Logo Legend',
    description: 'Won 3+ logo design tasks',
    icon: <Image className="h-6 w-6" />,
    condition: (stats) => stats.logoTasks >= 3
  },
  {
    id: 'collab-king',
    name: 'Collab King',
    description: 'Joined or created successful collaborations',
    icon: <Users className="h-6 w-6" />,
    condition: (stats) => stats.collaborations > 0
  },
  {
    id: 'idea-igniter',
    name: 'Idea Igniter',
    description: 'Posted a collaboration idea that got picked up',
    icon: <Lightbulb className="h-6 w-6" />,
    condition: (stats) => stats.ideasPosted > 0
  },
  {
    id: 'task-terminator',
    name: 'Task Terminator',
    description: 'Completed 10+ tasks',
    icon: <Trophy className="h-6 w-6" />,
    condition: (stats) => stats.completedTasks >= 10
  },
  {
    id: 'quick-fire',
    name: 'Quick Fire',
    description: 'Submitted work within 24 hours',
    icon: <Zap className="h-6 w-6" />,
    condition: (stats) => stats.quickSubmissions > 0
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Completed your first task with excellence',
    icon: <Star className="h-6 w-6" />,
    condition: (stats) => stats.completedTasks >= 1
  },
  {
    id: 'rocket-launch',
    name: 'Rocket Launch',
    description: 'Completed 5+ tasks in record time',
    icon: <Rocket className="h-6 w-6" />,
    condition: (stats) => stats.quickSubmissions >= 5
  },
  {
    id: 'target-master',
    name: 'Target Master',
    description: 'Achieved 100% task completion rate',
    icon: <Target className="h-6 w-6" />,
    condition: (stats) => stats.completedTasks >= 5
  },
  {
    id: 'sparkle-star',
    name: 'Sparkle Star',
    description: 'Received top performer recognition',
    icon: <Sparkles className="h-6 w-6" />,
    condition: (stats) => stats.completedTasks >= 3
  }
];

const Badges: React.FC<BadgesProps> = ({ stats }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/10">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {badges.map((badge) => {
          const isEarned = badge.condition(stats);
          return (
            <div
              key={badge.id}
              className={`p-3 sm:p-4 rounded-lg border relative ${
                isEarned
                  ? 'bg-purple-500/20 border-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700/50'
              }`}
            >
              {isEarned && (
                <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"></div>
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div
                    className={`p-1.5 sm:p-2 rounded-full ${
                      isEarned 
                        ? 'bg-purple-500/30 animate-glow' 
                        : 'bg-gray-700/50'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <h3
                    className={`font-medium text-sm sm:text-base ${
                      isEarned ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {badge.name}
                  </h3>
                </div>
                <p
                  className={`text-xs sm:text-sm ${
                    isEarned ? 'text-purple-200' : 'text-gray-500'
                  }`}
                >
                  {badge.description}
                </p>
                {!isEarned && (
                  <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                    {badge.id === 'frontend-wizard' && (
                      <span>{stats.frontendTasks}/5 frontend tasks completed</span>
                    )}
                    {badge.id === 'task-terminator' && (
                      <span>{stats.completedTasks}/10 tasks completed</span>
                    )}
                    {badge.id === 'design-guru' && (
                      <span>{stats.designTasks}/3 design tasks completed</span>
                    )}
                    {badge.id === 'logo-legend' && (
                      <span>{stats.logoTasks}/3 logo tasks completed</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges; 