import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase as BriefcaseBusiness, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { SKILLS } from '../utils/constants';
import { cn } from '../utils/helpers';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    companyEmail: '',
    phone: '',
    description: '',
    startupStage: '',
    startupAge: '',
    startupIndiaRegistered: '',
    linkedIn: '',
    skills: [] as string[],
    educationLevel: '',
    year: '',
    collegeName: '',
    rollNumber: '',
  });
  const [role, setRole] = useState<'student' | 'startup'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [googleUser, setGoogleUser] = useState<any>(null);

  // Check for Google email on component mount
  useEffect(() => {
    const googleEmail = localStorage.getItem('googleEmail');
    if (googleEmail) {
      setFormData(prev => ({
        ...prev,
        email: googleEmail,
        companyEmail: googleEmail
      }));
      // Clear the stored email
      localStorage.removeItem('googleEmail');
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && value !== formData.password) {
        setPasswordError('Passwords do not match');
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSkillSuggestions(e.target.value.length > 0);
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill) && skill.trim() !== '') {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const filteredSkills = SKILLS.filter(skill => 
    skill.toLowerCase().includes(skillInput.toLowerCase()) && 
    !formData.skills.includes(skill)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Add validation for skills when role is student
    if (role === 'student' && formData.skills.length === 0) {
      setPasswordError('Please add at least one skill');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const userData = {
        name: formData.name,
        email: role === 'startup' ? formData.companyEmail : formData.email,
        password: formData.password,
        role: role,
        ...(role === 'student' 
          ? { 
              skills: formData.skills,
              phone: formData.phone,
              educationLevel: formData.educationLevel,
              year: formData.year,
              collegeName: formData.collegeName,
              linkedIn: formData.linkedIn,
              rollNumber: formData.rollNumber
            } 
          : { 
              company: formData.company,
              phone: formData.phone,
              description: formData.description,
              startupStage: formData.startupStage,
              startupAge: formData.startupAge,
              startupIndiaRegistered: formData.startupIndiaRegistered,
              linkedIn: formData.linkedIn
            }
        )
      };
      
      await register(userData, role);
      navigate(role === 'student' ? '/student/dashboard' : '/startup/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google registration handler
  const handleGoogleRegister = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      setGoogleUser(decoded);
      setFormData((prev) => ({
        ...prev,
        name: decoded.name || prev.name,
        email: decoded.email || prev.email,
        companyEmail: decoded.email || prev.email
      }));

      // Store the role in localStorage for Google registration
      localStorage.setItem('googleRegistrationRole', role);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
          <div className="relative p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={cn(
                    'py-2 px-4 border rounded-lg flex justify-center items-center transition-all duration-200',
                    role === 'student'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  )}
                  onClick={() => setRole('student')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Student
                </button>
                <button
                  type="button"
                  className={cn(
                    'py-2 px-4 border rounded-lg flex justify-center items-center transition-all duration-200',
                    role === 'startup'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  )}
                  onClick={() => setRole('startup')}
                >
                  <BriefcaseBusiness className="h-5 w-5 mr-2" />
                  Startup
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Google Auth Button */}
            {!googleUser && (
              <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={() => {
                    alert('Google Sign In was unsuccessful. Try again later');
                  }}
                  width="100%"
                  theme="filled_black"
                  text="continue_with"
                  shape="pill"
                />
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* If Google user, show info at the top */}
              {googleUser && (
                <div className="mb-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200">
                  <div className="font-semibold">Google Account:</div>
                  <div>Name: {googleUser.name}</div>
                  <div>Email: {googleUser.email}</div>
                </div>
              )}

              {role === 'startup' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Founder Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter founder's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-300 mb-1">
                      Company Official Email
                    </label>
                    <input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      required
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter company email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Company Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Describe your company in 3 lines"
                    />
                  </div>

                  <div>
                    <label htmlFor="startupStage" className="block text-sm font-medium text-gray-300 mb-1">
                      Startup Stage
                    </label>
                    <select
                      id="startupStage"
                      name="startupStage"
                      required
                      value={formData.startupStage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select startup stage</option>
                      <option value="idea">Idea Stage</option>
                      <option value="mvp">MVP Stage</option>
                      <option value="early">Early Stage</option>
                      <option value="growth">Growth Stage</option>
                      <option value="established">Established</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="startupAge" className="block text-sm font-medium text-gray-300 mb-1">
                      Age of Startup
                    </label>
                    <select
                      id="startupAge"
                      name="startupAge"
                      required
                      value={formData.startupAge}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select age of startup</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="startupIndiaRegistered"
                      name="startupIndiaRegistered"
                      type="checkbox"
                      checked={formData.startupIndiaRegistered === 'yes'}
                      onChange={(e) => setFormData({ ...formData, startupIndiaRegistered: e.target.checked ? 'yes' : 'no' })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="startupIndiaRegistered" className="ml-2 block text-sm text-gray-300">
                      Registered on Startup India
                    </label>
                  </div>

                  <div>
                    <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedIn"
                      name="linkedIn"
                      type="url"
                      required
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </>
              )}

              {role === 'student' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Gmail Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your Gmail address"
                      pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                      title="Please enter a valid Gmail address"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">
                      Skills
                    </label>
                    <div className="relative flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={handleSkillInputChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Add your skills"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (skillInput.trim() !== '') {
                            addSkill(skillInput.trim());
                          }
                        }}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {showSkillSuggestions && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-purple-300 hover:text-purple-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-300 mb-1">
                      Current Educational Level
                    </label>
                    <input
                      id="educationLevel"
                      name="educationLevel"
                      type="text"
                      required
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="example: B.Tech, M.Tech, BCA, MCA, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">
                      Year of Graduation
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="text"
                      required
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your year of graduation"
                    />
                  </div>

                  <div>
                    <label htmlFor="collegeName" className="block text-sm font-medium text-gray-300 mb-1">
                      College Name
                    </label>
                    <input
                      id="collegeName"
                      name="collegeName"
                      type="text"
                      required
                      value={formData.collegeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your college name"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedIn"
                      name="linkedIn"
                      type="url"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-300 mb-1">
                      Roll Number
                    </label>
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Enter your roll number"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors",
                    passwordError ? "border-red-500" : "border-gray-700"
                  )}
                  placeholder="Confirm your password"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I agree to the terms and conditions
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !!passwordError}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="small" className="mr-2" />
                  ) : null}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;