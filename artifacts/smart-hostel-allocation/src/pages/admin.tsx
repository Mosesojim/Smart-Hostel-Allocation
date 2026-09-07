import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock3,
  DoorOpen,
  FileText,
  Filter,
  MapPin,
  Search,
  X,
  Users,
  ShieldAlert,
  Building,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import { Link } from 'wouter';
import { Room, RequestStatus, AllocationRequest, RoomStatus } from '../types';
import { initialRequests, rooms as initialRooms, hostels } from '../data';
import { FloorGrid, StatusPill, ReassignModal } from '../components/ui';

export function AdminPortal({
  onToast,
  requests: propRequests,
  setRequests: propSetRequests,
  rooms: propRooms,
  setRooms: propSetRooms,
}: {
  onToast: (message: string) => void;
  requests?: AllocationRequest[];
  setRequests?: React.Dispatch<React.SetStateAction<AllocationRequest[]>>;
  rooms?: Room[];
  setRooms?: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [localRequests, setLocalRequests] = useState<AllocationRequest[]>(initialRequests);
  const [localRooms, setLocalRooms] = useState<Room[]>(initialRooms);

  const requests = propRequests ?? localRequests;
  const setRequests = propSetRequests ?? setLocalRequests;
  const rooms = propRooms ?? localRooms;
  const setRooms = propSetRooms ?? setLocalRooms;

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [reassigningRequest, setReassigningRequest] = useState<AllocationRequest | null>(null);
  const [inspectingRequest, setInspectingRequest] = useState<AllocationRequest | null>(null);


  const filtered = useMemo(
    () =>
      requests.filter(
        (request) =>
          `${request.student.name} ${request.student.regNo} ${request.department} ${request.room}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (statusFilter === 'All statuses' || request.status === statusFilter)
      ),
    [requests, query, statusFilter]
  );

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests((items) =>
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            student: {
              ...item.student,
              allocationStatus: status === 'Approved' ? 'Allocated' : 'Pending review',
            },
          };
        }
        return item;
      })
    );
    onToast(`Request marked as ${status}. Allocation queue updated.`);
  };

  const handleReassign = (targetRoomNumber: string) => {
    if (!reassigningRequest) return;
    setRequests((items) =>
      items.map((item) =>
        item.id === reassigningRequest.id
          ? {
              ...item,
              room: targetRoomNumber,
              status: 'Approved',
              student: { ...item.student, room: targetRoomNumber, allocationStatus: 'Allocated' },
            }
          : item
      )
    );
    // update rooms status
    setRooms((currentRooms) =>
      currentRooms.map((r) =>
        r.number === targetRoomNumber ? { ...r, status: 'Occupied' } : r
      )
    );
    onToast(`${reassigningRequest.student.name} successfully assigned to Room ${targetRoomNumber}.`);
    setReassigningRequest(null);
  };

  const handleBatchApprove = () => {
    const pendingCount = requests.filter((r) => r.status === 'Pending').length;
    if (pendingCount === 0) {
      onToast('No pending requests to approve.');
      return;
    }
    setRequests((items) =>
      items.map((r) =>
        r.status === 'Pending' ? { ...r, status: 'Approved' } : r
      )
    );
    onToast(`Approved ${pendingCount} pending allocation requests.`);
  };

  const pendingCount = requests.filter((item) => item.status === 'Pending').length;
  const approvedCount = requests.filter((item) => item.status === 'Approved').length;
  const totalSpaces = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const availableRoomsCount = rooms.filter((r) => r.status === 'Available').length;

  return (
    <div data-testid="page-admin">
      {/* Operations Stat Cards */}
      <div className="stat-grid reveal" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card stat-card dark-card">
          <span className="stat-label">Total Applications</span>
          <strong className="stat-number">{requests.length + 122}</strong>
          <span className="stat-foot">
            <span style={{ color: '#f4c59e' }}>+18</span> new this week
          </span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Awaiting Decision</span>
          <strong className="stat-number">{pendingCount}</strong>
          <span className="stat-foot">
            <Clock3 size={12} /> Requires hall warden review
          </span>
        </div>

        <div className="card stat-card sage-card">
          <span className="stat-label">Allocated Rooms</span>
          <strong className="stat-number">
            {approvedCount + 82}
            <span style={{ fontSize: 16 }}> / {totalSpaces}</span>
          </strong>
          <span className="stat-foot">
            <span className="trend-up">84% Occupancy</span> across all halls
          </span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Available Rooms</span>
          <strong className="stat-number">{availableRoomsCount}</strong>
          <span className="stat-foot">
            <DoorOpen size={12} /> Across Block A, B & D
          </span>
        </div>
      </div>

      {/* Admin Modules Quick Launch Row */}
      <div className="three-col reveal delay-1" style={{ marginTop: 18 }}>
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#277f60' }}>Automated Engine</div>
            <span className="tag sage">Optimization Ready</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>Batch Allocation Engine</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Simulate and execute algorithmic room placement based on academic level and clearance.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/admin/batch-allocation" className="btn btn-dark btn-sm" style={{ width: '100%' }} data-testid="link-batch-allocation-overview">
              Run Batch Engine <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#b26829' }}>Bursary & Audit</div>
            <span className="tag peach">Receipts Queue</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>Fee Verification Desk</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Inspect uploaded Remita receipts, match RRR numbers, approve payments, and trigger passes.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/admin/payments" className="btn btn-ghost btn-sm" style={{ width: '100%' }} data-testid="link-payments-admin-overview">
              Audit Receipts <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#0284c7' }}>Facilities & Repairs</div>
            <span className="tag sand">Desk Active</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>Maintenance Desk</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Assign technicians, monitor electrical/plumbing repairs, and manage room holds.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/admin/maintenance" className="btn btn-ghost btn-sm" style={{ width: '100%' }} data-testid="link-maintenance-admin-overview">
              Dispatch Desk <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Main Allocation Queue Table */}
        <section className="card card-pad reveal delay-1">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Allocation Decision Engine</div>
              <h2 style={{ marginTop: 6 }}>Student Housing Queue</h2>
              <p>Review match fit scores, room availability, and bursary payment status.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleBatchApprove}
                data-testid="button-batch-approve"
              >
                <CheckCheck size={13} /> Approve all pending
              </button>
              <button
                className="btn btn-peach btn-sm"
                onClick={() => onToast('Hostel Allocation Summary CSV ready for download.')}
                data-testid="button-export-report"
              >
                <FileText size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div className="toolbar">
            <div className="filter-row" style={{ flex: '1 1 300px' }}>
              <div style={{ position: 'relative', flex: '1 1 180px' }}>
                <Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 11 }} />
                <input
                  className="search-input"
                  style={{ paddingLeft: 32, width: '100%' }}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search student, reg no, department..."
                  data-testid="input-search-requests"
                />
              </div>

              <select
                className="select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                data-testid="select-status-filter"
              >
                <option>All statuses</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Flagged</option>
                <option>Review</option>
              </select>
            </div>
            <span className="tag">{filtered.length} requests shown</span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department & Level</th>
                  <th>Fit Score</th>
                  <th>Assigned Room</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => (
                  <tr key={request.id} data-testid={`row-request-${request.id}`}>
                    <td>
                      <div
                        className="student-cell"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setInspectingRequest(request)}
                        title="Click to view full application details"
                      >
                        <div
                          className={`avatar ${
                            request.status === 'Approved'
                              ? 'sage'
                              : request.student.name === 'Victory Okafor'
                              ? ''
                              : ''
                          }`}
                        >
                          {request.student.initials}
                        </div>
                        <div>
                          <div className="student-name">{request.student.name}</div>
                          <div className="student-reg">{request.student.regNo}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{request.department}</div>
                      <div style={{ color: '#888', fontSize: 10 }}>{request.student.level}</div>
                    </td>
                    <td>
                      <span className="score">{request.matchScore}%</span>
                    </td>
                    <td>
                      <span style={{ font: '700 11px var(--app-font-mono)', color: '#3f444b' }}>
                        {request.room}
                      </span>
                      <div style={{ color: '#a1a5ab', fontSize: 9, marginTop: 2 }}>
                        {request.student.paymentStatus} bursary
                      </div>
                    </td>
                    <td>
                      <StatusPill status={request.status} />
                    </td>
                    <td>
                      <div className="action-group">
                        {request.status !== 'Approved' && (
                          <button
                            className="btn btn-sage btn-sm"
                            onClick={() => updateRequestStatus(request.id, 'Approved')}
                            data-testid={`button-approve-${request.id}`}
                            title="Approve allocation"
                          >
                            <Check size={12} /> Approve
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setReassigningRequest(request)}
                          data-testid={`button-reassign-${request.id}`}
                          title="Reassign room"
                        >
                          Reassign
                        </button>
                        {request.status !== 'Flagged' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateRequestStatus(request.id, 'Flagged')}
                            data-testid={`button-flag-${request.id}`}
                            title="Flag for review"
                          >
                            Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ marginTop: 14 }} data-testid="empty-request-results">
              <div className="empty-state-mark">
                <Filter size={18} />
              </div>
              <strong>No requests match your filter</strong>
              <p>Try clearing your search query or choosing another status category.</p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setQuery('');
                  setStatusFilter('All statuses');
                }}
                data-testid="button-clear-request-filters"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Live Block Floor Plan Preview */}
        <section className="card card-pad reveal delay-2">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Live Floor Plan</div>
              <h2 style={{ marginTop: 6 }}>Block B · Mango House</h2>
              <p>Click any room to inspect occupancy or assign a student.</p>
            </div>
            <Link href="/admin/floor-plan" className="icon-button" data-testid="link-open-floor-plan">
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <FloorGrid
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelect={setSelectedRoom}
            compact
            filterBlock="Block B"
          />

          {selectedRoom ? (
            <div className="side-note" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="eyebrow">{selectedRoom.status}</div>
                  <h3 style={{ marginTop: 4 }}>
                    Room {selectedRoom.number} · {selectedRoom.type}
                  </h3>
                </div>
                <button
                  className="icon-button"
                  style={{ width: 26, height: 26 }}
                  onClick={() => setSelectedRoom(null)}
                  data-testid="button-close-selected-room"
                >
                  <X size={13} />
                </button>
              </div>

              <div style={{ fontSize: 11, color: '#444', marginTop: 8 }}>
                {selectedRoom.occupants && selectedRoom.occupants.length > 0 ? (
                  <div>
                    <strong>Occupants ({selectedRoom.occupants.length}/{selectedRoom.capacity}):</strong>{' '}
                    {selectedRoom.occupants.join(', ')}
                  </div>
                ) : (
                  <div>No students currently assigned to this room.</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    const newStatus: RoomStatus =
                      selectedRoom.status === 'Available'
                        ? 'Maintenance'
                        : selectedRoom.status === 'Maintenance'
                        ? 'Available'
                        : 'Available';
                    setRooms((prev) =>
                      prev.map((r) => (r.number === selectedRoom.number ? { ...r, status: newStatus } : r))
                    );
                    setSelectedRoom((prev) => (prev ? { ...prev, status: newStatus } : null));
                    onToast(`Room ${selectedRoom.number} status changed to ${newStatus}.`);
                  }}
                >
                  Toggle status ({selectedRoom.status === 'Available' ? 'Hold' : 'Release'})
                </button>
              </div>
            </div>
          ) : (
            <div className="notice" style={{ marginTop: 14 }}>
              Click any room above to inspect active occupants or place a temporary maintenance hold.
            </div>
          )}
        </section>
      </div>

      {/* Reassign Dialog */}
      {reassigningRequest && (
        <ReassignModal
          request={reassigningRequest}
          rooms={rooms}
          onClose={() => setReassigningRequest(null)}
          onConfirm={handleReassign}
        />
      )}

      {/* Student Application Inspector Modal */}
      {inspectingRequest && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Student Housing Profile</div>
                <h2>{inspectingRequest.student.name}</h2>
                <p>
                  {inspectingRequest.student.regNo} · {inspectingRequest.department} ({inspectingRequest.student.level})
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setInspectingRequest(null)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="preference-list">
              <div className="preference-item">
                <small>Allocated Room</small>
                <strong>{inspectingRequest.room}</strong>
              </div>
              <div className="preference-item">
                <small>Match Compatibility</small>
                <strong style={{ color: '#277f60' }}>{inspectingRequest.matchScore}% fit score</strong>
              </div>
              <div className="preference-item">
                <small>Requested Hostel</small>
                <strong>{inspectingRequest.requestedHostel}</strong>
              </div>
              <div className="preference-item">
                <small>Payment Clearance</small>
                <strong>{inspectingRequest.student.paymentStatus}</strong>
              </div>
            </div>

            {inspectingRequest.notes && (
              <div
                style={{
                  background: '#f8f9fa',
                  padding: 12,
                  borderRadius: 12,
                  marginTop: 14,
                  fontSize: 11,
                  color: '#555',
                }}
              >
                <strong>Application Notes:</strong>
                <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>{inspectingRequest.notes}</p>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setInspectingRequest(null)}>
                Close
              </button>
              <button
                className="btn btn-dark"
                onClick={() => {
                  setReassigningRequest(inspectingRequest);
                  setInspectingRequest(null);
                }}
              >
                Change Room Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminFloorPlan({
  onToast,
  rooms: propRooms,
  setRooms: propSetRooms,
}: {
  onToast: (message: string) => void;
  rooms?: Room[];
  setRooms?: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [localRooms, setLocalRooms] = useState<Room[]>(initialRooms);
  const rooms = propRooms ?? localRooms;
  const setRooms = propSetRooms ?? setLocalRooms;

  const [selectedBlock, setSelectedBlock] = useState('Block B');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const toggleRoomStatus = (room: Room, targetStatus: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.number === room.number ? { ...r, status: targetStatus } : r))
    );
    setSelectedRoom((prev) => (prev && prev.number === room.number ? { ...prev, status: targetStatus } : null));
    onToast(`Room ${room.number} updated to ${targetStatus}.`);
  };

  return (
    <div data-testid="page-admin-floor-plan">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Visual Room Inventory</div>
          <h2 style={{ fontSize: 27, letterSpacing: '-.06em', marginTop: 6 }}>
            Campus Block Floor Plans
          </h2>
          <p>Interactive spatial map of rooms, capacities, and active maintenance holds.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-peach"
            onClick={() => onToast('Building inventory exported as PDF report.')}
            data-testid="button-export-floor-plan"
          >
            <FileText size={14} /> Export Floor Plan
          </button>
        </div>
      </div>

      {/* Block Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {['Block B (Mango House)', 'Block A (The Lantern)', 'Block D (Aster Court)'].map((label) => {
          const blockCode = label.split(' ')[0] + ' ' + label.split(' ')[1];
          const isSelected = selectedBlock === blockCode;
          return (
            <button
              key={label}
              className={`btn btn-sm ${isSelected ? 'btn-dark' : 'btn-ghost'}`}
              onClick={() => {
                setSelectedBlock(blockCode);
                setSelectedRoom(null);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <FloorGrid
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelect={setSelectedRoom}
            filterBlock={selectedBlock}
          />
        </section>

        <section className="card card-pad">
          {selectedRoom ? (
            <>
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Room Details</div>
                  <h2 style={{ marginTop: 6 }}>Room {selectedRoom.number}</h2>
                  <p>
                    {selectedRoom.block} · {selectedRoom.type} room · Floor {selectedRoom.floor}
                  </p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setSelectedRoom(null)}
                  data-testid="button-clear-floor-selection"
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                <StatusPill
                  status={
                    selectedRoom.status === 'Available'
                      ? 'Available'
                      : selectedRoom.status === 'Occupied'
                      ? 'Approved'
                      : 'Flagged'
                  }
                />
                <span className="tag">{selectedRoom.capacity} Bed Capacity</span>
              </div>

              <div className="preference-list" style={{ marginBottom: 14 }}>
                <div className="preference-item">
                  <small>Current Occupancy</small>
                  <strong>
                    {selectedRoom.occupants ? selectedRoom.occupants.length : 0} / {selectedRoom.capacity} Beds
                  </strong>
                </div>
                <div className="preference-item">
                  <small>Floor Level</small>
                  <strong>Floor {selectedRoom.floor}</strong>
                </div>
              </div>

              {selectedRoom.occupants && selectedRoom.occupants.length > 0 && (
                <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 12, marginBottom: 14 }}>
                  <strong style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Assigned Students:</strong>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#444' }}>
                    {selectedRoom.occupants.map((occ) => (
                      <li key={occ}>{occ}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6 }}>
                Change Room Status:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                <button
                  className={`btn btn-sm ${selectedRoom.status === 'Available' ? 'btn-sage' : 'btn-ghost'}`}
                  onClick={() => toggleRoomStatus(selectedRoom, 'Available')}
                >
                  Available
                </button>
                <button
                  className={`btn btn-sm ${selectedRoom.status === 'Occupied' ? 'btn-dark' : 'btn-ghost'}`}
                  onClick={() => toggleRoomStatus(selectedRoom, 'Occupied')}
                >
                  Occupied
                </button>
                <button
                  className={`btn btn-sm ${selectedRoom.status === 'Maintenance' ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={() => toggleRoomStatus(selectedRoom, 'Maintenance')}
                >
                  Maintenance
                </button>
              </div>

              <button
                className="btn btn-peach"
                onClick={() => onToast(`Room ${selectedRoom.number} marked for priority allocation matching.`)}
                data-testid="button-follow-up-room"
                style={{ width: '100%', marginTop: 18 }}
              >
                Mark for Matching
              </button>
            </>
          ) : (
            <div className="empty-state" style={{ border: 0, background: 'transparent' }}>
              <div className="empty-state-mark">
                <MapPin size={18} />
              </div>
              <strong>Select a room on the grid</strong>
              <p>Inspect occupancy details, manage maintenance holds, and assign students.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
