import { useState, FormEvent } from 'react';
import { ArrowUpRight, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { IconBrand } from '../components/layout';
import { Role } from '../types';

export function AuthPage({ onEnter }: { onEnter: (role: Role) => void }) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [forgotNotice, setForgotNotice] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onEnter(identifier.toLowerCase().includes('admin') ? 'admin' : 'student');
  };

  return (
    <div className="auth-page" data-testid="page-auth">
      <section className="auth-visual">
        <div className="auth-brand">
          <IconBrand large />
          <div>
            <div className="brand-word" style={{ fontSize: 21 }}>Haven</div>
            <div className="brand-sub" style={{ color: 'rgba(24,24,24,.6)' }}>Campus living, considered</div>
          </div>
        </div>

        <div className="auth-copy">
          <div className="auth-kicker">Smart Campus Housing</div>
          <h1>
            Find your<br />
            <em style={{ fontStyle: 'normal', color: '#fff' }}>right room.</em>
          </h1>
          <p>
            A smart, algorithmic hostel allocation system designed for university students and hall administration. Check your room match score, manage preferences, and settle into campus with confidence.
          </p>
        </div>

        <div className="auth-quote">
          <strong>“The matching algorithm paired me with roommates who study during my exact hours.”</strong>
          <span style={{ display: 'block', marginTop: 3, opacity: 0.8 }}>— Victory Okafor, 300 Level Computer Science</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <div className="eyebrow">Smart Hostel Allocation Portal</div>
          <h2>{mode === 'sign-in' ? 'Sign in to Haven' : 'Create Student Account'}</h2>
          <p>
            {mode === 'sign-in'
              ? 'Use your university matriculation number or staff credentials.'
              : 'Register your university profile to enter this session’s allocation queue.'}
          </p>

          {forgotNotice && (
            <div className="notice" style={{ marginBottom: 16 }}>
              <Info size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              A reset link has been dispatched to your university student email portal.
            </div>
          )}

          <div className="auth-toggle">
            <button
              type="button"
              className={mode === 'sign-in' ? 'active' : ''}
              onClick={() => setMode('sign-in')}
              data-testid="button-auth-sign-in"
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === 'sign-up' ? 'active' : ''}
              onClick={() => setMode('sign-up')}
              data-testid="button-auth-sign-up"
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'sign-up' && (
              <div className="auth-field">
                <label htmlFor="full-name">Full Student Name</label>
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Victory Okafor"
                  data-testid="input-full-name"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="identifier">
                {mode === 'sign-in' ? 'Registration / Staff ID' : 'University Registration Number'}
              </label>
              <input
                id="identifier"
                autoComplete={mode === 'sign-in' ? 'username' : 'email'}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={mode === 'sign-in' ? 'CSC/22/1048 or admin@haven.edu' : 'CSC/22/1048'}
                data-testid="input-identifier"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                data-testid="input-password"
                required
              />
            </div>

            {mode === 'sign-in' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
                <button
                  type="button"
                  onClick={() => setForgotNotice(true)}
                  data-testid="button-forgot-password"
                  style={{ border: 0, background: 'transparent', color: '#a16f4a', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button className="btn btn-dark auth-submit" type="submit" data-testid="button-submit-auth">
              {mode === 'sign-in' ? 'Access Housing Portal' : 'Create Housing Profile'}
              <ArrowUpRight size={15} />
            </button>
          </form>

          <div className="demo-divider">Quick Demo Portals</div>

          <div className="demo-grid">
            <button
              type="button"
              className="demo-button"
              onClick={() => onEnter('student')}
              data-testid="button-demo-student"
            >
              <strong>Student Portal</strong>
              <span>Victory Okafor (CSC/22/1048)</span>
            </button>
            <button
              type="button"
              className="demo-button"
              onClick={() => onEnter('admin')}
              data-testid="button-demo-admin"
            >
              <strong>Admin Portal</strong>
              <span>Housing Administrator</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a2a6ac',
              fontSize: 10,
              marginTop: 22,
            }}
          >
            <ShieldCheck size={14} /> Institutional Student Housing Security
          </div>
        </div>
      </section>
    </div>
  );
}
