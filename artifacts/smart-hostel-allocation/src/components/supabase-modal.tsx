import { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Server,
  Cloud,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { syncAllToSupabase } from '../services/supabaseService';
import {
  Student,
  Preference,
  Room,
  AllocationRequest,
  MaintenanceTicket,
  PaymentReceipt,
  AppNotification,
} from '../types';

export function SupabaseStatusBadge({ onClick }: { onClick: () => void }) {
  const configured = isSupabaseConfigured();

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-sm"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        fontSize: 11,
        borderRadius: 99,
        background: configured ? '#e7f5ef' : '#f8fafc',
        border: `1px solid ${configured ? '#bde7d4' : '#e2e8f0'}`,
        color: configured ? '#1e7354' : '#64748b',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .2s ease',
      }}
      title="Supabase Backend Database Status & Setup"
      data-testid="button-supabase-status"
    >
      <Database size={12} color={configured ? '#277f60' : '#888'} />
      <span>{configured ? 'Supabase Connected' : 'Supabase Backend'}</span>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: configured ? '#277f60' : '#f59e0b',
        }}
      />
    </button>
  );
}

export function SupabaseModal({
  isOpen,
  onClose,
  appData,
  onToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  appData: {
    student: Student;
    preference: Preference;
    rooms: Room[];
    requests: AllocationRequest[];
    maintenanceTickets: MaintenanceTicket[];
    paymentReceipts: PaymentReceipt[];
    notifications: AppNotification[];
  };
  onToast: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'sync'>('status');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const configured = isSupabaseConfigured();
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    onToast('Supabase PostgreSQL Schema copied to clipboard.');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncAllToSupabase(appData);
      setSyncResult(res);
      onToast(res.message);
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err?.message || 'Sync failed due to an unexpected error',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-supabase-setup">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, width: '95%', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#181818',
                display: 'grid',
                placeItems: 'center',
                color: '#3ecf8e',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Supabase Backend Integration</h3>
              <p style={{ fontSize: 11, color: '#666', margin: 0 }}>
                PostgreSQL schema, database tables, real-time sync & state persistence
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} data-testid="button-close-supabase-modal">
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 16 }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'status' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('status')}
            style={{ flex: 1, fontSize: 11 }}
          >
            <Server size={12} /> Connection Status
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'sql' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('sql')}
            style={{ flex: 1, fontSize: 11 }}
          >
            <Terminal size={12} /> SQL Schema & Tables
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'sync' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('sync')}
            style={{ flex: 1, fontSize: 11 }}
          >
            <RefreshCw size={12} /> Sync & Seed Data
          </button>
        </div>

        {/* Tab 1: Status & Info */}
        {activeTab === 'status' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            <div
              style={{
                background: configured ? '#e7f5ef' : '#fefaf6',
                border: `1px solid ${configured ? '#bde7d4' : '#fae7d9'}`,
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              {configured ? (
                <CheckCircle2 size={22} color="#277f60" style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={22} color="#b26829" style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <strong style={{ fontSize: 13, color: configured ? '#1e7354' : '#8a4b16', display: 'block' }}>
                  {configured ? 'Connected to Supabase PostgreSQL Database' : 'Supabase Client Ready (Awaiting Env Keys)'}
                </strong>
                <p style={{ fontSize: 12, color: '#4a4a4a', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {configured
                    ? `Active connection to ${envUrl}. All room allocations, payments, maintenance tickets, and student records are persisted to your PostgreSQL tables.`
                    : 'The complete Supabase architecture is implemented. To connect your live Supabase cloud project, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
                </p>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="eyebrow" style={{ color: '#277f60', marginBottom: 6 }}>Database Architecture</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12 }}>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Database Engine</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#181818' }}>Supabase PostgreSQL</div>
                </div>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Client Library</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#181818' }}>@supabase/supabase-js</div>
                </div>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Security Layer</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#277f60' }}>Row Level Security (RLS)</div>
                </div>
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Sync Strategy</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#181818' }}>Dual Sync (Cloud + Local Cache)</div>
                </div>
              </div>
            </div>

            {/* Tables Checklist */}
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: 13, marginBottom: 8, display: 'block' }}>Integrated Supabase Tables</strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, fontSize: 11 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.students
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.preferences
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.rooms
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.hostels
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.allocation_requests
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.maintenance_tickets
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.payment_receipts
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333' }}>
                  <CheckCircle2 size={12} color="#277f60" /> public.notifications
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Schema */}
        {activeTab === 'sql' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#68707c' }}>
                Run this SQL in your Supabase project dashboard (SQL Editor &gt; New Query):
              </span>
              <button
                type="button"
                className="btn btn-dark btn-sm"
                onClick={handleCopySql}
                style={{ fontSize: 11 }}
                data-testid="button-copy-supabase-sql"
              >
                {copiedSql ? <Check size={12} /> : <Copy size={12} />}
                {copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}
              </button>
            </div>

            <pre
              style={{
                background: '#181818',
                color: '#3ecf8e',
                font: '500 11px var(--app-font-mono)',
                padding: '14px',
                borderRadius: 12,
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: 280,
                margin: 0,
                border: '1px solid #333',
                lineHeight: 1.45,
              }}
            >
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        )}

        {/* Tab 3: Sync Data */}
        {activeTab === 'sync' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-pad" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: 14, margin: '0 0 4px', fontWeight: 700 }}>Data Synchronization & Seeding</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Sync all current live state ({appData.rooms.length} rooms, {appData.requests.length} allocation requests,{' '}
                {appData.maintenanceTickets.length} maintenance tickets, and {appData.paymentReceipts.length} payment receipts) directly to your Supabase tables.
              </p>
            </div>

            {syncResult && (
              <div
                style={{
                  background: syncResult.success ? '#e7f5ef' : '#fef2f2',
                  border: `1px solid ${syncResult.success ? '#bde7d4' : '#fecaca'}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: syncResult.success ? '#1e7354' : '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {syncResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{syncResult.message}</span>
              </div>
            )}

            <div>
              <button
                type="button"
                className="btn btn-dark"
                style={{ width: '100%', padding: '10px 16px' }}
                onClick={handleSyncToSupabase}
                disabled={syncing}
                data-testid="button-trigger-supabase-sync"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Synchronizing with Supabase...' : 'Sync All State to Supabase'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 12,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
