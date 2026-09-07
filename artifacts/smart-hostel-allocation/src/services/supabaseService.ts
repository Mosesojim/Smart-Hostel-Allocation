import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Student,
  Preference,
  Room,
  AllocationRequest,
  MaintenanceTicket,
  PaymentReceipt,
  RoommateCandidate,
  AppNotification,
  Hostel,
} from '../types';

/**
 * Transforms database record into application Student
 */
function mapDbStudent(data: any): Student {
  return {
    name: data.name,
    regNo: data.reg_no,
    department: data.department,
    faculty: data.faculty || undefined,
    level: data.level,
    initials: data.initials || data.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
    allocationStatus: data.allocation_status || 'Pending review',
    room: data.room || 'Unassigned',
    matchScore: data.match_score || 0,
    paymentStatus: data.payment_status || 'Pending',
    assignedHostel: data.assigned_hostel || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    emergencyContact: data.emergency_contact || undefined,
    emergencyPhone: data.emergency_phone || undefined,
    gender: data.gender || undefined,
    stateOfOrigin: data.state_of_origin || undefined,
    bio: data.bio || undefined,
    avatarUrl: data.avatar_url || undefined,
  };
}

/**
 * Transforms application Student into database record
 */
function mapStudentToDb(student: Student) {
  return {
    reg_no: student.regNo,
    name: student.name,
    department: student.department,
    faculty: student.faculty || null,
    level: student.level,
    initials: student.initials,
    allocation_status: student.allocationStatus,
    room: student.room,
    match_score: student.matchScore,
    payment_status: student.paymentStatus,
    assigned_hostel: student.assignedHostel || null,
    email: student.email || null,
    phone: student.phone || null,
    emergency_contact: student.emergencyContact || null,
    emergency_phone: student.emergencyPhone || null,
    gender: student.gender || null,
    state_of_origin: student.stateOfOrigin || null,
    bio: student.bio || null,
    avatar_url: student.avatarUrl || null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Student & Profile API
 */
export async function dbGetStudent(regNo: string): Promise<Student | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('reg_no', regNo)
      .single();

    if (error || !data) return null;
    return mapDbStudent(data);
  } catch (err) {
    console.warn('Error fetching student from Supabase:', err);
    return null;
  }
}

export async function dbSaveStudent(student: Student): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const record = mapStudentToDb(student);
    const { error } = await supabase
      .from('students')
      .upsert(record, { onConflict: 'reg_no' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving student to Supabase:', err);
    return false;
  }
}

/**
 * Preferences API
 */
export async function dbGetPreferences(regNo: string): Promise<Preference | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('student_reg_no', regNo)
      .single();

    if (error || !data) return null;

    return {
      roomType: data.room_type,
      floor: data.floor,
      quietHours: data.quiet_hours,
      roommateRegNo: data.roommate_reg_no || '',
      studyHabit: data.study_habit || undefined,
      specialNeeds: data.special_needs || undefined,
      sleepSchedule: data.sleep_schedule || undefined,
      cleanlinessLevel: data.cleanliness_level ?? 4,
      noiseTolerance: data.noise_tolerance || undefined,
      guestPolicy: data.guest_policy || undefined,
    };
  } catch (err) {
    console.warn('Error fetching preferences from Supabase:', err);
    return null;
  }
}

export async function dbSavePreferences(regNo: string, preference: Preference): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const record = {
      student_reg_no: regNo,
      room_type: preference.roomType,
      floor: preference.floor,
      quiet_hours: preference.quietHours,
      roommate_reg_no: preference.roommateRegNo || '',
      study_habit: preference.studyHabit || null,
      special_needs: preference.specialNeeds || null,
      sleep_schedule: preference.sleepSchedule || null,
      cleanliness_level: preference.cleanlinessLevel ?? 4,
      noise_tolerance: preference.noiseTolerance || null,
      guest_policy: preference.guestPolicy || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('preferences')
      .upsert(record, { onConflict: 'student_reg_no' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving preferences to Supabase:', err);
    return false;
  }
}

/**
 * Rooms API
 */
export async function dbGetRooms(): Promise<Room[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('rooms').select('*').order('number');
    if (error || !data || data.length === 0) return null;

    return data.map((r: any) => ({
      number: r.number,
      block: r.block,
      floor: r.floor,
      status: r.status,
      type: r.type,
      capacity: r.capacity,
      occupants: r.occupants || [],
    }));
  } catch (err) {
    console.warn('Error fetching rooms from Supabase:', err);
    return null;
  }
}

