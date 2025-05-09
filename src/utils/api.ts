import axios from 'axios';
import { API_URL } from './constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Task API
export const fetchTasks = () => api.get('/tasks');
export const fetchTaskById = (taskId: string) => api.get(`/tasks/${taskId}`);
export const createTask = (taskData: any) => api.post('/tasks', taskData);
export const joinTask = (taskId: string) => api.post(`/tasks/${taskId}/join`);
export const submitTask = (taskId: string, submissionData: { link: string }) => 
  api.post(`/tasks/${taskId}/submit`, submissionData);
export const submitProject = (taskId: string, submissionData: any) => 
  api.post(`/tasks/${taskId}/submit`, submissionData);
export const markTopPerformer = (taskId: string, studentId: string) => 
  api.patch(`/tasks/${taskId}/mark-top`, { studentId });
export const deleteTask = (taskId: string) => api.delete(`/tasks/${taskId}`);

// User API
export const fetchStudentProfile = () => api.get('/students/profile');
export const fetchStartupProfile = () => api.get('/startups/profile');
export const updateStudentProfile = (profileData: any) => 
  api.patch('/students/profile', profileData);
export const updateStartupProfile = (profileData: any) => 
  api.patch('/startups/profile', profileData);

// Authentication API (already handled in AuthContext, but available here for completeness)
export const login = (email: string, password: string, role: string) => 
  api.post('/auth/login', { email, password, role });
export const register = (userData: any) => api.post('/auth/register', userData);
export const checkAuthStatus = () => api.get('/auth/me');

export const fetchStudentProjects = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/students/submissions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;