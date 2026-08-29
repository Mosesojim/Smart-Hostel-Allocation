import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Bell,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  DoorOpen,
  FileText,
  Filter,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Link, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

type Role = 'student' | 'admin';
type AllocationStatus = 'Allocated' | 'Pending review' | 'Waitlisted';
type PaymentStatus = 'Cleared' | 'Pending';
type RequestStatus = 'Pending' | 'Approved' | 'Flagged' | 'Review';
type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

type Student = {
  name: string; regNo: string; department: string; level: string; initials: string;
  allocationStatus: AllocationStatus; room: string; matchScore: number; paymentStatus: PaymentStatus;
};
type Preference = { roomType: string; floor: string; quietHours: string; roommateRegNo: string };
type Hostel = { name: string; block: string; location: string; price: number; capacity: number; available: number; amenities: string[]; accent: string };
type Room = { number: string; floor: number; status: RoomStatus; type: string };
type AllocationRequest = { id: string; student: Student; department: string; matchScore: number; room: string; status: RequestStatus };

const student: Student = {
  name: 'Amara Okafor', regNo: 'CSC/22/1048', department: 'Computer Science', level: '300 level',
  initials: 'AO', allocationStatus: 'Allocated', room: 'B-214', matchScore: 94, paymentStatus: 'Cleared',
};

const initialPreference: Preference = {
  roomType: 'Double room', floor: '2nd floor', quietHours: '10:00 pm – 6:00 am', roommateRegNo: 'CSC/22/1192',
};

const hostels: Hostel[] = [
  { name: 'Mango House', block: 'Block B', location: 'North campus · 4 min walk', price: 185000, capacity: 2, available: 8, amenities: ['Study desk', 'Wardrobe', 'Wi-Fi'], accent: 'peach' },
  { name: 'Aster Court', block: 'Block D', location: 'Central campus · 7 min walk', price: 215000, capacity: 2, available: 3, amenities: ['Ensuite', 'Study desk', 'Laundry'], accent: 'sage' },
  { name: 'The Lantern', block: 'Block A', location: 'East campus · 11 min walk', price: 145000, capacity: 4, available: 16, amenities: ['Shared kitchen', 'Courtyard', 'Wi-Fi'], accent: 'sand' },
];

const rooms: Room[] = [
  { number: 'A-101', floor: 1, status: 'Available', type: 'Double' }, { number: 'A-102', floor: 1, status: 'Occupied', type: 'Double' },
  { number: 'A-103', floor: 1, status: 'Maintenance', type: 'Single' }, { number: 'A-104', floor: 1, status: 'Available', type: 'Double' },
  { number: 'A-105', floor: 1, status: 'Occupied', type: 'Double' }, { number: 'A-201', floor: 2, status: 'Available', type: 'Double' },
  { number: 'A-202', floor: 2, status: 'Occupied', type: 'Single' }, { number: 'A-203', floor: 2, status: 'Available', type: 'Double' },
  { number: 'A-204', floor: 2, status: 'Occupied', type: 'Double' }, { number: 'A-205', floor: 2, status: 'Available', type: 'Single' },
  { number: 'A-301', floor: 3, status: 'Occupied', type: 'Double' }, { number: 'A-302', floor: 3, status: 'Available', type: 'Double' },
  { number: 'A-303', floor: 3, status: 'Maintenance', type: 'Single' }, { number: 'A-304', floor: 3, status: 'Occupied', type: 'Double' },
  { number: 'A-305', floor: 3, status: 'Available', type: 'Double' },
];

const initialRequests: AllocationRequest[] = [
  { id: 'req-1', student: { ...student, name: 'Daniel Mensah', initials: 'DM', regNo: 'EEE/21/0881', department: 'Electrical Engineering', level: '400 level', room: '—', allocationStatus: 'Pending review', matchScore: 91, paymentStatus: 'Cleared' }, department: 'Electrical Engineering', matchScore: 91, room: 'A-204', status: 'Pending' },
  { id: 'req-2', student: { ...student, name: 'Zainab Bello', initials: 'ZB', regNo: 'LIT/23/0314', department: 'English & Literary Studies', level: '200 level', room: '—', allocationStatus: 'Pending review', matchScore: 87, paymentStatus: 'Cleared' }, department: 'English & Literary Studies', matchScore: 87, room: 'A-201', status: 'Pending' },
  { id: 'req-3', student: { ...student, name: 'Ifeanyi Nwosu', initials: 'IN', regNo: 'MEC/22/0556', department: 'Mechanical Engineering', level: '300 level', room: 'B-110', allocationStatus: 'Allocated', matchScore: 78, paymentStatus: 'Pending' }, department: 'Mechanical Engineering', matchScore: 78, room: 'B-110', status: 'Review' },
  { id: 'req-4', student: { ...student, name: 'Nadia Yusuf', initials: 'NY', regNo: 'MED/21/0142', department: 'Medicine & Surgery', level: '500 level', room: '—', allocationStatus: 'Pending review', matchScore: 73, paymentStatus: 'Cleared' }, department: 'Medicine & Surgery', matchScore: 73, room: 'A-103', status: 'Flagged' },
  { id: 'req-5', student: { ...student, name: 'Chisom Eze', initials: 'CE', regNo: 'ARC/23/1107', department: 'Architecture', level: '200 level', room: '—', allocationStatus: 'Pending review', matchScore: 84, paymentStatus: 'Cleared' }, department: 'Architecture', matchScore: 84, room: 'A-205', status: 'Pending' },
];

