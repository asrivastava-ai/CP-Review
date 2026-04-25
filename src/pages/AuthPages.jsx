import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Ship, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

// Google Icon SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.07 0-3.83-1.4-4.46-3.28H1.85v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.52 10.54A4.8 4.8 0 0 1 4.27 9c0-.53.09-1.05.25-1.54V5.39H1.85A8 8 0 0 0 .98 9c0 1.29.31 2.51.87 3.61l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 3.58c1.16 0 2.2.4 3.02 1.19l2.26-2.26A8 8 0 0 0 1.85 5.39l2.67 2.07C5.15 5 6.9 3.58 8.98 3.58z"/>
    </svg>
  );
}

// Divider
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--mid)', fontWeight: 500 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 60%, #0f1923 100%)'
    }}>
      {/* Left panel */}
      <div style={{
        width: '420px', flexShrink: 0,
        background: 'rgba(201,168,76,0.06)',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, background: 'var(--gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ship size={24} color="#0f1923" />
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 900, color: 'white' }}>GEOSERVE</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase' }}>CP Review</div>
          </div>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 16 }}>
          Charterparty<br />Intelligence
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8 }}>
          AI-powered clause-by-clause charterparty review. Upload any CP, define your position, and receive precise legal comments.
        </p>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['Owners & Charterers perspective', 'Trip TC & Period CP analysis', 'Cargo exclusion verification', 'Strikethrough & deletion detection', 'Community Knowledge Base'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          background: 'var(--paper)', borderRadius: 16, padding: '48px 44px',
          width: '100%', maxWidth: 440, boxShadow: '0 24px 80px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, marginBottom: 6 }}>{title}</h2>
          <p style={{ color: 'var(--mid)', fontSize: 14, marginBottom: 32 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

// Google Sign-In Button
function GoogleButton({ onClick, loading, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '11px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: 'white', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)', cursor: 'pointer',
        fontFamily: 'Source Serif 4, serif', fontSize: 15, fontWeight: 600,
        color: 'var(--ink)', transition: 'all 0.18s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'}
    >
      {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <GoogleIcon />}
      {label}
    </button>
  );
}

// ── Login ──────────────────────────────────────────────────
export function LoginPage() {
  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // ── AUTO-BYPASS: if user already logged in (coming from app.ai-geoserves.com),
  // skip the login screen and go straight to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    } else {
      // Give Firebase a moment to restore session before showing login form
      const timer = setTimeout(() => setChecking(false), 800);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  // Show spinner while checking auth session
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 60%, #0f1923 100%)',
        flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(201,168,76,0.2)',
          borderTopColor: '#c9a84c', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'monospace' }}>
          Checking session...
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Please try again.');
      }
    } finally { setGoogleLoading(false); }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your GEOSERVE account">
      {/* Google button first */}
      <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Continue with Google" />
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mid)' }} />
            <input className="form-input" style={{ paddingLeft: 38 }} type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mid)' }} />
            <input className="form-input" style={{ paddingLeft: 38, paddingRight: 42 }}
              type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid)', padding: 2 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'right', marginTop: -12, marginBottom: 20 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>Forgot password?</Link>
        </div>
        <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
        </button>
      </form>
      <hr className="divider" />
      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--mid)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
      </p>
    </AuthLayout>
  );
}

// ── Register ───────────────────────────────────────────────
export function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email already registered' : err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Please try again.');
      }
    } finally { setGoogleLoading(false); }
  }

  return (
    <AuthLayout title="Create account" subtitle="Join GEOSERVE CP Review platform">
      <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
      <Divider />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mid)' }} />
            <input className="form-input" style={{ paddingLeft: 38 }} type="text" placeholder="John Smith"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="you@company.com"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min. 6 characters"
            value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input className="form-input" type="password" placeholder="Repeat password"
            value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
        </div>
        <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
        </button>
      </form>
      <hr className="divider" />
      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--mid)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

// ── Forgot Password ────────────────────────────────────────
export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      toast.error('Could not send reset email. Check the address and try again.');
    } finally { setLoading(false); }
  }

  return (
    <AuthLayout title="Reset password" subtitle="We'll send a reset link to your email">
      {sent ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h3 style={{ fontFamily: 'Playfair Display', marginBottom: 8 }}>Check your inbox</h3>
          <p style={{ color: 'var(--mid)', fontSize: 14, marginBottom: 24 }}>
            A password reset link has been sent to <strong>{email}</strong>
          </p>
          <Link to="/login" className="btn btn-outline">Back to Sign In</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mid)' }} />
              <input className="form-input" style={{ paddingLeft: 38 }} type="email" placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Send Reset Link'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/login" style={{ fontSize: 14, color: 'var(--mid)', textDecoration: 'none' }}>← Back to Sign In</Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
