import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import {
  Role,
  Preference,
  AllocationRequest,
  Room,
  MaintenanceTicket,
  RoommateCandidate,
  PaymentReceipt,
  AppNotification,
  Student,
} from './types';
import {
  student as initialStudent,
  initialPreference,
  initialRequests,
  rooms as initialRooms,
  initialMaintenanceTickets,
  roommateCandidates as initialRoommates,
  initialPaymentReceipts,
  initialNotifications,
} from './data';
import { AppShell } from './components/layout';
import { AuthPage } from './pages/auth';
import { HomePage } from './pages/home';
import { StudentPortal, StudentRooms, StudentPreferences } from './pages/student';
import { AdminPortal, AdminFloorPlan } from './pages/admin';
import { StudentRoommates } from './pages/roommates';
import { StudentMaintenance, AdminMaintenance } from './pages/maintenance';
import { AdminBatchAllocation } from './pages/batch-allocation';
import { StudentPayments, AdminPayments } from './pages/payments';
import { StudentProfile } from './pages/profile';
import { SupabaseModal } from './components/supabase-modal';
import {
  dbGetStudent,
  dbSaveStudent,
  dbGetPreferences,
  dbSavePreferences,
  dbGetRooms,
  dbGetAllocationRequests,
  dbGetMaintenanceTickets,
  dbGetPaymentReceipts,
  dbGetNotifications,
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function Router({
  role,
  student,
  setStudent,
  preference,
  setPreference,
  requests,
  setRequests,
  rooms,
  setRooms,
  maintenanceTickets,
  setMaintenanceTickets,
  roommates,
  setRoommates,
  receipts,
  setReceipts,
  notifications,
  setNotifications,
  onToast,
  toast,
  setToast,
  onSignOut,
  onOpenSupabaseModal,
}: {
  role: Role;
  student: Student;
  setStudent: React.Dispatch<React.SetStateAction<Student>>;
  preference: Preference;
  setPreference: (value: Preference) => void;
  requests: AllocationRequest[];
  setRequests: React.Dispatch<React.SetStateAction<AllocationRequest[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  maintenanceTickets: MaintenanceTicket[];
  setMaintenanceTickets: React.Dispatch<React.SetStateAction<MaintenanceTicket[]>>;
  roommates: RoommateCandidate[];
  setRoommates: React.Dispatch<React.SetStateAction<RoommateCandidate[]>>;
  receipts: PaymentReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<PaymentReceipt[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onToast: (message: string) => void;
  toast: string;
  setToast: (value: string) => void;
  onSignOut: () => void;
  onOpenSupabaseModal: () => void;
}) {
  const addNotification = (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const shell = (children: ReactNode) => (
    <AppShell
      role={role}
      onSignOut={onSignOut}
      toast={toast}
      setToast={setToast}
      studentProfile={student}
      notifications={notifications}
      setNotifications={setNotifications}
      onOpenSupabaseModal={onOpenSupabaseModal}
    >
      {children}
    </AppShell>
  );

  return (
    <ErrorBoundary resetKey={role}>
      <Switch>
        {/* Student Routes */}
        <Route path="/student">
          {shell(<StudentPortal preference={preference} setPreference={setPreference} onToast={onToast} />)}
        </Route>
        <Route path="/student/profile">
          {shell(
            <StudentProfile
              student={student}
              setStudent={setStudent}
              preference={preference}
              setPreference={setPreference}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/student/rooms">
          {shell(<StudentRooms onToast={onToast} />)}
        </Route>
        <Route path="/student/roommates">
          {shell(
            <StudentRoommates
              preference={preference}
              setPreference={setPreference}
              roommates={roommates}
              setRoommates={setRoommates}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/student/payments">
          {shell(
            <StudentPayments
              receipts={receipts}
              setReceipts={setReceipts}
              onToast={onToast}
              onAddNotification={addNotification}
            />
          )}
        </Route>
        <Route path="/student/maintenance">
          {shell(
            <StudentMaintenance
              tickets={maintenanceTickets}
              setTickets={setMaintenanceTickets}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/student/preferences">
          {shell(<StudentPreferences preference={preference} setPreference={setPreference} onToast={onToast} />)}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          {shell(
            <AdminPortal
              requests={requests}
              setRequests={setRequests}
              rooms={rooms}
              setRooms={setRooms}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/admin/batch-allocation">
          {shell(
            <AdminBatchAllocation
              requests={requests}
              setRequests={setRequests}
              rooms={rooms}
              setRooms={setRooms}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/admin/payments">
          {shell(
            <AdminPayments
              receipts={receipts}
              setReceipts={setReceipts}
              requests={requests}
              setRequests={setRequests}
              onToast={onToast}
              onAddNotification={addNotification}
            />
          )}
        </Route>
        <Route path="/admin/floor-plan">
          {shell(<AdminFloorPlan rooms={rooms} setRooms={setRooms} onToast={onToast} />)}
        </Route>
        <Route path="/admin/maintenance">
          {shell(
            <AdminMaintenance
              tickets={maintenanceTickets}
              setTickets={setMaintenanceTickets}
              rooms={rooms}
              setRooms={setRooms}
              onToast={onToast}
            />
          )}
        </Route>
        <Route path="/admin/requests">
          {shell(
            <AdminPortal
              requests={requests}
              setRequests={setRequests}
              rooms={rooms}
              setRooms={setRooms}
              onToast={onToast}
            />
          )}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [role, setRole] = useState<Role | null>(null);
  const [location, setLocation] = useLocation();
  const [student, setStudent] = useState<Student>(initialStudent);
  const [preference, setPreference] = useState<Preference>(initialPreference);
  const [requests, setRequests] = useState<AllocationRequest[]>(initialRequests);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(initialMaintenanceTickets);
  const [roommates, setRoommates] = useState<RoommateCandidate[]>(initialRoommates);
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(initialPaymentReceipts);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [toast, setToast] = useState('');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Load from Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    async function loadSupabaseData() {
      try {
        const [
          remoteStudent,
          remotePref,
          remoteRooms,
          remoteRequests,
          remoteTickets,
          remoteReceipts,
          remoteNotifs,
        ] = await Promise.all([
          dbGetStudent(initialStudent.regNo),
          dbGetPreferences(initialStudent.regNo),
          dbGetRooms(),
          dbGetAllocationRequests(),
          dbGetMaintenanceTickets(),
          dbGetPaymentReceipts(),
          dbGetNotifications(initialStudent.regNo),
        ]);

        if (!isMounted) return;

        if (remoteStudent) setStudent(remoteStudent);
        if (remotePref) setPreference(remotePref);
        if (remoteRooms && remoteRooms.length > 0) setRooms(remoteRooms);
        if (remoteRequests && remoteRequests.length > 0) setRequests(remoteRequests);
        if (remoteTickets && remoteTickets.length > 0) setMaintenanceTickets(remoteTickets);
        if (remoteReceipts && remoteReceipts.length > 0) setPaymentReceipts(remoteReceipts);
        if (remoteNotifs && remoteNotifs.length > 0) setNotifications(remoteNotifs);

        setToast('Connected to Supabase PostgreSQL database.');
      } catch (err) {
        console.warn('Could not hydrate state from Supabase:', err);
      }
    }

    loadSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  const enter = (nextRole: Role) => {
    setRole(nextRole);
    setLocation(nextRole === 'student' ? '/student' : '/admin');
  };

  const signOut = () => {
    setRole(null);
    setLocation('/');
    setToast('');
  };

  if (!role) {
    if (location === '/') return <HomePage onLogin={() => setLocation('/login')} />;
    return <AuthPage onEnter={enter} />;
  }

  if (location === '/' || location === '/login') {
    setLocation(role === 'student' ? '/student' : '/admin');
    return null;
  }

  return (
    <>
      <Router
        role={role}
        student={student}
        setStudent={setStudent}
        preference={preference}
        setPreference={setPreference}
        requests={requests}
        setRequests={setRequests}
        rooms={rooms}
        setRooms={setRooms}
        maintenanceTickets={maintenanceTickets}
        setMaintenanceTickets={setMaintenanceTickets}
        roommates={roommates}
        setRoommates={setRoommates}
        receipts={paymentReceipts}
        setReceipts={setPaymentReceipts}
        notifications={notifications}
        setNotifications={setNotifications}
        onToast={setToast}
        toast={toast}
        setToast={setToast}
        onSignOut={signOut}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        appData={{
          student,
          preference,
          rooms,
          requests,
          maintenanceTickets,
          paymentReceipts,
          notifications,
        }}
        onToast={setToast}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppContent />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
