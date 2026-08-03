import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: { email: string; name: string }) => void;
  onClose?: () => void;
}

export default function AuthModal({ isOpen, onLoginSuccess, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (!isOpen) return null;

  // Step 1: Request Code / Login
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isSignUp) {
      if (!name || !email || !password) {
        return setError('Please fill in all fields');
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to send verification code');

        setMessage(`Verification code sent to ${email}`);
        setStep('verify');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Direct Login Logic
      if (!email || !password) return setError('Please enter email and password');
      localStorage.setItem('nexus_user', JSON.stringify({ email, name: email.split('@')[0] }));
      onLoginSuccess({ email, name: email.split('@')[0] });
    }
  };

  // Step 2: Verify 6-digit Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode, name }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid code');

      // Verification Success
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold text-center text-pink-500 mb-2">
          {isSignUp ? (step === 'form' ? 'Create Account' : 'Verify Email') : 'Welcome Back'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-lg mb-4 text-center">
            {message}
          </div>
        )}

       {step === 'form' ? (
  <>
    <form onSubmit={handleSendCode} className="space-y-4">
      {isSignUp && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:outline-none focus:border-pink-500"
          />
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-400 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:outline-none focus:border-pink-500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:outline-none focus:border-pink-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white hover:bg-pink-500 transition disabled:opacity-50 mt-2"
      >
        {loading ? 'Processing...' : isSignUp ? 'Send Verification Code' : 'Log In'}
      </button>
    </form>

    {!isSignUp && (
      <div className="text-center mt-3">
        <span
          onClick={() => setShowForgotPassword(true)}
          className="text-red-400 cursor-pointer text-sm font-medium hover:underline"
        >
          Forgot Password?
        </span>
      </div>
    )}
  </>
) : (
  <form onSubmit={handleVerifyCode} className="space-y-4">
    <p className="text-sm text-gray-400 text-center">
      Please enter the 6-digit verification code sent to <br />
      <strong className="text-white">{email}</strong>
    </p>

    <div>
      <input
        type="text"
        maxLength={6}
        required
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="123456"
        className="w-full text-center tracking-widest text-2xl font-mono rounded-lg bg-slate-800 p-3 text-white border border-slate-700 focus:outline-none focus:border-pink-500"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white hover:bg-pink-500 transition disabled:opacity-50"
    >
      {loading ? 'Verifying...' : 'Verify & Sign Up'}
    </button>

    <button
      type="button"
      onClick={() => setStep('form')}
      className="w-full text-xs text-gray-400 hover:underline text-center block mt-2"
    >
      ← Back to registration details
    </button>
  </form>
)}

{step === 'form' && (
  <div className="mt-4 text-center text-xs text-gray-400">
    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
    <button
      type="button"
      onClick={() => {
        setIsSignUp(!isSignUp);
        setError('');
      }}
      className="text-pink-400 font-semibold hover:underline ml-1"
    >
      {isSignUp ? 'Log In' : 'Sign Up'}
    </button>
  </div>
)}

      </div>
    </div>
  );
}