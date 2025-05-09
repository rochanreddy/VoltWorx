import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Calendar } from 'lucide-react';
import { createTask } from '../../utils/api';
import { SKILLS } from '../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

function CreateTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillTags: [] as string[],
    deadline: '',
    totalSlots: 5,
    payment: {
      amount: 100
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Razorpay is loaded
  useEffect(() => {
    if (!window.Razorpay) {
      console.error('Razorpay script not loaded');
      setError('Payment system not available. Please refresh the page.');
    }
  }, []);

  // Get tomorrow's date formatted as YYYY-MM-DD for the min attribute of the date input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSkillSuggestions(e.target.value.length > 0);
  };

  const addSkill = (skill: string) => {
    if (!formData.skillTags.includes(skill) && skill.trim() !== '') {
      setFormData({ ...formData, skillTags: [...formData.skillTags, skill] });
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillTags: formData.skillTags.filter(skill => skill !== skillToRemove)
    });
  };

  const filteredSkills = SKILLS.filter(skill => 
    skill.toLowerCase().includes(skillInput.toLowerCase()) && 
    !formData.skillTags.includes(skill)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.skillTags.length === 0) {
      setError('Please add at least one skill tag');
      return;
    }

    if (formData.payment.amount < 100) {
      setError('Amount must be at least ₹100');
      return;
    }

    if (!window.Razorpay) {
      setError('Payment system not available. Please refresh the page.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);

      // First, test if the payments API is accessible
      try {
        console.log('Testing payments API...');
        const testResponse = await api.get('/payments/test');
        console.log('Payments API test response:', testResponse.data);
      } catch (err: any) {
        console.error('Payments API test failed:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        throw new Error('Payment service is not available. Please check if the server is running.');
      }

      console.log('Creating Razorpay order with amount:', formData.payment.amount);
      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        amount: formData.payment.amount
      });

      console.log('Order created:', orderResponse.data);
      const order = orderResponse.data;

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_pIRURBknTtWJ3p',
        amount: order.amount,
        currency: order.currency,
        name: 'VoltWorx',
        description: 'Task Creation Payment',
        order_id: order.id,
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          try {
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response');
            }

            // Verify payment and create task
            console.log('Verifying payment and creating task...');
            const token = localStorage.getItem('token');
            const taskResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              taskData: formData
            }, token ? {
              headers: {
                Authorization: `Bearer ${token}`
              }
            } : undefined);

            console.log('Task created successfully:', taskResponse.data);
            navigate(`/tasks/${taskResponse.data._id}`);
          } catch (err: any) {
            console.error('Error in payment handler:', err);
            setError(err.response?.data?.message || err.message || 'Error creating task');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: 'Startup Name',
          email: 'startup@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setError('Payment cancelled. Please try again.');
            setIsSubmitting(false);
          }
        }
      };

      console.log('Initializing Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description || 'Please try again'}`);
        setIsSubmitting(false);
      });
      
      console.log('Opening Razorpay modal...');
      razorpay.open();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="group relative mb-8">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <h1 className="text-2xl font-bold text-white">Create a New Project</h1>
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
        
        {/* Form */}
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Website Redesign, Marketing Campaign"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide a detailed description of the project, expectations, and deliverables..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="skillTags" className="block text-sm font-medium text-gray-200 mb-1">
                  Required Skills
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {formData.skillTags.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1.5 text-purple-300 hover:text-purple-100 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    id="skillInput"
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onFocus={() => setShowSkillSuggestions(skillInput.length > 0)}
                    onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                    placeholder="Add a required skill (e.g., JavaScript, Design)"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  
                  {showSkillSuggestions && filteredSkills.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-200 mb-1">
                    Deadline
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={minDate}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="totalSlots" className="block text-sm font-medium text-gray-200 mb-1">
                    Number of Available Spots
                  </label>
                  <select
                    id="totalSlots"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} className="bg-gray-800">
                        {num} {num === 1 ? 'student' : 'students'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="payment.amount"
                  value={formData.payment.amount}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: {
                      ...formData.payment,
                      amount: parseInt(e.target.value)
                    }
                  })}
                  min="100"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-sm text-gray-400">Minimum amount: ₹100</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/startup/dashboard')}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Processing...
                    </div>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;