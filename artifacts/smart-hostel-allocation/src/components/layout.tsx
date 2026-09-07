import { useState, type ReactNode } from 'react';
import {
  Bell,
  Building2,
  Check,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
  BedDouble,
  ClipboardCheck,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  Users,
  Wrench,
  Cpu,
  Zap,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Role, AppNotification, Student } from '../types';
import { initialNotifications, student as defaultStudent } from '../data';

export function IconBrand({ large = false }: { large?: boolean }) {
  return (
    <div
      className="brand-mark"
      style={large ? { width: 44, height: 44, borderRadius: '14px 14px 14px 5px' } : undefined}
    >
      <Building2 size={large ? 22 : 19} strokeWidth={2.1} />
    </div>
  );
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('fail');
  return (
    <div 
      className="toast animate-slide-up" 
      data-testid="status-toast" 
      role="status" 
      aria-live="polite"
      style={{
        background: isError ? '#dc2626' : '#181818',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {isError ? <AlertTriangle size={16} color="#fca5a5" /> : <CheckCircle2 size={16} color="#a7f3d0" />}
      <span>{message}</span>
      <button
        aria-label="Dismiss notification"
        data-testid="button-dismiss-toast"
        onClick={onClose}
        style={{ background: 'transparent', color: '#fff', border: 0, marginLeft: 'auto', padding: 4, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function AppShell({
  role,
  children,
  onSignOut,
  toast,
  setToast,
  studentProfile = defaultStudent,
  notifications: propNotifications,
  setNotifications: propSetNotifications,
  onOpenSupabaseModal,
}: {
  role: Role;
  children: ReactNode;
  onSignOut: () => void;
  toast: string;
  setToast: (value: string) => void;
  studentProfile?: Student;
  notifications?: AppNotification[];
  setNotifications?: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onOpenSupabaseModal?: () => void;
}) {
  const [location, setLocation] = useLocation();
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(initialNotifications);
  const notifications = propNotifications ?? localNotifications;
  const setNotifications = propSetNotifications ?? setLocalNotifications;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const studentNav = [
    { href: '/student', label: 'Overview', icon: LayoutDashboard },
    { href: '/student/profile', label: 'My profile', icon: User },
    { href: '/student/rooms', label: 'Find a room', icon: BedDouble },
    { href: '/student/roommates', label: 'Roommate pairing', icon: Users },
    { href: '/student/payments', label: 'Fee payment', icon: CreditCard },
    { href: '/student/maintenance', label: 'Room issues', icon: Wrench },
    { href: '/student/preferences', label: 'My preferences', icon: SlidersHorizontal },
  ];

  const adminNav = [
    { href: '/admin', label: 'Operations', icon: LayoutDashboard },
    { href: '/admin/batch-allocation', label: 'Batch allocation', icon: Cpu },
    { href: '/admin/payments', label: 'Fee verification', icon: CreditCard },
    { href: '/admin/floor-plan', label: 'Floor plan', icon: Layers },
    { href: '/admin/maintenance', label: 'Maintenance desk', icon: Wrench },
    { href: '/admin/requests', label: 'Allocation requests', icon: ClipboardCheck },
  ];

  const nav = role === 'student' ? studentNav : adminNav;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToast('All notifications marked as read.');
  };


  return (
    <div className="app-shell" data-testid={`shell-${role}`}>
      <div style={{ display: 'flex', minHeight: '100dvh' }}>
        {/* Desktop Sidebar */}
        <aside className="sidebar" aria-label="Main Navigation">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 9px', flexShrink: 0 }}>
            <IconBrand />
            <div>
              <div className="brand-word">Haven</div>
              <div className="brand-sub">Hostel Allocation</div>
            </div>
          </div>

          <div className="sidebar-label" style={{ flexShrink: 0 }}>
            {role === 'student' ? 'Student Workspace' : 'Housing Operations'}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }} aria-label="Workspace links">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`sidebar-link ${location === href ? 'active' : ''}`}
                data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
                {label === 'Allocation requests' && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      font: '700 9px var(--app-font-mono)',
                      background: '#f4c59e',
                      color: '#181818',
                      borderRadius: 99,
                      padding: '3px 6px',
                    }}
                  >
                    6
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="sidebar-label" style={{ flexShrink: 0 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
            <button
              className="sidebar-link"
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setToast(role === 'student' ? 'Checked notifications. All items current.' : '3 allocation decisions pending review.');
              }}
              data-testid="button-sidebar-notifications"
            >
              <Bell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 ? (
                <span
                  style={{
                    marginLeft: 'auto',
                    font: '700 9px var(--app-font-mono)',
                    background: '#e59d6c',
                    color: '#181818',
                    borderRadius: 99,
                    padding: '2px 5px',
                  }}
                >
                  {unreadCount}
                </span>
              ) : (
                <span style={{ width: 6, height: 6, background: '#e7a775', borderRadius: 99, marginLeft: 'auto' }} />
              )}
            </button>
            <button
              className="sidebar-link"
              onClick={() => setShowHelpModal(true)}
              data-testid="button-sidebar-help"
            >
              <HelpCircle size={16} />
              <span>Hostel guide</span>
            </button>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 16, flexShrink: 0 }}>
            <div style={{ background: '#f8eee6', borderRadius: 15, padding: 14 }}>
              <Sparkles size={16} color="#b87f55" />
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10 }}>2026/2027 Session</div>
              <div style={{ fontSize: 10, color: '#98775e', lineHeight: 1.45, marginTop: 4 }}>
                {role === 'student' ? 'Room B-214 allocated.' : 'Floor plan & match algorithms active.'}
              </div>
            </div>

            <button
              className="sidebar-link"
              onClick={onSignOut}
              data-testid="button-sign-out"
              style={{ marginTop: 10, color: '#a14b43' }}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 60, padding: 0, justifyContent: 'flex-start', alignItems: 'stretch' }}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              style={{
                width: 280,
                maxWidth: '85vw',
                background: '#fff',
                height: '100%',
                padding: '24px 18px 32px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IconBrand />
                  <div>
                    <div className="brand-word">Haven</div>
                    <div className="brand-sub">Hostel Allocation</div>
                  </div>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close menu"
                  style={{ width: 32, height: 32 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="user-chip" style={{ display: 'flex', marginBottom: 20 }}>
                <div
                  className={`avatar ${role === 'admin' ? 'dark' : 'peach'}`}
                  style={{ overflow: 'hidden', padding: 0, display: 'grid', placeItems: 'center' }}
                >
                  {role === 'student' ? (
                    studentProfile.avatarUrl ? (
                      <img
                        src={studentProfile.avatarUrl}
                        alt={studentProfile.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      studentProfile.initials
                    )
                  ) : (
                    'KA'
                  )}
                </div>
                <div>
                  <div className="user-chip-name">{role === 'student' ? studentProfile.name : 'Kemi Adebayo'}</div>
                  <div className="user-chip-role">{role === 'student' ? studentProfile.regNo : 'Housing Admin'}</div>
                </div>
              </div>

              <div className="sidebar-label" style={{ margin: '12px 4px 6px' }}>Navigation</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {nav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`sidebar-link ${location === href ? 'active' : ''}`}
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <div className="sidebar-label" style={{ margin: '20px 4px 6px' }}>Support & Info</div>
              <button
                className="sidebar-link"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowHelpModal(true);
                }}
              >
                <HelpCircle size={16} />
                <span>Hostel rules & FAQ</span>
              </button>

              <button
                className="sidebar-link"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onSignOut();
                }}
                style={{ marginTop: 'auto', color: '#a14b43' }}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="main-panel">
          <div className="content-max">
            <header className="topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <button
                  className="icon-button mobile-menu"
                  aria-label="Open navigation drawer"
                  onClick={() => setMobileDrawerOpen(true)}
                  data-testid="button-mobile-menu"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <div className="eyebrow">{role === 'student' ? 'Student portal' : 'Housing operations'}</div>
                  <h1 className="page-title">
                    {role === 'student' ? `Good day, ${studentProfile.name.split(' ')[0]}` : 'Good day, Kemi'}
                  </h1>
                  <p className="page-subtitle">
                    {role === 'student'
                      ? 'Review your room allocation, roommates, and preferences.'
                      : 'Campus allocation queue, block capacity, and room decisions.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <button
                    className="icon-button"
                    aria-label="Open notifications"
                    onClick={() => setNotificationsOpen((value) => !value)}
                    data-testid="button-notifications"
                    style={{ position: 'relative' }}
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 16,
                          height: 16,
                          borderRadius: 99,
                          background: '#e59d6c',
                          color: '#181818',
                          fontSize: 9,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 3px',
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div
                      className="card animate-slide-up"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 46,
                        zIndex: 40,
                        width: 'min(360px, 92vw)',
                        padding: 16,
                        boxShadow: 'var(--shadow-lift)',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 14,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ fontSize: 13 }}>Notifications</strong>
                          {unreadCount > 0 && (
                            <span className="tag peach" style={{ fontSize: 9, padding: '2px 6px' }}>
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {unreadCount > 0 && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: 10, height: 24, padding: '0 6px' }}
                              onClick={handleMarkAllAsRead}
                              data-testid="button-mark-all-read"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            className="icon-button"
                            style={{ width: 24, height: 24 }}
                            onClick={() => setNotificationsOpen(false)}
                            data-testid="button-close-notifications"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 11, color: '#888' }}>
                            No notifications at this time.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              style={{
                                display: 'flex',
                                gap: 10,
                                fontSize: 11,
                                lineHeight: 1.4,
                                padding: 8,
                                borderRadius: 8,
                                background: notif.read ? 'transparent' : '#fefaf6',
                                border: notif.read ? '1px solid transparent' : '1px solid #fae7d9',
                                cursor: notif.actionUrl ? 'pointer' : 'default',
                                transition: 'background 0.15s ease',
                              }}
                              onClick={() => {
                                setNotifications((prev) =>
                                  prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                                );
                                if (notif.actionUrl) {
                                  setLocation(notif.actionUrl);
                                  setNotificationsOpen(false);
                                }
                              }}
                            >
                              <div
                                className={`avatar ${
                                  notif.type === 'payment_approved'
                                    ? 'sage'
                                    : notif.type === 'payment_rejected'
                                    ? 'peach'
                                    : notif.type === 'roommate_match'
                                    ? ''
                                    : 'sand'
                                }`}
                                style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}
                              >
                                {notif.type === 'payment_approved' ? (
                                  <CheckCircle2 size={14} color="#277f60" />
                                ) : notif.type === 'payment_rejected' ? (
                                  <AlertTriangle size={14} color="#b91c1c" />
                                ) : notif.type === 'roommate_match' ? (
                                  <Users size={14} color="#b26829" />
                                ) : (
                                  <Sparkles size={14} color="#888" />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <strong style={{ color: '#181818', fontSize: 11 }}>{notif.title}</strong>
                                  {!notif.read && (
                                    <span style={{ width: 6, height: 6, borderRadius: 99, background: '#e59d6c', flexShrink: 0, marginTop: 4 }} />
                                  )}
                                </div>
                                <div style={{ color: '#555', fontSize: 10, marginTop: 2 }}>{notif.message}</div>
                                <div style={{ color: '#999', fontSize: 9, marginTop: 4 }}>{notif.timestamp}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="user-chip user-chip-button"
                  onClick={() => {
                    if (role === 'student') {
                      setLocation('/student/profile');
                      setToast('Opened your verified student profile and preferences.');
                    } else {
                      setToast('Logged in as Housing Administrator (Kemi Adebayo).');
                    }
                  }}
                  title={role === 'student' ? 'Click to view student profile & housing criteria' : 'Housing Operations Admin'}
                  data-testid="button-header-user-chip"
                  aria-label={role === 'student' ? 'Open student profile' : 'Housing administrator profile'}
                >
                  <div>
                    <div className="user-chip-name">{role === 'student' ? studentProfile.name : 'Kemi Adebayo'}</div>
                    <div className="user-chip-role">{role === 'student' ? studentProfile.regNo : 'Housing Administrator'}</div>
                  </div>
                  <div
                    className={`avatar ${role === 'admin' ? 'dark' : 'peach'}`}
                    style={{ overflow: 'hidden', padding: 0, display: 'grid', placeItems: 'center' }}
                  >
                    {role === 'student' ? (
                      studentProfile.avatarUrl ? (
                        <img
                          src={studentProfile.avatarUrl}
                          alt={studentProfile.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        studentProfile.initials
                      )
                    ) : (
                      'KA'
                    )}
                  </div>
                </button>
              </div>
            </header>

            <div key={location} className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation bar">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={location === href ? 'active' : ''}
            data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}
          >
            <Icon size={17} />
            <span>
              {label === 'Allocation requests'
                ? 'Requests'
                : label === 'Find a room'
                ? 'Rooms'
                : label === 'Roommate pairing'
                ? 'Roommates'
                : label === 'Room issues'
                ? 'Issues'
                : label === 'My preferences'
                ? 'Prefs'
                : label === 'Batch allocation'
                ? 'Batch'
                : label === 'Maintenance desk'
                ? 'Repairs'
                : label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Help / Hostel Guide Modal */}
      {showHelpModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Hostel Guide</div>
                <h2>Campus Living FAQ</h2>
                <p>Rules, check-in instructions, and allocation policies.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowHelpModal(false)}
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: '#4a4f56', lineHeight: 1.55 }}>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 12 }}>
                <strong style={{ display: 'block', color: '#181818', marginBottom: 4 }}>How does smart room allocation work?</strong>
                Rooms are matched based on level, department compatibility, sleep & quiet-hour preferences, and verified payment clearance.
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 12 }}>
                <strong style={{ display: 'block', color: '#181818', marginBottom: 4 }}>Can I request a roommate?</strong>
                Yes! Provide their official student registration number in "My preferences". When both students cross-reference each other, the algorithm pairs them into available double or quad rooms.
              </div>
              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 12 }}>
                <strong style={{ display: 'block', color: '#181818', marginBottom: 4 }}>When is move-in day?</strong>
                Official check-in commences September 8, 2026. Bring your digital allocation slip and student ID card to the hall warden office.
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-dark" onClick={() => setShowHelpModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
