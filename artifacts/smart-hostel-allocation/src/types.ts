export type Role = 'student' | 'admin';
export type AllocationStatus = 'Allocated' | 'Pending review' | 'Waitlisted';
export type PaymentStatus = 'Cleared' | 'Pending';
export type RequestStatus = 'Pending' | 'Approved' | 'Flagged' | 'Review';
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export type Student = {
  name: string;
  regNo: string;
  department: string;
  faculty?: string;
  level: string;
  initials: string;
  allocationStatus: AllocationStatus;
  room: string;
  matchScore: number;
  paymentStatus: PaymentStatus;
  assignedHostel?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  gender?: string;
  stateOfOrigin?: string;
  bio?: string;
  avatarUrl?: string;
};

export type Preference = {
  roomType: string;
  floor: string;
  quietHours: string;
  roommateRegNo: string;
  studyHabit?: string;
  specialNeeds?: string;
  sleepSchedule?: string;
  cleanlinessLevel?: number;
  noiseTolerance?: string;
  guestPolicy?: string;
};

export type Hostel = {
  name: string;
  block: string;
  location: string;
  price: number;
  capacity: number;
  available: number;
  amenities: string[];
  accent: 'peach' | 'sage' | 'sand';
  gender?: string;
  description?: string;
};

export type Room = {
  number: string;
  block: string;
  floor: number;
  status: RoomStatus;
  type: string;
  capacity: number;
  occupants?: string[];
};

export type AllocationRequest = {
  id: string;
  student: Student;
  department: string;
  matchScore: number;
  room: string;
  requestedHostel: string;
  status: RequestStatus;
  submissionDate: string;
  notes?: string;
};

// Roommate Matching Types
export type RoommateCandidate = {
  id: string;
  name: string;
  regNo: string;
  department: string;
  level: string;
  initials: string;
  compatibilityScore: number;
  sleepSchedule: string;
  studyHabit: string;
  cleanliness: number; // 1-5
  noiseTolerance: string;
  preferredBlock: string;
  bio: string;
  requestStatus: 'None' | 'Sent' | 'Received' | 'Accepted' | 'Declined';
};

// Maintenance Ticket Types
export type MaintenanceCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Carpentry'
  | 'HVAC & Fan'
  | 'Bed & Furniture'
  | 'Doors & Locks'
  | 'Cleanliness';

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved';

export type MaintenanceTicket = {
  id: string;
  category: MaintenanceCategory;
  roomNumber: string;
  block: string;
  reportedBy: string;
  reportedByRegNo: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTechnician?: string;
  resolutionNotes?: string;
};

// Batch Allocation Engine Types
export type BatchAllocationConfig = {
  prioritizeCohort: boolean;
  prioritizeStudyHours: boolean;
  seniorityWeight: number; // 1 to 5
  strictPaymentClearance: boolean;
  balanceFloorLoads: boolean;
};

export type SimulationAssignment = {
  studentId: string;
  studentName: string;
  regNo: string;
  department: string;
  level: string;
  targetRoom: string;
  targetBlock: string;
  hostelName: string;
  fitScore: number;
  roommateName?: string;
  rationale: string;
  status: 'Ready' | 'Warning' | 'Hold';
  warningMessage?: string;
};

export type SimulationResult = {
  totalProcessed: number;
  allocatedCount: number;
  averageFitScore: number;
  conflictsResolved: number;
  occupancyRate: number;
  assignments: SimulationAssignment[];
};

// Fee Payment & Receipt Verification Types
export type PaymentChannel =
  | 'School Portal (Remita RRR)'
  | 'Direct Bank Deposit'
  | 'Interswitch / WebPay'
  | 'Campus Microfinance'
  | 'NIBSS Instant Transfer';

export type PaymentReceiptStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review';

export type PaymentReceipt = {
  id: string;
  studentName: string;
  regNo: string;
  department: string;
  level: string;
  amountPaid: number;
  expectedAmount: number;
  paymentDate: string;
  paymentChannel: PaymentChannel;
  referenceNo: string; // RRR or Bank Ref
  session: string;
  hostelName: string;
  roomNumber: string;
  feeType: 'Hostel Accommodation Fee' | 'Caution & Maintenance Levy' | 'Full Accommodation Package';
  receiptFileName: string;
  receiptFileSize?: string;
  receiptDataUrl?: string; // image or simulated document preview
  status: PaymentReceiptStatus;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
  bankName?: string;
  payerName?: string;
};

export type NotificationType =
  | 'payment_approved'
  | 'payment_rejected'
  | 'allocation_update'
  | 'roommate_match'
  | 'maintenance'
  | 'system';

export type AppNotification = {
  id: string;
  recipientRegNo: string; // or 'all' or 'admin'
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
};


