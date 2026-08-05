import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = sessionStorage.getItem('verify_email');

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.AUTH.SIGNUP);
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await api.post('/v1/auth/verify-email', {
        email,
        otp: otpString
      });
      
      // Auto login
      login(response.data);
      sessionStorage.removeItem('verify_email');
      
      // Navigate to Phase 8 Profile Initialization
      navigate(ROUTES.PRIVATE.INIT_PROFILE);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      setSuccess('');
      await api.post('/v1/auth/resend-otp', { email });
      setTimer(600); // Reset timer to 10 mins
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
      <p className="text-sm text-gray-500 mb-8">
        We've sent a 6-digit code to <strong className="text-gray-800">{email}</strong>
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{success}</div>}

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          ))}
        </div>

        <Button type="submit" className="w-full h-12" disabled={isLoading || timer === 0}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-8 flex flex-col items-center justify-center text-sm gap-2">
        <span className="text-gray-500">
          Time remaining: <strong className="text-gray-800">{formatTime(timer)}</strong>
        </span>
        <button 
          onClick={handleResend}
          disabled={timer > 0}
          className={`font-bold transition-colors ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:underline'}`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};