const queryClient = new QueryClient();

function IconBrand({ large = false }: { large?: boolean }) {
  return <div className="brand-mark" style={large ? { width: 44, height: 44, borderRadius: '14px 14px 14px 5px' } : undefined}><Building2 size={large ? 22 : 19} strokeWidth={2.1} /></div>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast" data-testid="status-toast">{message}<button aria-label="Dismiss notification" data-testid="button-dismiss-toast" onClick={onClose} style={{ background: 'transparent', color: '#fff', border: 0, marginLeft: 12, padding: 0 }}><X size={13} /></button></div>;
}

function AppShell({ role, children, onSignOut, toast, setToast }: { role: Role; children: ReactNode; onSignOut: () => void; toast: string; setToast: (value: string) => void }) {
  const [location] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const studentNav = [
    { href: '/student', label: 'Overview', icon: LayoutDashboard },
    { href: '/student/rooms', label: 'Find a room', icon: BedDouble },
    { href: '/student/preferences', label: 'My preferences', icon: SlidersHorizontal },
  ];
  const adminNav = [
    { href: '/admin', label: 'Operations', icon: LayoutDashboard },
    { href: '/admin/floor-plan', label: 'Floor plan', icon: Building2 },
    { href: '/admin/requests', label: 'Allocation requests', icon: ClipboardCheck },
  ];
  const nav = role === 'student' ? studentNav : adminNav;
  return (
    <div className="app-shell" data-testid={`shell-${role}`}>
      <div style={{ display: 'flex', minHeight: '100dvh' }}>
        <aside className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 9px' }}>
            <IconBrand />
            <div><div className="brand-word">Haven</div><div className="brand-sub">Campus living</div></div>
          </div>
          <div className="sidebar-label">{role === 'student' ? 'Your space' : 'Workspace'}</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {nav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`sidebar-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon size={16} strokeWidth={2} /><span>{label}</span>
                {label === 'Allocation requests' && <span style={{ marginLeft: 'auto', font: '700 9px var(--app-font-mono)', background: '#f4c59e', color: '#181818', borderRadius: 99, padding: '3px 6px' }}>12</span>}
              </Link>
            ))}
          </nav>
          <div className="sidebar-label">Stay informed</div>
          <button className="sidebar-link" onClick={() => { setNotificationsOpen(true); setToast('You are all caught up.'); }} data-testid="button-sidebar-notifications"><Bell size={16} /><span>Notifications</span><span style={{ width: 6, height: 6, background: '#e7a775', borderRadius: 99, marginLeft: 'auto' }} /></button>
          <button className="sidebar-link" onClick={() => setToast('Settings are saved locally in this prototype.')} data-testid="button-sidebar-settings"><Settings size={16} /><span>Settings</span></button>
          <div style={{ marginTop: 'auto', background: '#f8eee6', borderRadius: 15, padding: 14 }}>
            <Sparkles size={16} color="#b87f55" />
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10 }}>A calmer allocation day</div>
            <div style={{ fontSize: 10, color: '#98775e', lineHeight: 1.45, marginTop: 4 }}>One clear next step at a time.</div>
          </div>
          <button className="sidebar-link" onClick={onSignOut} data-testid="button-sign-out" style={{ marginTop: 12 }}><LogOut size={16} /><span>Sign out</span></button>
        </aside>
        <main className="main-panel">
          <div className="content-max">
            <header className="topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setToast('Use the bottom navigation to move around.')} data-testid="button-mobile-menu"><Menu size={18} /></button>
                <div><div className="eyebrow">{role === 'student' ? 'Student portal' : 'Housing operations'}</div><h1 className="page-title">{role === 'student' ? 'Good morning, Amara' : 'Good morning, Kemi'}</h1><p className="page-subtitle">{role === 'student' ? 'Let’s make your next stay feel like home.' : 'Here’s the shape of today’s allocation queue.'}</p></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <button className="icon-button" aria-label="Open notifications" onClick={() => setNotificationsOpen((value) => !value)} data-testid="button-notifications"><Bell size={17} />{role === 'student' && <span style={{ position: 'absolute', top: 8, right: 8, width: 5, height: 5, borderRadius: 99, background: '#e59d6c' }} />}</button>
                  {notificationsOpen && <div className="card" style={{ position: 'absolute', right: 0, top: 46, zIndex: 20, width: 245, padding: 15 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ fontSize: 12 }}>Notifications</strong><button className="icon-button" style={{ width: 25, height: 25 }} onClick={() => setNotificationsOpen(false)} data-testid="button-close-notifications"><X size={13} /></button></div><div style={{ marginTop: 12, display: 'flex', gap: 9, fontSize: 10, lineHeight: 1.45 }}><div className="avatar sage" style={{ width: 24, height: 24, borderRadius: 8 }}><Check size={12} /></div><span><strong>{role === 'student' ? 'Your payment is verified.' : '5 requests need review.'}</strong><br /><span style={{ color: '#999' }}>Just now</span></span></div></div>}
                </div>
                <div className="user-chip"><div><div className="user-chip-name">{role === 'student' ? 'Amara Okafor' : 'Kemi Adebayo'}</div><div className="user-chip-role">{role === 'student' ? 'CSC/22/1048' : 'Housing admin'}</div></div><div className={`avatar ${role === 'admin' ? 'dark' : ''}`}>{role === 'student' ? 'AO' : 'KA'}</div></div>
              </div>
            </header>
            {children}
          </div>
        </main>
      </div>
      <nav className="mobile-bottom-nav">
        {nav.slice(0, 3).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={location === href ? 'active' : ''} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={18} /><span>{label === 'Allocation requests' ? 'Requests' : label === 'Find a room' ? 'Rooms' : label}</span></Link>)}
      </nav>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

function AuthPage({ onEnter }: { onEnter: (role: Role) => void }) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); onEnter(identifier.toLowerCase().includes('admin') ? 'admin' : 'student'); };
  return (
    <div className="auth-page" data-testid="page-auth">
      <section className="auth-visual">
        <div className="auth-brand"><IconBrand large /><div><div className="brand-word" style={{ fontSize: 21 }}>Haven</div><div className="brand-sub" style={{ color: 'rgba(24,24,24,.6)' }}>Campus living, considered</div></div></div>
        <div className="auth-copy"><div className="auth-kicker">The room to grow</div><h1>Find your<br /><em style={{ fontStyle: 'normal', color: '#fff' }}>right place.</em></h1><p>A thoughtful home base for the years that shape you. Check your allocation, share your preferences, and settle in with confidence.</p></div>
        <div className="auth-quote"><strong>“The first night felt easy.”</strong> — Adaeze, 400 level Medicine</div>
      </section>
      <section className="auth-panel">
        <div className="auth-box">
          <div className="eyebrow">Welcome back</div><h2>{mode === 'sign-in' ? 'Sign in to Haven' : 'Create your Haven account'}</h2><p>{mode === 'sign-in' ? 'Use your school credentials to continue where you left off.' : 'A few details, then we’ll help you find your fit.'}</p>
          <div className="auth-toggle"><button className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')} data-testid="button-auth-sign-in">Sign in</button><button className={mode === 'sign-up' ? 'active' : ''} onClick={() => setMode('sign-up')} data-testid="button-auth-sign-up">Sign up</button></div>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'sign-up' && <div className="auth-field"><label htmlFor="full-name">Full name</label><input id="full-name" placeholder="e.g. Amara Okafor" data-testid="input-full-name" required /></div>}
            <div className="auth-field"><label htmlFor="identifier">{mode === 'sign-in' ? 'School email or registration number' : 'School email'}</label><input id="identifier" autoComplete={mode === 'sign-in' ? 'username' : 'email'} value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={mode === 'sign-in' ? 'CSC/22/1048' : 'you@university.edu'} data-testid="input-identifier" required /></div>
            <div className="auth-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" data-testid="input-password" required /></div>
            {mode === 'sign-in' && <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -5 }}><button type="button" onClick={() => window.alert('Password reset link requested.')} data-testid="button-forgot-password" style={{ border: 0, background: 'transparent', color: '#a16f4a', fontSize: 10, fontWeight: 700 }}>Forgot password?</button></div>}
            <button className="btn btn-dark auth-submit" type="submit" data-testid="button-submit-auth">{mode === 'sign-in' ? 'Continue to Haven' : 'Create account'}<ArrowUpRight size={15} /></button>
          </form>
          <div className="demo-divider">or explore a demo</div>
          <div className="demo-grid"><button className="demo-button" onClick={() => onEnter('student')} data-testid="button-demo-student"><strong>Student demo</strong><span>See your allocation journey</span></button><button className="demo-button" onClick={() => onEnter('admin')} data-testid="button-demo-admin"><strong>Admin demo</strong><span>Review the live queue</span></button></div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', color: '#a2a6ac', fontSize: 10, marginTop: 22 }}><ShieldCheck size={13} /> Your information stays private and secure</div>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: RequestStatus | AllocationStatus | PaymentStatus }) {
  const normalized = status.toLowerCase().replace(' ', '-');
  return <span className={`status ${normalized === 'approved' || normalized === 'allocated' || normalized === 'cleared' ? 'approved' : normalized === 'flagged' ? 'flagged' : normalized === 'pending-review' || normalized === 'pending' ? 'pending' : 'review'}`} data-testid={`status-${normalized}`}>{status}</span>;
}

function StudentPortal({ preference, setPreference, onToast }: { preference: Preference; setPreference: (value: Preference) => void; onToast: (message: string) => void }) {
  const [modal, setModal] = useState<'preferences' | 'room' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Hostel | null>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(preference);
  const openPreferences = () => { setForm(preference); setModal('preferences'); };
  const savePreferences = (event: FormEvent) => { event.preventDefault(); setPreference(form); setModal(null); setSaved(true); onToast('Preferences saved. Your matches are updated.'); setTimeout(() => setSaved(false), 2500); };
  return (
    <div data-testid="page-student">
      <div className="stat-grid reveal">
        <div className="card stat-card dark-card"><span className="stat-label">Allocation status</span><strong className="stat-number" style={{ fontSize: 21, letterSpacing: '-.05em' }}>Allocated</strong><span className="stat-foot"><Check size={12} color="#a8e6cf" /> Confirmed for 2024/25</span></div>
        <div className="card stat-card"><span className="stat-label">Your match score</span><strong className="stat-number">94<span style={{ fontSize: 16 }}>%</span></strong><span className="stat-foot"><span className="trend-up">+8 pts</span> from your first match</span></div>
        <div className="card stat-card sage-card"><span className="stat-label">Payment status</span><strong className="stat-number" style={{ fontSize: 21 }}>Cleared</strong><span className="stat-foot"><WalletCards size={12} /> Receipt #HV-2841</span></div>
        <div className="card stat-card"><span className="stat-label">Move-in day</span><strong className="stat-number" style={{ fontSize: 23 }}>Sep 08</strong><span className="stat-foot"><Clock3 size={12} /> 24 days to go</span></div>
      </div>
      <div className="dashboard-grid">
        <section className="allocation-banner reveal delay-1"><div className="banner-kicker">Your allocation is ready</div><h2 className="banner-title">A good room makes a difference.</h2><p className="banner-copy">We found a quiet, sunlit room close to your department — with a roommate who shares your study hours.</p><div className="banner-bottom"><div className="room-code">Mango House · B-214</div><button className="btn btn-dark btn-sm" onClick={() => { setSelectedRoom(hostels[0]); setModal('room'); }} data-testid="button-view-allocation">View room <ChevronRight size={13} /></button></div><div className="progress-ring"><span className="progress-value">94%</span></div></section>
        <section className="card card-pad reveal delay-2"><div className="section-heading"><div><h2>Allocation journey</h2><p>One step at a time</p></div><span className="tag sage">On track</span></div><div className="timeline"><div className="timeline-row done"><div className="timeline-dot"><Check size={12} /></div><div className="timeline-content"><strong>Application submitted</strong><span>Aug 02 · Complete</span></div></div><div className="timeline-row done"><div className="timeline-dot"><Check size={12} /></div><div className="timeline-content"><strong>Payment verified</strong><span>Aug 05 · Complete</span></div></div><div className="timeline-row current"><div className="timeline-dot"><Home size={11} /></div><div className="timeline-content"><strong>Room allocated</strong><span>Today · B-214 is yours</span></div></div><div className="timeline-row"><div className="timeline-dot"><DoorOpen size={11} /></div><div className="timeline-content"><strong>Move-in day</strong><span>Sep 08 · See you there</span></div></div></div></section>
      </div>
      <div className="two-col">
        <section className="card card-pad reveal delay-2"><div className="section-heading"><div><h2>Rooms that fit your life</h2><p>Based on your preferences · updated just now</p></div><Link href="/student/rooms" className="btn btn-ghost btn-sm" data-testid="link-see-all-rooms">See all <ArrowUpRight size={13} /></Link></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10 }}>{hostels.map((hostel) => <RoomCard key={hostel.name} hostel={hostel} onSelect={() => { setSelectedRoom(hostel); setModal('room'); }} onSave={() => onToast(`${hostel.name} added to your shortlist.`)} />)}</div></section>
        <section className="card card-pad reveal delay-3"><div className="section-heading"><div><h2>Your preferences</h2><p>We use these to find your fit</p></div><button className="icon-button" onClick={openPreferences} aria-label="Edit preferences" data-testid="button-edit-preferences"><Settings size={15} /></button></div>{saved && <div className="notice" style={{ marginBottom: 12 }}>Preferences updated. Your recommendations will reflect this shortly.</div>}<div className="preference-list"><div className="preference-item"><small>Room type</small><strong>{preference.roomType}</strong></div><div className="preference-item"><small>Preferred floor</small><strong>{preference.floor}</strong></div><div className="preference-item"><small>Quiet hours</small><strong>{preference.quietHours}</strong></div><div className="preference-item"><small>Roommate</small><strong>{preference.roommateRegNo}</strong></div></div><button className="btn btn-dark" onClick={openPreferences} data-testid="button-update-preferences" style={{ width: '100%', marginTop: 14 }}>Update preferences <SlidersHorizontal size={14} /></button></section>
      </div>
      {modal === 'preferences' && <PreferenceModal form={form} setForm={setForm} onClose={() => setModal(null)} onSave={savePreferences} />}
      {modal === 'room' && selectedRoom && <RoomModal hostel={selectedRoom} onClose={() => setModal(null)} onToast={onToast} />}
    </div>
  );
}

function RoomCard({ hostel, onSelect, onSave }: { hostel: Hostel; onSelect: () => void; onSave: () => void }) {
  return <article className="room-card" data-testid={`card-hostel-${hostel.name.toLowerCase().replaceAll(' ', '-')}`}><div className="room-top"><div><div className="room-number">{hostel.block}</div><div className="room-hostel">{hostel.name}</div></div><button className="icon-button" style={{ width: 28, height: 28 }} aria-label={`Save ${hostel.name}`} onClick={onSave} data-testid={`button-save-hostel-${hostel.block}`}><Heart size={14} /></button></div><div className="room-illustration" style={{ background: hostel.accent === 'sage' ? '#eef6f1' : hostel.accent === 'sand' ? '#faf6ed' : '#f7f0e9' }} /><div className="room-meta"><div><div className="room-price">₦{hostel.price.toLocaleString()} <span>/ session</span></div><div className="mini-meta"><span className="tag">{hostel.capacity} sharing</span><span className="tag sage">{hostel.available} left</span></div></div><div className="match-score"><small>fit score</small>{hostel.name === 'Mango House' ? '94%' : hostel.name === 'Aster Court' ? '88%' : '81%'}</div></div><button className="btn btn-ghost btn-sm" onClick={onSelect} data-testid={`button-view-hostel-${hostel.block}`} style={{ width: '100%', marginTop: 15 }}>View details <ChevronRight size={13} /></button></article>;
}

function PreferenceModal({ form, setForm, onClose, onSave }: { form: Preference; setForm: (value: Preference) => void; onClose: () => void; onSave: (event: FormEvent) => void }) {
  return <div className="modal-backdrop" role="presentation"><form className="modal" onSubmit={onSave} data-testid="modal-preferences"><div className="modal-head"><div><div className="eyebrow">Make it yours</div><h2>Room preferences</h2><p>We’ll use these signals to refine your recommendations.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close preferences" data-testid="button-close-preferences"><X size={16} /></button></div><div className="form-grid"><div className="field"><label htmlFor="room-type">Room type</label><select id="room-type" value={form.roomType} onChange={(event) => setForm({ ...form, roomType: event.target.value })} data-testid="select-room-type"><option>Single room</option><option>Double room</option><option>Four-person room</option></select></div><div className="field"><label htmlFor="floor">Preferred floor</label><select id="floor" value={form.floor} onChange={(event) => setForm({ ...form, floor: event.target.value })} data-testid="select-floor"><option>Ground floor</option><option>1st floor</option><option>2nd floor</option><option>3rd floor</option></select></div><div className="field full"><label htmlFor="quiet-hours">Quiet hours</label><select id="quiet-hours" value={form.quietHours} onChange={(event) => setForm({ ...form, quietHours: event.target.value })} data-testid="select-quiet-hours"><option>9:00 pm – 5:00 am</option><option>10:00 pm – 6:00 am</option><option>11:00 pm – 7:00 am</option></select></div><div className="field full"><label htmlFor="roommate-reg">Preferred roommate registration number</label><input id="roommate-reg" value={form.roommateRegNo} onChange={(event) => setForm({ ...form, roommateRegNo: event.target.value })} data-testid="input-roommate-reg" /></div></div><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-preferences">Cancel</button><button type="submit" className="btn btn-dark" data-testid="button-save-preferences">Save preferences <Check size={14} /></button></div></form></div>;
}

function RoomModal({ hostel, onClose, onToast }: { hostel: Hostel; onClose: () => void; onToast: (message: string) => void }) {
  return <div className="modal-backdrop"><div className="modal" data-testid="modal-room-details"><div className="modal-head"><div><div className="eyebrow">{hostel.block} · {hostel.location}</div><h2>{hostel.name}</h2><p>A bright, practical room with space for your best work.</p></div><button className="icon-button" onClick={onClose} aria-label="Close room details" data-testid="button-close-room"><X size={16} /></button></div><div className="room-illustration" style={{ height: 135, background: hostel.accent === 'sage' ? '#eef6f1' : '#f7f0e9' }} /><div className="preference-list"><div className="preference-item"><small>Session fee</small><strong>₦{hostel.price.toLocaleString()}</strong></div><div className="preference-item"><small>Availability</small><strong>{hostel.available} rooms open</strong></div></div><div className="mini-meta">{hostel.amenities.map((item) => <span className="tag sage" key={item}>{item}</span>)}</div><div className="modal-actions"><button className="btn btn-ghost" onClick={onClose} data-testid="button-back-room-details">Maybe later</button><button className="btn btn-dark" onClick={() => { onToast(`${hostel.name} added to your shortlist.`); onClose(); }} data-testid="button-shortlist-room"><Heart size={14} /> Add to shortlist</button></div></div></div>;
}

function StudentRooms({ onToast }: { onToast: (message: string) => void }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All room types');
  const filtered = hostels.filter((hostel) => `${hostel.name} ${hostel.block}`.toLowerCase().includes(search.toLowerCase()) && (type === 'All room types' || (type === 'Double rooms' && hostel.capacity === 2) || (type === 'Four-person rooms' && hostel.capacity === 4)));
  return <div data-testid="page-student-rooms"><div className="card card-pad" style={{ marginBottom: 18, background: '#f4c59e', border: 0 }}><div className="eyebrow">Room discovery</div><h2 style={{ fontSize: 26, letterSpacing: '-.06em', margin: '8px 0 5px' }}>Somewhere you’ll do well.</h2><p style={{ color: '#765e4a', fontSize: 12, margin: 0 }}>Browse available rooms and compare what matters to you.</p></div><div className="toolbar"><div><div className="eyebrow">Available now</div><h2 style={{ fontSize: 20, margin: '5px 0 0', letterSpacing: '-.05em' }}>{filtered.length} places worth a look</h2></div><div className="filter-row"><div style={{ position: 'relative' }}><Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 11 }} /><input className="search-input" style={{ paddingLeft: 32 }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search blocks or hostels" data-testid="input-search-rooms" /></div><select className="select" value={type} onChange={(event) => setType(event.target.value)} data-testid="select-room-filter"><option>All room types</option><option>Double rooms</option><option>Four-person rooms</option></select></div></div>{filtered.length === 0 ? <div className="empty-state card" data-testid="empty-room-results"><div className="empty-state-mark"><Search size={19} /></div><strong>No rooms match that search</strong><p>Try a different block name or clear the room type filter.</p><button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setType('All room types'); }} data-testid="button-clear-room-filter">Clear filters</button></div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14 }}>{filtered.map((hostel) => <RoomCard key={hostel.name} hostel={hostel} onSelect={() => onToast(`${hostel.name} details selected.`)} onSave={() => onToast(`${hostel.name} added to your shortlist.`)} />)}</div>}<div className="notice" style={{ marginTop: 18 }}><CircleAlert size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Availability changes as students confirm their allocation. Your current allocation remains safe while you explore.</div></div>;
}

function StudentPreferences({ preference, setPreference, onToast }: { preference: Preference; setPreference: (value: Preference) => void; onToast: (message: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(preference);
  const save = (event: FormEvent) => { event.preventDefault(); setPreference(form); setEditing(false); onToast('Your preferences are up to date.'); };
  return <div data-testid="page-student-preferences"><div className="section-heading"><div><div className="eyebrow">Personal fit</div><h2 style={{ fontSize: 27, letterSpacing: '-.06em', marginTop: 6 }}>Preferences that sound like you.</h2><p>Small signals help us make a better room recommendation.</p></div><button className="btn btn-dark" onClick={() => { setForm(preference); setEditing(true); }} data-testid="button-edit-preferences-page"><Settings size={14} /> Edit preferences</button></div><div className="two-col"><section className="card card-pad"><div className="section-heading"><div><h2>Current preferences</h2><p>Last updated today at 9:42 am</p></div><span className="tag sage">Active</span></div><div className="preference-list">{Object.entries({ 'Room type': preference.roomType, 'Preferred floor': preference.floor, 'Quiet hours': preference.quietHours, 'Roommate': preference.roommateRegNo }).map(([label, value]) => <div className="preference-item" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="notice" style={{ marginTop: 17 }}>Your room was selected because it matches your quiet-hours preference and preferred floor.</div></section><section className="card card-pad" style={{ background: '#e7f5ef' }}><Sparkles size={20} color="#3d8469" /><h2 style={{ fontSize: 21, letterSpacing: '-.05em', margin: '18px 0 7px' }}>A little context goes a long way.</h2><p style={{ color: '#5a8777', fontSize: 12, lineHeight: 1.6, margin: 0 }}>We balance your preferences with availability, payment status, and the patterns that make shared living work well.</p><div style={{ borderTop: '1px solid rgba(58,130,101,.18)', paddingTop: 14, marginTop: 20, fontSize: 11, color: '#477762' }}><strong>Match signals used</strong><div className="mini-meta"><span className="tag sage">Sleep schedule</span><span className="tag sage">Room type</span><span className="tag sage">Location</span></div></div></section></div>{editing && <PreferenceModal form={form} setForm={setForm} onClose={() => setEditing(false)} onSave={save} />}</div>;
}

function AdminPortal({ onToast }: { onToast: (message: string) => void }) {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const filtered = useMemo(() => requests.filter((request) => `${request.student.name} ${request.student.regNo} ${request.department}`.toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'All statuses' || request.status === statusFilter)), [requests, query, statusFilter]);
  const updateRequest = (id: string, status: RequestStatus) => { setRequests((items) => items.map((item) => item.id === id ? { ...item, status } : item)); onToast(`Request ${status.toLowerCase()}. The queue is updated.`); };
  return <div data-testid="page-admin"><div className="stat-grid reveal"><div className="card stat-card dark-card"><span className="stat-label">Requests this cycle</span><strong className="stat-number">128</strong><span className="stat-foot"><span style={{ color: '#f4c59e' }}>+14</span> since Monday</span></div><div className="card stat-card"><span className="stat-label">Awaiting review</span><strong className="stat-number">{requests.filter((item) => item.status === 'Pending').length + 7}</strong><span className="stat-foot"><Clock3 size={12} /> Needs your attention</span></div><div className="card stat-card sage-card"><span className="stat-label">Allocated rooms</span><strong className="stat-number">86<span style={{ fontSize: 16 }}>%</span></strong><span className="stat-foot"><span className="trend-up">+6.4%</span> occupancy today</span></div><div className="card stat-card"><span className="stat-label">Open rooms</span><strong className="stat-number">24</strong><span className="stat-foot"><DoorOpen size={12} /> Across 4 hostels</span></div></div><div className="admin-grid"><section className="card card-pad reveal delay-1"><div className="section-heading"><div><div className="eyebrow">Allocation queue</div><h2 style={{ marginTop: 6 }}>Decisions waiting for you</h2><p>Review fit, room availability, and payment status together.</p></div><button className="btn btn-peach btn-sm" onClick={() => onToast('Allocation report prepared for download.')} data-testid="button-export-report"><FileText size={13} /> Export report</button></div><div className="toolbar"><div className="filter-row"><div style={{ position: 'relative' }}><Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 11 }} /><input className="search-input" style={{ paddingLeft: 32 }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students" data-testid="input-search-requests" /></div><select className="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} data-testid="select-status-filter"><option>All statuses</option><option>Pending</option><option>Approved</option><option>Flagged</option><option>Review</option></select></div><span className="tag">{filtered.length} shown</span></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Department</th><th>Fit score</th><th>Room</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead><tbody>{filtered.map((request) => <tr key={request.id} data-testid={`row-request-${request.id}`}><td><div className="student-cell"><div className={`avatar ${request.status === 'Approved' ? 'sage' : ''}`}>{request.student.initials}</div><div><div className="student-name">{request.student.name}</div><div className="student-reg">{request.student.regNo}</div></div></div></td><td>{request.department}</td><td><span className="score">{request.matchScore}%</span></td><td><span style={{ font: '700 10px var(--app-font-mono)', color: '#3f444b' }}>{request.room}</span><div style={{ color: '#a1a5ab', fontSize: 9, marginTop: 3 }}>{request.student.paymentStatus} payment</div></td><td><StatusPill status={request.status} /></td><td><div className="action-group">{request.status !== 'Approved' && <button className="btn btn-sage btn-sm" onClick={() => updateRequest(request.id, 'Approved')} data-testid={`button-approve-${request.id}`}><Check size={12} /> Approve</button>}<button className="btn btn-ghost btn-sm" onClick={() => onToast(`${request.student.name}'s room reassignment is ready to edit.`)} data-testid={`button-reassign-${request.id}`}>Reassign</button>{request.status !== 'Flagged' && <button className="btn btn-danger btn-sm" onClick={() => updateRequest(request.id, 'Flagged')} data-testid={`button-flag-${request.id}`}>Flag</button>}</div></td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="empty-state" style={{ marginTop: 12 }} data-testid="empty-request-results"><div className="empty-state-mark"><Filter size={18} /></div><strong>No requests found</strong><p>Try clearing one of the filters to see more of the queue.</p><button className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setStatusFilter('All statuses'); }} data-testid="button-clear-request-filters">Clear filters</button></div>}</section><section className="card card-pad reveal delay-2"><div className="section-heading"><div><div className="eyebrow">Live floor plan</div><h2 style={{ marginTop: 6 }}>Aster Court · Block A</h2><p>Click a room to inspect its allocation state.</p></div><Link href="/admin/floor-plan" className="icon-button" data-testid="link-open-floor-plan"><ArrowUpRight size={15} /></Link></div><FloorGrid selectedRoom={selectedRoom} onSelect={setSelectedRoom} compact />{selectedRoom ? <div className="side-note" style={{ marginTop: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div className="eyebrow">{selectedRoom.status}</div><h3 style={{ marginTop: 5 }}>{selectedRoom.number} · {selectedRoom.type} room</h3></div><button className="icon-button" style={{ width: 26, height: 26 }} onClick={() => setSelectedRoom(null)} data-testid="button-close-selected-room"><X size={13} /></button></div><p>{selectedRoom.status === 'Available' ? 'Ready to be paired with a student who fits.' : selectedRoom.status === 'Occupied' ? 'Currently assigned. No action needed.' : 'Maintenance hold. Keep out of this cycle.'}</p></div> : <div className="notice" style={{ marginTop: 14 }}>Select any room to see what action is needed.</div>}</section></div></div>;
}

function FloorGrid({ selectedRoom, onSelect, compact = false }: { selectedRoom: Room | null; onSelect: (room: Room) => void; compact?: boolean }) {
  const shownRooms = compact ? rooms.slice(0, 10) : rooms;
  return <div className="floor-map"><div className="floor-head"><strong>{compact ? 'Ground + first floor' : 'Block A · all floors'}</strong><span>{shownRooms.filter((room) => room.status === 'Available').length} available</span></div><div className="floor-grid">{shownRooms.map((room) => <button key={room.number} className={`floor-room ${room.status.toLowerCase()} ${selectedRoom?.number === room.number ? 'selected' : ''}`} onClick={() => onSelect(room)} data-testid={`button-floor-room-${room.number}`}><small>{room.number}</small><span>{room.status}</span></button>)}</div><div className="legend"><span><i /> Available</span><span><i className="occupied-dot" /> Occupied</span><span><i className="maintenance-dot" /> Maintenance</span></div></div>;
}

function AdminFloorPlan({ onToast }: { onToast: (message: string) => void }) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  return <div data-testid="page-admin-floor-plan"><div className="section-heading"><div><div className="eyebrow">Room inventory</div><h2 style={{ fontSize: 27, letterSpacing: '-.06em', marginTop: 6 }}>See the building at a glance.</h2><p>One clear floor plan for every allocation conversation.</p></div><button className="btn btn-peach" onClick={() => onToast('Floor plan exported as a PDF.')} data-testid="button-export-floor-plan"><FileText size={14} /> Export floor plan</button></div><div className="two-col"><section className="card card-pad"><FloorGrid selectedRoom={selectedRoom} onSelect={setSelectedRoom} /></section><section className="card card-pad">{selectedRoom ? <><div className="section-heading"><div><div className="eyebrow">Selected room</div><h2 style={{ marginTop: 6 }}>{selectedRoom.number}</h2><p>{selectedRoom.type} room · {selectedRoom.floor === 1 ? 'First' : selectedRoom.floor === 2 ? 'Second' : 'Third'} floor</p></div><button className="icon-button" onClick={() => setSelectedRoom(null)} data-testid="button-clear-floor-selection"><X size={14} /></button></div><StatusPill status={selectedRoom.status === 'Available' ? 'Pending' : selectedRoom.status === 'Occupied' ? 'Approved' : 'Flagged'} /><div className="notice" style={{ marginTop: 15 }}>{selectedRoom.status === 'Available' ? 'This room can be assigned now. Check the request queue for the strongest fit.' : selectedRoom.status === 'Occupied' ? 'This room is already assigned and should be excluded from new matching.' : 'Maintenance has placed a temporary hold on this room.'}</div><button className="btn btn-dark" onClick={() => onToast(`${selectedRoom.number} marked for follow-up.`)} data-testid="button-follow-up-room" style={{ width: '100%', marginTop: 15 }}>Mark for follow-up</button></> : <div className="empty-state" style={{ border: 0, background: 'transparent' }}><div className="empty-state-mark"><MapPin size={18} /></div><strong>Select a room</strong><p>Room details and the next recommended action will appear here.</p></div>}</section></div></div>;
}

function Router({ role, preference, setPreference, onToast, toast, setToast, onSignOut }: { role: Role; preference: Preference; setPreference: (value: Preference) => void; onToast: (message: string) => void; toast: string; setToast: (value: string) => void; onSignOut: () => void }) {
  const shell = (children: ReactNode) => <AppShell role={role} onSignOut={onSignOut} toast={toast} setToast={setToast}>{children}</AppShell>;
  return <ErrorBoundary resetKey={role}><Switch><Route path="/student">{shell(<StudentPortal preference={preference} setPreference={setPreference} onToast={onToast} />)}</Route><Route path="/student/rooms">{shell(<StudentRooms onToast={onToast} />)}</Route><Route path="/student/preferences">{shell(<StudentPreferences preference={preference} setPreference={setPreference} onToast={onToast} />)}</Route><Route path="/admin">{shell(<AdminPortal onToast={onToast} />)}</Route><Route path="/admin/floor-plan">{shell(<AdminFloorPlan onToast={onToast} />)}</Route><Route path="/admin/requests">{shell(<AdminPortal onToast={onToast} />)}</Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function AppContent() {
  const [role, setRole] = useState<Role | null>(null);
  const [location, setLocation] = useLocation();
  const [preference, setPreference] = useState(initialPreference);
  const [toast, setToast] = useState('');
  const enter = (nextRole: Role) => { setRole(nextRole); setLocation(nextRole === 'student' ? '/student' : '/admin'); };
  const signOut = () => { setRole(null); setLocation('/'); setToast(''); };
  if (!role || location === '/') return <AuthPage onEnter={enter} />;
  return <Router role={role} preference={preference} setPreference={setPreference} onToast={setToast} toast={toast} setToast={setToast} onSignOut={signOut} />;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppContent /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;