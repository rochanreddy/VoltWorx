import { formatDistanceToNow, format, isAfter } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

/**
 * Combines multiple Tailwind CSS classes with proper overriding using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format date in a readable format
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP') {
  return format(new Date(date), formatStr);
}

/**
 * Check if a date is in the past
 */
export function isPastDeadline(deadline: string | Date) {
  return !isAfter(new Date(deadline), new Date());
}

/**
 * Calculate the remaining slots for a task
 */
export function getRemainingSlots(totalSlots: number, filledSlots: number) {
  return Math.max(0, totalSlots - filledSlots);
}

/**
 * Check if a user has already joined a task
 */
export function hasUserJoinedTask(task: any, userId: string) {
  return task.applicants.some((applicant: any) => applicant._id === userId);
}

/**
 * Check if a user has already submitted work for a task
 */
export function hasUserSubmitted(task: any, userId: string) {
  return task.submissions.some((submission: any) => submission.student._id === userId);
}

/**
 * Truncate text with ellipsis if it exceeds the specified length
 */
export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Get status badge color based on task status
 */
export function getStatusColor(deadline: string, filledSlots: number, totalSlots: number): string {
  if (isPastDeadline(deadline)) {
    return 'bg-gray-100 text-gray-800'; // Closed
  }
  
  if (filledSlots >= totalSlots) {
    return 'bg-error-100 text-error-800'; // Full
  }
  
  if (filledSlots / totalSlots > 0.5) {
    return 'bg-warning-100 text-warning-800'; // Almost full
  }
  
  return 'bg-success-100 text-success-800'; // Open
}

/**
 * Get task status text based on deadline and slots
 */
export function getTaskStatus(deadline: string, filledSlots: number, totalSlots: number): string {
  if (isPastDeadline(deadline)) {
    return 'Closed';
  }
  
  if (filledSlots >= totalSlots) {
    return 'Full';
  }
  
  return 'Open';
}