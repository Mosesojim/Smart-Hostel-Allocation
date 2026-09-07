import { useState, useMemo } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  X,
  Check,
  User,
  Building,
  Phone,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  FileText,
  Hammer,
  Sparkles,
} from 'lucide-react';
import {
  MaintenanceTicket,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
  Room,
} from '../types';
import { initialMaintenanceTickets, technicians, student, rooms as initialRooms } from '../data';

export function StudentMaintenance({
  tickets,
  setTickets,
  onToast,
}: {
  tickets: MaintenanceTicket[];
  setTickets: React.Dispatch<React.SetStateAction<MaintenanceTicket[]>>;
  onToast: (msg: string) => void;
}) {
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState('All statuses');

  // Form State
  const [form, setForm] = useState<{
    category: MaintenanceCategory;
    roomNumber: string;
    priority: MaintenancePriority;
    description: string;
    preferredTime: string;
  }>({
    category: 'Plumbing',
    roomNumber: student.room || 'B-214',
    priority: 'Medium',
    description: '',
    preferredTime: 'Morning (8am to 12pm)',
  });

  const studentTickets = useMemo(() => {
    return tickets.filter((t) => {
      const isMine =
        t.reportedByRegNo === student.regNo || t.roomNumber === student.room;
      const matchesStatus =
        statusFilter === 'All statuses' || t.status === statusFilter;
      return isMine && matchesStatus;
    });
  }, [tickets, statusFilter]);

  const activeTicketsCount = studentTickets.filter(
    (t) => t.status !== 'Resolved'
  ).length;

  const handleLodgeTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) {
      onToast('Please describe the issue in detail.');
      return;
    }

    const newTicket: MaintenanceTicket = {
      id: `TICK-${Math.floor(8000 + Math.random() * 1000)}`,
      category: form.category,
      roomNumber: form.roomNumber,
      block: form.roomNumber.startsWith('B')
        ? 'Block B'
        : form.roomNumber.startsWith('A')
        ? 'Block A'
        : 'Block D',
      reportedBy: student.name,
      reportedByRegNo: student.regNo,
      priority: form.priority,
      status: 'Open',
      description: `${form.description.trim()} (Preferred visit: ${form.preferredTime})`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setTickets([newTicket, ...tickets]);
    onToast(`Maintenance ticket ${newTicket.id} logged. Facility supervisor notified.`);
    setShowLodgeModal(false);
    setForm({
      category: 'Plumbing',
      roomNumber: student.room || 'B-214',
      priority: 'Medium',
      description: '',
      preferredTime: 'Morning (8am to 12pm)',
    });
  };

  const getPriorityTagClass = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'Urgent':
        return 'tag peach';
      case 'High':
        return 'tag peach';
      case 'Medium':
        return 'tag';
      case 'Low':
        return 'tag sage';
    }
  };

  const getStatusTagClass = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Resolved':
        return 'tag sage';
      case 'In Progress':
        return 'tag peach';
      case 'Assigned':
        return 'tag';
      case 'Open':
        return 'tag';
    }
  };

  return (
    <div data-testid="page-student-maintenance">
      {/* Header Banner */}
      <div className="card card-pad" style={{ marginBottom: 18, background: '#f4c59e', border: 0 }}>
        <div className="eyebrow">Facilities & Maintenance</div>
        <h2 style={{ fontSize: 26, letterSpacing: '-.06em', margin: '8px 0 5px' }}>
          Room Issue Reporting & Repairs
        </h2>
        <p style={{ margin: 0, color: '#4a3d31', fontSize: 13, maxWidth: 620, lineHeight: 1.5 }}>
          Lodge maintenance tickets for electrical, plumbing, carpentry, or HVAC issues. Hall wardens and campus technicians track repairs in real-time.
        </p>
      </div>

      {/* Room Status Overview Card */}
      <div className="two-col" style={{ marginBottom: 20 }}>
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #d9f2e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="eyebrow" style={{ color: '#277f60' }}>Room Condition</div>
            <span className="tag sage">
              <ShieldCheck size={12} style={{ marginRight: 4 }} /> Active Allocation
            </span>
          </div>

          <h3 style={{ fontSize: 20, margin: '4px 0 6px' }}>Room {student.room} ({student.assignedHostel || 'Mango House'})</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            2nd Floor · Double Occupancy · Water and Solar Inverter active.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-peach"
              onClick={() => setShowLodgeModal(true)}
              data-testid="button-lodge-maintenance"
            >
              <Plus size={14} /> Report Room Issue
            </button>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, color: '#666', marginLeft: 8 }}>
              {activeTicketsCount === 0 ? (
                <span style={{ color: '#277f60', fontWeight: 600 }}>All facilities in good working order.</span>
              ) : (
                <span>{activeTicketsCount} ticket(s) currently being serviced.</span>
              )}
            </span>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fbfcfc' }}>
          <div className="eyebrow">Repairs SLA Policy</div>
          <h4 style={{ margin: '4px 0 8px', fontSize: 15 }}>Campus Response Times</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#555' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Urgent (Burst pipes, power loss):</span>
              <strong style={{ color: '#a14b43' }}>Under 2 hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>High (Ceiling fan, door locks):</span>
              <strong>Within 24 hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Standard (Furniture, painting):</span>
              <strong>2 to 3 business days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Toolbar */}
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <div>
          <div className="eyebrow">Ticket Tracker</div>
          <h3 style={{ fontSize: 18, margin: '2px 0 0' }}>
            My Maintenance Requests ({studentTickets.length})
          </h3>
        </div>

        <div className="filter-row">
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="select-ticket-status-filter"
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {studentTickets.length === 0 ? (
        <div className="card empty-state" data-testid="empty-maintenance-tickets">
          <Wrench size={28} color="#888" />
          <strong>No maintenance tickets found</strong>
          <p>If anything requires repair in Room {student.room}, click the button below to submit a request.</p>
          <button className="btn btn-peach btn-sm" onClick={() => setShowLodgeModal(true)}>
            <Plus size={13} /> Report Room Issue
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {studentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="card card-pad"
              style={{ display: 'flex', flexDirection: 'column' }}
              data-testid={`card-ticket-${ticket.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ font: '700 11px var(--app-font-mono)', color: '#888' }}>{ticket.id}</span>
                  <h4 style={{ margin: '2px 0 0', fontSize: 16 }}>{ticket.category}</h4>
                  <div style={{ fontSize: 11, color: '#68707c' }}>
                    Room {ticket.roomNumber} ({ticket.block})
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={getStatusTagClass(ticket.status)}>{ticket.status}</span>
                  <span className={getPriorityTagClass(ticket.priority)} style={{ fontSize: 9 }}>
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#444', margin: '12px 0', lineHeight: 1.45 }}>
                {ticket.description}
              </p>

              {ticket.assignedTechnician && (
                <div style={{ background: '#f8f9fa', padding: '8px 10px', borderRadius: 8, fontSize: 10, color: '#555', marginBottom: 12 }}>
                  <strong>Assigned Technician:</strong> {ticket.assignedTechnician}
                  {ticket.resolutionNotes && (
                    <div style={{ marginTop: 4, color: '#277f60' }}>
                      <strong>Update:</strong> {ticket.resolutionNotes}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f0f1f3' }}>
                <span style={{ fontSize: 10, color: '#999' }}>Logged: {ticket.createdAt}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedTicket(ticket)}
                  data-testid={`button-view-ticket-${ticket.id}`}
                >
                  Details <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lodge Ticket Modal */}
      {showLodgeModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Maintenance Dispatch</div>
                <h2>Report Room Issue</h2>
                <p>Submit a repair request to the hostel facilities department.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowLodgeModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleLodgeTicket} style={{ marginTop: 14 }}>
              <div className="form-grid" style={{ gap: 14 }}>
                <div className="field">
                  <label>Category of Issue</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as MaintenanceCategory })}
                    data-testid="select-issue-category"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC & Fan</option>
                    <option>Doors & Locks</option>
                    <option>Carpentry</option>
                    <option>Bed & Furniture</option>
                    <option>Cleanliness</option>
                  </select>
                </div>

                <div className="field">
                  <label>Priority Level</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as MaintenancePriority })}
                    data-testid="select-issue-priority"
                  >
                    <option>Medium</option>
                    <option>Low</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="field full">
                  <label>Room Number</label>
                  <input
                    type="text"
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                    required
                    data-testid="input-issue-room"
                  />
                </div>

                <div className="field full">
                  <label>Describe the Problem in Detail</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Tap leaking continuously underneath the washbasin..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    data-testid="textarea-issue-description"
                  />
                </div>

                <div className="field full">
                  <label>Preferred Technician Visit Time</label>
                  <select
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  >
                    <option>Morning (8am to 12pm)</option>
                    <option>Afternoon (12pm to 4pm)</option>
                    <option>Evening (4pm to 7pm)</option>
                    <option>Anytime (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowLodgeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark" data-testid="button-submit-ticket">
                  <Check size={14} /> Submit Repair Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div>
                <span style={{ font: '700 11px var(--app-font-mono)', color: '#888' }}>{selectedTicket.id}</span>
                <h2>{selectedTicket.category} Repair</h2>
                <p>Room {selectedTicket.roomNumber} · {selectedTicket.block}</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Step Progress Timeline */}
            <div style={{ margin: '18px 0 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={`timeline-step ${selectedTicket.status !== 'Open' ? 'completed' : ''}`}>
                <div className="timeline-marker completed">1</div>
                <div>
                  <strong style={{ fontSize: 12 }}>Issue Reported</strong>
                  <div style={{ fontSize: 10, color: '#777' }}>{selectedTicket.createdAt}</div>
                </div>
              </div>

              <div className={`timeline-step ${selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved' ? 'completed' : ''}`}>
                <div className={`timeline-marker ${selectedTicket.assignedTechnician ? 'completed' : 'active'}`}>2</div>
                <div>
                  <strong style={{ fontSize: 12 }}>Technician Assigned</strong>
                  <div style={{ fontSize: 10, color: '#777' }}>
                    {selectedTicket.assignedTechnician || 'Awaiting hall warden dispatch'}
                  </div>
                </div>
              </div>

              <div className={`timeline-step ${selectedTicket.status === 'Resolved' ? 'completed' : ''}`}>
                <div className={`timeline-marker ${selectedTicket.status === 'Resolved' ? 'completed' : ''}`}>3</div>
                <div>
                  <strong style={{ fontSize: 12 }}>Resolution & Testing</strong>
                  <div style={{ fontSize: 10, color: '#777' }}>
                    {selectedTicket.status === 'Resolved' ? selectedTicket.updatedAt : 'Pending repair completion'}
                  </div>
                </div>
              </div>
            </div>

            <div className="preference-list">
              <div className="preference-item">
                <small>Current Status</small>
                <strong>{selectedTicket.status}</strong>
              </div>
              <div className="preference-item">
                <small>Priority</small>
                <strong>{selectedTicket.priority}</strong>
              </div>
              <div className="preference-item">
                <small>Reported By</small>
                <strong>{selectedTicket.reportedBy} ({selectedTicket.reportedByRegNo})</strong>
              </div>
              <div className="preference-item">
                <small>Assigned Staff</small>
                <strong>{selectedTicket.assignedTechnician || 'Unassigned'}</strong>
              </div>
            </div>

            {selectedTicket.resolutionNotes && (
              <div style={{ marginTop: 14, background: '#f5faf7', padding: 12, borderRadius: 10, border: '1px solid #d7efe1' }}>
                <strong style={{ fontSize: 11, color: '#17604a', display: 'block', marginBottom: 2 }}>Technician Report:</strong>
                <p style={{ margin: 0, fontSize: 11, color: '#333' }}>{selectedTicket.resolutionNotes}</p>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setSelectedTicket(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminMaintenance({
  tickets,
  setTickets,
  rooms,
  setRooms,
  onToast,
}: {
  tickets: MaintenanceTicket[];
  setTickets: React.Dispatch<React.SetStateAction<MaintenanceTicket[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [dispatchModal, setDispatchModal] = useState<MaintenanceTicket | null>(null);
  const [selectedTech, setSelectedTech] = useState(technicians[0].name);
  const [resolutionComment, setResolutionComment] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        `${t.id} ${t.roomNumber} ${t.block} ${t.reportedBy} ${t.description}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCat =
        categoryFilter === 'All categories' || t.category === categoryFilter;
      const matchesStat =
        statusFilter === 'All statuses' || t.status === statusFilter;
      const matchesPri =
        priorityFilter === 'All priorities' || t.priority === priorityFilter;

      return matchesSearch && matchesCat && matchesStat && matchesPri;
    });
  }, [tickets, search, categoryFilter, statusFilter, priorityFilter]);

  const urgentCount = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;

  const handleAssignTechnician = () => {
    if (!dispatchModal) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === dispatchModal.id
          ? {
              ...t,
              assignedTechnician: selectedTech,
              status: 'In Progress',
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : t
      )
    );
    onToast(`Assigned ${selectedTech} to Ticket ${dispatchModal.id} (Room ${dispatchModal.roomNumber}).`);
    setDispatchModal(null);
  };

  const handleMarkResolved = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Resolved',
              resolutionNotes: resolutionComment || 'Inspected and repaired by facilities technician.',
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : t
      )
    );
    onToast(`Ticket ${id} marked as Resolved.`);
    setSelectedTicket(null);
    setResolutionComment('');
  };

  const handleToggleRoomHold = (roomNumber: string) => {
    const target = rooms.find((r) => r.number === roomNumber);
    if (!target) return;
    const nextStatus = target.status === 'Maintenance' ? 'Available' : 'Maintenance';
    setRooms((prev) =>
      prev.map((r) => (r.number === roomNumber ? { ...r, status: nextStatus } : r))
    );
    onToast(
      nextStatus === 'Maintenance'
        ? `Room ${roomNumber} placed on MAINTENANCE HOLD on the floor plan.`
        : `Room ${roomNumber} cleared from maintenance hold and marked Available.`
    );
  };

  return (
    <div data-testid="page-admin-maintenance">
      {/* Stat Cards */}
      <div className="stat-grid reveal" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card stat-card dark-card">
          <span className="stat-label">Total Reported Issues</span>
          <strong className="stat-number">{tickets.length}</strong>
          <span className="stat-foot">Across Block A, B & D</span>
        </div>

        <div className="card stat-card" style={{ borderLeft: '4px solid #b34a3b' }}>
          <span className="stat-label">Urgent Dispatches</span>
          <strong className="stat-number" style={{ color: urgentCount > 0 ? '#a14b43' : undefined }}>
            {urgentCount}
          </strong>
          <span className="stat-foot">Requires immediate technician</span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Repairs In Progress</span>
          <strong className="stat-number">{inProgressCount}</strong>
          <span className="stat-foot">Technicians actively on-site</span>
        </div>

        <div className="card stat-card sage-card">
          <span className="stat-label">Resolved This Term</span>
          <strong className="stat-number">{resolvedCount}</strong>
          <span className="stat-foot">100% verified by students</span>
        </div>
      </div>

      {/* Facilities Dispatch Desk */}
      <section className="card card-pad reveal delay-1" style={{ marginTop: 20 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">Facilities & Maintenance Control</div>
            <h2 style={{ marginTop: 6 }}>Campus Repair Tickets</h2>
            <p>Assign technicians, monitor repair statuses, and manage room maintenance holds.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                onToast('Refreshed technician dispatch queue.');
              }}
            >
              Sync Records
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="toolbar" style={{ marginTop: 16 }}>
          <div className="filter-row" style={{ width: '100%', gap: 10 }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 12 }} />
              <input
                className="search-input"
                style={{ paddingLeft: 32, width: '100%' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket ID, room, student, issue..."
                data-testid="input-search-admin-tickets"
              />
            </div>

            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              data-testid="select-admin-cat-filter"
            >
              <option>All categories</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>HVAC & Fan</option>
              <option>Doors & Locks</option>
              <option>Carpentry</option>
              <option>Bed & Furniture</option>
            </select>

            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="select-admin-status-filter"
            >
              <option>All statuses</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <select
              className="select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              data-testid="select-admin-priority-filter"
            >
              <option>All priorities</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="table-wrap" style={{ marginTop: 14 }}>
          <table className="table" data-testid="table-admin-maintenance">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Room & Block</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Reported By</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px 10px', color: '#888' }}>
                    No maintenance tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const roomObj = rooms.find((r) => r.number === ticket.roomNumber);
                  const isRoomOnHold = roomObj?.status === 'Maintenance';

                  return (
                    <tr key={ticket.id} data-testid={`row-ticket-${ticket.id}`}>
                      <td>
                        <strong style={{ font: '700 11px var(--app-font-mono)' }}>{ticket.id}</strong>
                      </td>
                      <td>
                        <strong>Room {ticket.roomNumber}</strong>
                        <div style={{ fontSize: 10, color: '#777' }}>{ticket.block}</div>
                      </td>
                      <td>
                        <span className="tag" style={{ fontSize: 10 }}>{ticket.category}</span>
                      </td>
                      <td>
                        <span
                          className={
                            ticket.priority === 'Urgent'
                              ? 'tag peach'
                              : ticket.priority === 'High'
                              ? 'tag peach'
                              : 'tag'
                          }
                          style={{ fontSize: 10 }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ticket.reportedBy}</div>
                        <div style={{ fontSize: 10, color: '#888' }}>{ticket.reportedByRegNo}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 11, color: ticket.assignedTechnician ? '#333' : '#999' }}>
                          {ticket.assignedTechnician || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            ticket.status === 'Resolved'
                              ? 'tag sage'
                              : ticket.status === 'In Progress'
                              ? 'tag peach'
                              : 'tag'
                          }
                          style={{ fontSize: 10 }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setSelectedTicket(ticket)}
                            data-testid={`button-inspect-ticket-${ticket.id}`}
                          >
                            Inspect
                          </button>
                          {ticket.status !== 'Resolved' && (
                            <button
                              className="btn btn-peach btn-sm"
                              onClick={() => setDispatchModal(ticket)}
                              data-testid={`button-dispatch-${ticket.id}`}
                            >
                              Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dispatch Technician Modal */}
      {dispatchModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Technician Dispatch</div>
                <h2>Assign Repair Staff</h2>
                <p>Ticket {dispatchModal.id} · Room {dispatchModal.roomNumber} ({dispatchModal.category})</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setDispatchModal(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ margin: '14px 0' }}>
              <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Select Campus Technician
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {technicians.map((tech) => (
                  <label
                    key={tech.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: selectedTech === tech.name ? '#eef9f4' : '#f8f9fa',
                      border: `1.5px solid ${selectedTech === tech.name ? '#277f60' : '#e5e7e9'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 12 }}>{tech.name}</strong>
                      <div style={{ fontSize: 10, color: '#666' }}>{tech.specialty} · {tech.phone}</div>
                    </div>
                    <input
                      type="radio"
                      name="selectedTech"
                      value={tech.name}
                      checked={selectedTech === tech.name}
                      onChange={(e) => setSelectedTech(e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDispatchModal(null)}>
                Cancel
              </button>
              <button className="btn btn-dark" onClick={handleAssignTechnician} data-testid="button-confirm-dispatch">
                <Check size={14} /> Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Inspect Ticket Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-head">
              <div>
                <span style={{ font: '700 11px var(--app-font-mono)', color: '#888' }}>{selectedTicket.id}</span>
                <h2>{selectedTicket.category} Report</h2>
                <p>Room {selectedTicket.roomNumber} ({selectedTicket.block})</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="preference-list" style={{ marginTop: 12 }}>
              <div className="preference-item">
                <small>Reported By</small>
                <strong>{selectedTicket.reportedBy} ({selectedTicket.reportedByRegNo})</strong>
              </div>
              <div className="preference-item">
                <small>Priority</small>
                <strong>{selectedTicket.priority}</strong>
              </div>
              <div className="preference-item">
                <small>Assigned Tech</small>
                <strong>{selectedTicket.assignedTechnician || 'Unassigned'}</strong>
              </div>
              <div className="preference-item">
                <small>Current Status</small>
                <strong>{selectedTicket.status}</strong>
              </div>
            </div>

            <div style={{ margin: '14px 0', background: '#f8f9fa', padding: 12, borderRadius: 10 }}>
              <strong style={{ fontSize: 11, color: '#444', display: 'block', marginBottom: 4 }}>Problem Description:</strong>
              <p style={{ margin: 0, fontSize: 11, color: '#222', lineHeight: 1.45 }}>{selectedTicket.description}</p>
            </div>

            {/* Room Maintenance Hold Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f2', border: '1px solid #fbd9bf', padding: '10px 12px', borderRadius: 10, margin: '12px 0' }}>
              <div>
                <strong style={{ fontSize: 11, color: '#a14b43' }}>Room Floor Plan Maintenance Hold</strong>
                <div style={{ fontSize: 10, color: '#777' }}>
                  {rooms.find((r) => r.number === selectedTicket.roomNumber)?.status === 'Maintenance'
                    ? 'Room is currently locked under Maintenance on the floor plan.'
                    : 'Room is currently open for allocation.'}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleToggleRoomHold(selectedTicket.roomNumber)}
                data-testid="button-toggle-room-hold"
              >
                {rooms.find((r) => r.number === selectedTicket.roomNumber)?.status === 'Maintenance'
                  ? 'Remove Hold'
                  : 'Place on Hold'}
              </button>
            </div>

            {selectedTicket.status !== 'Resolved' && (
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                  Resolution Notes / Work Done:
                </label>
                <textarea
                  rows={2}
                  className="search-input"
                  style={{ width: '100%', height: 'auto', padding: 8 }}
                  placeholder="e.g. Replaced leaking valve and confirmed water pressure normal..."
                  value={resolutionComment}
                  onChange={(e) => setResolutionComment(e.target.value)}
                />
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setSelectedTicket(null)}>
                Close
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button
                  className="btn btn-dark"
                  onClick={() => handleMarkResolved(selectedTicket.id)}
                  data-testid="button-mark-resolved"
                >
                  <Check size={14} /> Mark Issue Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
