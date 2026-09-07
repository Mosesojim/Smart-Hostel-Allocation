import { AlertCircle } from 'lucide-react';
export default function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: 400, margin: 16, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <AlertCircle size={32} color="#ef4444" />
          <h1 style={{ fontSize: 24, margin: 0, fontWeight: 700, color: '#111827' }}>
            404 Not Found
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#4b5563' }}>
          The requested page could not be found.
        </p>
      </div>
    </div>
  );
}