export async function dbSaveRoom(room: Room): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('rooms').upsert({
      number: room.number,
      block: room.block,
      floor: room.floor,
      status: room.status,
      type: room.type,
      capacity: room.capacity,
      occupants: room.occupants || [],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'number' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving room to Supabase:', err);
    return false;
  }
}

/**
 * Allocation Requests API
 */
export async function dbGetAllocationRequests(): Promise<AllocationRequest[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('allocation_requests').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      student: {
        name: row.student_name,
        regNo: row.student_reg_no,
        department: row.department,
        level: '300 Level',
        initials: row.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
        allocationStatus: row.status === 'Approved' ? 'Allocated' : 'Pending review',
        room: row.room,
        matchScore: row.match_score,
        paymentStatus: 'Cleared',
      },
      department: row.department,
      matchScore: row.match_score,
      room: row.room,
      requestedHostel: row.requested_hostel,
      status: row.status,
      submissionDate: row.submission_date,
      notes: row.notes || undefined,
    }));
  } catch (err) {
    console.warn('Error fetching allocation requests from Supabase:', err);
    return null;
  }
}

export async function dbSaveAllocationRequest(req: AllocationRequest): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('allocation_requests').upsert({
      id: req.id,
      student_reg_no: req.student.regNo,
      student_name: req.student.name,
      department: req.department,
      match_score: req.matchScore,
      room: req.room,
      requested_hostel: req.requestedHostel,
      status: req.status,
      submission_date: req.submissionDate,
      notes: req.notes || null,
    }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving allocation request to Supabase:', err);
    return false;
  }
}

/**
 * Maintenance Tickets API
 */
export async function dbGetMaintenanceTickets(): Promise<MaintenanceTicket[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('maintenance_tickets').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((t: any) => ({
      id: t.id,
      category: t.category,
      roomNumber: t.room_number,
      block: t.block,
      reportedBy: t.reported_by,
      reportedByRegNo: t.reported_by_reg_no,
      priority: t.priority,
      status: t.status,
      description: t.description,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      assignedTechnician: t.assigned_technician || undefined,
      resolutionNotes: t.resolution_notes || undefined,
    }));
  } catch (err) {
    console.warn('Error fetching maintenance tickets from Supabase:', err);
    return null;
  }
}

export async function dbSaveMaintenanceTicket(ticket: MaintenanceTicket): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('maintenance_tickets').upsert({
      id: ticket.id,
      category: ticket.category,
      room_number: ticket.roomNumber,
      block: ticket.block,
      reported_by: ticket.reportedBy,
      reported_by_reg_no: ticket.reportedByRegNo,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      assigned_technician: ticket.assignedTechnician || null,
      resolution_notes: ticket.resolutionNotes || null,
      created_at: ticket.createdAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving maintenance ticket to Supabase:', err);
    return false;
  }
}

/**
 * Payment Receipts API
 */
export async function dbGetPaymentReceipts(): Promise<PaymentReceipt[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('payment_receipts').select('*').order('submitted_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((p: any) => ({
      id: p.id,
      studentName: p.student_name,
      regNo: p.reg_no,
      department: p.department,
      level: p.level,
      amountPaid: Number(p.amount_paid),
      expectedAmount: Number(p.expected_amount),
      paymentDate: p.payment_date,
      paymentChannel: p.payment_channel,
      referenceNo: p.reference_no,
      session: p.session,
      hostelName: p.hostel_name,
      roomNumber: p.room_number,
      feeType: p.fee_type,
      receiptFileName: p.receipt_file_name,
      receiptFileSize: p.receipt_file_size || undefined,
      receiptDataUrl: p.receipt_data_url || undefined,
      status: p.status,
      submittedAt: p.submitted_at,
      verifiedAt: p.verified_at || undefined,
      verifiedBy: p.verified_by || undefined,
      rejectionReason: p.rejection_reason || undefined,
      adminNotes: p.admin_notes || undefined,
      bankName: p.bank_name || undefined,
      payerName: p.payer_name || undefined,
    }));
  } catch (err) {
    console.warn('Error fetching payment receipts from Supabase:', err);
    return null;
  }
}

