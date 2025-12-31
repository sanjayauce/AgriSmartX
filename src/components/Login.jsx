import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Roles for signup dropdown only
const roles = [
  "Farmer",
  "Admin",
  "Dealer",
  "Agriculture Expert",
  "Wholesaler",
  "Retailer",
  "Government Agencies",
  "NGOs",
  "Resource Provider"
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' // used only for signup
  });

  // ✅ Role-based dashboard
  const getRoleBasedDashboardPath = (role) => {
    switch (role) {
      case 'Farmer':
        return '/farmer/profile';
      case 'Resource Provider':
        return '/provider/dashboard';
      case 'Government Agencies':
        return '/gov-agencies/overview';
      case 'Admin':
        return '/admin/dashboard';
      case 'Dealer':
        return '/dealer/dashboard';
      case 'Agriculture Expert':
        return '/expert/dashboard';
      case 'Wholesaler':
        return '/wholesaler/dashboard';
      case 'Retailer':
        return '/retailer/dashboard';
      case 'NGOs':
        return '/ngo/dashboard';
      default:
        return '/dashboard';
    }
  };

  // ✅ Simple intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Form handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? 'http://localhost:5005/api/auth/login'
      : 'http://localhost:5005/api/auth/signup';

    try {
      const response = await axios.post(url, formData);

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;

        // ✅ Store in Auth Context + sessionStorage
        login(user);

        // ✅ Navigate by actual returned role
        const dashboardPath = getRoleBasedDashboardPath(user.role);
        navigate(dashboardPath, { replace: true });

      } else {
        alert(response.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err.response?.data || err.message);
      alert(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="login-container">
      <div className={`login-box ${animationComplete ? 'animation-complete' : ''}`}>
        <h2>{isLogin ? t('login') || 'Login' : t('signUp') || 'Sign Up'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('email') || 'Email'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('enterEmail') || 'Enter email'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('password') || 'Password'}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={t('enterPassword') || 'Enter password'}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">{t('role') || 'Role'}</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>{t('selectRole') || 'Select a role'}</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {t(`roles.${role.toLowerCase().replace(/\s+/g, '')}`) || role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? t('login') || 'Login' : t('signUp') || 'Sign Up'}
          </button>
        </form>

        <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? t('needAccount') || "Don't have an account? Sign up"
            : t('haveAccount') || "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Login;
