import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Trash2 } from 'lucide-react';
import { formatDate, getRemainingSlots, getStatusColor, getTaskStatus } from '../utils/helpers';
import { cn } from '../utils/helpers';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    skillTags: string[];
    deadline: string;
    totalSlots: number;
    filledSlots: number;
    payment?: {
      amount: number;
    };
  };
  showJoinButton?: boolean;
  onJoin?: () => void;
  isJoined?: boolean;
  isStartup?: boolean;
  onDelete?: () => void;
}

function TaskCard({ task, showJoinButton = true, onJoin, isJoined = false, isStartup = false, onDelete }: TaskCardProps) {
  const {
    _id,
    title,
    description,
    skillTags,
    deadline,
    totalSlots,
    filledSlots
  } = task;

  const remainingSlots = getRemainingSlots(totalSlots, filledSlots);
  const statusColor = getStatusColor(deadline, filledSlots, totalSlots);
  const status = getTaskStatus(deadline, filledSlots, totalSlots);
  const isFull = remainingSlots === 0;

  return (
    <div className="group relative">
      {/* Background gradient effect */}
      <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
      
      {/* Card content */}
      <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              statusColor === "bg-success-100 text-success-800" 
                ? "bg-green-500/20 text-green-300"
                : statusColor === "bg-warning-100 text-warning-800"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            )}>
              {status}
            </span>
            {isStartup && onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2 text-gray-300">
          {description}
        </p>
        
        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skillTags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              {tag}
            </span>
          ))}
          {skillTags.length > 3 && (
            <span className="text-xs flex items-center text-gray-400">
              +{skillTags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Meta Information */}
        <div className="flex justify-between items-center text-sm mb-6 text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Due {formatDate(deadline, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {filledSlots}/{totalSlots} spots filled
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-green-400">₹{task.payment?.amount || 0}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <Link
            to={`/tasks/${_id}`}
            className="inline-flex items-center text-sm font-medium transition-colors text-purple-400 hover:text-purple-300"
          >
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
          
          {showJoinButton && (
            <button
              onClick={onJoin}
              disabled={isFull || isJoined}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                {
                  "bg-purple-600 text-white hover:bg-purple-700": !isFull && !isJoined,
                  "bg-green-500/30 text-green-300 border border-green-500/30": isJoined,
                  "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30": isFull && !isJoined
                }
              )}
            >
              {isJoined ? 'Joined' : isFull ? 'Full' : 'Join Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;