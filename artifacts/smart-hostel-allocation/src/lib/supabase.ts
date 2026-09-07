import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl !== 'https://your-project-id.supabase.co'
  );
}

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  hasKey: Boolean(supabaseAnonKey),
  configured: isSupabaseConfigured(),
};

/**
 * Complete PostgreSQL Schema definition for Supabase SQL Editor
 * Enables complete backend setup with tables, indexes, row level security, and demo seeds.
 */
export const SUPABASE_SCHEMA_SQL = `-- SMART HOSTEL ALLOCATION SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Run this script in your Supabase SQL Editor to set up all tables and security policies.

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Students Table
create table if not exists public.students (
  reg_no text primary key,
  name text not null,
  department text not null,
  faculty text,
  level text not null,
  initials text,
  allocation_status text default 'Pending review',
  room text default 'Unassigned',
  match_score integer default 0,
  payment_status text default 'Pending',
  assigned_hostel text,
  email text,
  phone text,
  emergency_contact text,
  emergency_phone text,
  gender text,
  state_of_origin text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Preferences Table
create table if not exists public.preferences (
  student_reg_no text primary key references public.students(reg_no) on delete cascade,
  room_type text not null default 'Double room',
  floor text not null default '2nd floor',
  quiet_hours text not null default '11:00 pm – 7:00 am',
  roommate_reg_no text default '',
  study_habit text default 'Night owl',
  special_needs text default '',
  sleep_schedule text default 'Late sleeper (after 12am)',
  cleanliness_level integer default 4,
  noise_tolerance text default 'Low ambient sound',
  guest_policy text default 'Weekend only',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Hostels Table
create table if not exists public.hostels (
  name text primary key,
  block text not null,
  location text not null,
  price numeric not null,
  capacity integer not null,
  available integer not null,
  amenities text[] default '{}',
  accent text default 'peach',
  gender text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Rooms Table
create table if not exists public.rooms (
  number text primary key,
  block text not null,
  floor integer not null,
  status text not null default 'Available',
  type text not null default 'Double room',
  capacity integer not null default 2,
  occupants text[] default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Allocation Requests Table
create table if not exists public.allocation_requests (
  id text primary key,
  student_reg_no text references public.students(reg_no) on delete cascade,
  student_name text not null,
  department text not null,
  match_score integer default 0,
  room text not null,
  requested_hostel text not null,
  status text not null default 'Pending',
  submission_date text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Roommate Candidates Table
create table if not exists public.roommate_candidates (
  id text primary key,
  name text not null,
  reg_no text not null,
  department text not null,
  level text not null,
  initials text not null,
  compatibility_score integer not null,
  sleep_schedule text not null,
  study_habit text not null,
  cleanliness integer not null default 4,
  noise_tolerance text not null,
  preferred_block text not null,
  bio text not null,
  request_status text not null default 'None',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Maintenance Tickets Table
create table if not exists public.maintenance_tickets (
  id text primary key,
  category text not null,
  room_number text not null,
  block text not null,
  reported_by text not null,
  reported_by_reg_no text not null,
  priority text not null default 'Medium',
  status text not null default 'Open',
  description text not null,
  assigned_technician text,
  resolution_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Payment Receipts Table
create table if not exists public.payment_receipts (
  id text primary key,
  student_name text not null,
  reg_no text not null,
  department text not null,
  level text not null,
  amount_paid numeric not null,
  expected_amount numeric not null,
  payment_date text not null,
  payment_channel text not null,
  reference_no text not null unique,
  session text not null,
  hostel_name text not null,
  room_number text not null,
  fee_type text not null,
  receipt_file_name text not null,
  receipt_file_size text,
  receipt_data_url text,
  status text not null default 'Pending',
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone,
  verified_by text,
  rejection_reason text,
  admin_notes text,
  bank_name text,
  payer_name text
);

-- 10. Notifications Table
create table if not exists public.notifications (
  id text primary key,
  recipient_reg_no text not null,
  title text not null,
  message text not null,
  type text not null default 'system',
  read boolean default false,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  action_url text
);

-- 11. Row Level Security (RLS) & Policies
alter table public.students enable row level security;
alter table public.preferences enable row level security;
alter table public.hostels enable row level security;
alter table public.rooms enable row level security;
alter table public.allocation_requests enable row level security;
alter table public.roommate_candidates enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.payment_receipts enable row level security;
alter table public.notifications enable row level security;

-- Public read/write policies for demo/application client access
create policy "Allow all operations for anon" on public.students for all using (true) with check (true);
create policy "Allow all operations for anon" on public.preferences for all using (true) with check (true);
create policy "Allow all operations for anon" on public.hostels for all using (true) with check (true);
create policy "Allow all operations for anon" on public.rooms for all using (true) with check (true);
create policy "Allow all operations for anon" on public.allocation_requests for all using (true) with check (true);
create policy "Allow all operations for anon" on public.roommate_candidates for all using (true) with check (true);
create policy "Allow all operations for anon" on public.maintenance_tickets for all using (true) with check (true);
create policy "Allow all operations for anon" on public.payment_receipts for all using (true) with check (true);
create policy "Allow all operations for anon" on public.notifications for all using (true) with check (true);

-- Enable Realtime for core tables
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.allocation_requests;
alter publication supabase_realtime add table public.maintenance_tickets;
alter publication supabase_realtime add table public.payment_receipts;
alter publication supabase_realtime add table public.notifications;
`;