export async function dbSavePaymentReceipt(receipt: PaymentReceipt): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('payment_receipts').upsert({
      id: receipt.id,
      student_name: receipt.studentName,
      reg_no: receipt.regNo,
      department: receipt.department,
      level: receipt.level,
      amount_paid: receipt.amountPaid,
      expected_amount: receipt.expectedAmount,
      payment_date: receipt.paymentDate,
      payment_channel: receipt.paymentChannel,
      reference_no: receipt.referenceNo,
      session: receipt.session,
      hostel_name: receipt.hostelName,
      room_number: receipt.roomNumber,
      fee_type: receipt.feeType,
      receipt_file_name: receipt.receiptFileName,
      receipt_file_size: receipt.receiptFileSize || null,
      receipt_data_url: receipt.receiptDataUrl || null,
      status: receipt.status,
      submitted_at: receipt.submittedAt,
      verified_at: receipt.verifiedAt || null,
      verified_by: receipt.verifiedBy || null,
      rejection_reason: receipt.rejectionReason || null,
      admin_notes: receipt.adminNotes || null,
      bank_name: receipt.bankName || null,
      payer_name: receipt.payerName || null,
    }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving payment receipt to Supabase:', err);
    return false;
  }
}

/**
 * Notifications API
 */
export async function dbGetNotifications(regNo?: string): Promise<AppNotification[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    let query = supabase.from('notifications').select('*').order('timestamp', { ascending: false });
    if (regNo) {
      query = query.or(`recipient_reg_no.eq.${regNo},recipient_reg_no.eq.all,recipient_reg_no.eq.admin`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    return data.map((n: any) => ({
      id: n.id,
      recipientRegNo: n.recipient_reg_no,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      timestamp: n.timestamp,
      actionUrl: n.action_url || undefined,
    }));
  } catch (err) {
    console.warn('Error fetching notifications from Supabase:', err);
    return null;
  }
}

export async function dbSaveNotification(notif: AppNotification): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('notifications').upsert({
      id: notif.id,
      recipient_reg_no: notif.recipientRegNo,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: notif.read,
      timestamp: notif.timestamp,
      action_url: notif.actionUrl || null,
    }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error saving notification to Supabase:', err);
    return false;
  }
}

/**
 * Bulk Seed & Sync current application state into Supabase tables
 */
export async function syncAllToSupabase(payload: {
  student: Student;
  preference: Preference;
  rooms: Room[];
  requests: AllocationRequest[];
  maintenanceTickets: MaintenanceTicket[];
  paymentReceipts: PaymentReceipt[];
  notifications: AppNotification[];
}): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
    };
  }

  try {
    // 1. Sync Student
    await dbSaveStudent(payload.student);

    // 2. Sync Preferences
    await dbSavePreferences(payload.student.regNo, payload.preference);

    // 3. Sync Rooms
    for (const r of payload.rooms) {
      await dbSaveRoom(r);
    }

    // 4. Sync Allocation Requests
    for (const req of payload.requests) {
      await dbSaveAllocationRequest(req);
    }

    // 5. Sync Maintenance Tickets
    for (const ticket of payload.maintenanceTickets) {
      await dbSaveMaintenanceTicket(ticket);
    }

    // 6. Sync Payment Receipts
    for (const receipt of payload.paymentReceipts) {
      await dbSavePaymentReceipt(receipt);
    }

    // 7. Sync Notifications
    for (const notif of payload.notifications) {
      await dbSaveNotification(notif);
    }

    return {
      success: true,
      message: 'All application records successfully synchronized with Supabase database.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sync failed: ${err?.message || 'Unknown database error'}`,
    };
  }
}
