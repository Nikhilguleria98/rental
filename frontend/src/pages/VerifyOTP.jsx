import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  if (!email) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-soft text-center">
          <p className="text-red-500">Please complete signup first</p>
          <button onClick={() => navigate('/signup')} className="mt-4 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/verify-otp', { email, otp });
      setToast({ message: 'Email verified successfully! Redirecting...', type: 'success' });
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:4000/api/auth/resend-otp', { email });
      setToast({ message: 'OTP resent to your email!', type: 'success' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Verify Your Email</h1>
        <p className="mt-2 text-sm text-slate-600">We've sent a 6-digit OTP to {email}</p>
        
        <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Enter OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              type="text"
              placeholder="000000"
              maxLength="6"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-center text-3xl font-semibold tracking-widest outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="inline-flex w-full justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">Didn't receive OTP?</p>
          <button
            onClick={handleResendOTP}
            disabled={loading}
            type="button"
            className="mt-2 font-semibold text-cyan-500 hover:text-cyan-600 disabled:text-slate-400"
          >
            Resend OTP
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default VerifyOTP;
