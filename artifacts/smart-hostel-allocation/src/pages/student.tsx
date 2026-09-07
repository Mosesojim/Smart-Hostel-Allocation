import { useState, FormEvent, useMemo } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  DoorOpen,
  Home,
  Settings,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  Search,
  Download,
  Users,
  Building,
  Shield,
  FileCheck2,
  X,
  Filter,
  Eye,
  EyeOff,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { Link } from 'wouter';
import { Preference, Hostel, Room } from '../types';
import { hostels, student, rooms as allRooms } from '../data';
import {
  PreferenceModal,
  RoomModal,
  RoomCard,
  IndividualRoomCard,
  IndividualRoomModal,
} from '../components/ui';

export function StudentPortal({
  preference,
  setPreference,
  onToast,
}: {
  preference: Preference;
  setPreference: (value: Preference) => void;
  onToast: (message: string) => void;
}) {
  const [modal, setModal] = useState<'preferences' | 'room' | 'slip' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Hostel | null>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(preference);

  const openPreferences = () => {
    setForm(preference);
    setModal('preferences');
  };

  const savePreferences = (event: FormEvent) => {
    event.preventDefault();
    setPreference(form);
    setModal(null);
    setSaved(true);
    onToast('Preferences saved. Your room fit score has been re-evaluated.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div data-testid="page-student">
      {/* Stat Cards - responsive 1, 2, 4 columns */}
      <div className="stat-grid reveal" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card stat-card dark-card">
          <span className="stat-label">Allocation status</span>
          <strong className="stat-number" style={{ fontSize: 22, letterSpacing: '-.05em' }}>
            Allocated
          </strong>
          <span className="stat-foot">
            <Check size={13} color="#a8e6cf" /> Confirmed for 2026/27 Session
          </span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Room Match Score</span>
          <strong className="stat-number">
            94<span style={{ fontSize: 16 }}>%</span>
          </strong>
          <span className="stat-foot">
            <span className="trend-up">+8 pts</span> matching study quiet hours
          </span>
        </div>

        <div className="card stat-card sage-card">
          <span className="stat-label">Payment status</span>
          <strong className="stat-number" style={{ fontSize: 22 }}>
            Cleared
          </strong>
          <span className="stat-foot">
            <WalletCards size={13} /> Receipt #HV-2026-8812
          </span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Official Move-in Day</span>
          <strong className="stat-number" style={{ fontSize: 22 }}>
            Sep 08
          </strong>
          <span className="stat-foot">
            <Clock3 size={13} /> 7 days until orientation
          </span>
        </div>
      </div>

      {/* Allocation Banner & Journey */}
      <div className="dashboard-grid">
        <section className="allocation-banner reveal delay-1">
          <div className="banner-kicker">Official Room Allocation</div>
          <h2 className="banner-title">Mango House, Room B-214</h2>
          <p className="banner-copy">
            Matched with <strong>Victory Okafor</strong> ({student.regNo}) based on 2nd-floor double room preference and synchronized night study hours.
          </p>

          <div className="banner-bottom">
            <div className="room-code">Block B · 2nd Floor</div>
            <button
              className="btn btn-dark btn-sm"
              onClick={() => {
                setSelectedRoom(hostels[0]);
                setModal('room');
              }}
              data-testid="button-view-allocation"
            >
              Room details <ChevronRight size={13} />
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setModal('slip')}
              data-testid="button-view-slip"
              style={{ background: 'rgba(255,255,255,0.7)', color: '#181818' }}
            >
              <Download size={13} /> Allocation Slip
            </button>
          </div>

          <div className="progress-ring">
            <span className="progress-value">94%</span>
          </div>
        </section>

        <section className="card card-pad reveal delay-2">
          <div className="section-heading">
            <div>
              <h2>Allocation Journey</h2>
              <p>Current academic session progress</p>
            </div>
            <span className="tag sage">Allocated</span>
          </div>

          <div className="timeline">
            <div className="timeline-row done">
              <div className="timeline-dot">
                <Check size={12} />
              </div>
              <div className="timeline-content">
                <strong>Hostel Application Submitted</strong>
                <span>Aug 12, 2026 · Form verified</span>
              </div>
            </div>

            <div className="timeline-row done">
              <div className="timeline-dot">
                <Check size={12} />
              </div>
              <div className="timeline-content">
                <strong>Hostel Fee Cleared</strong>
                <span>Aug 16, 2026 · Payment receipt #HV-2026-8812</span>
              </div>
            </div>

            <div className="timeline-row current">
              <div className="timeline-dot">
                <Home size={11} />
              </div>
              <div className="timeline-content">
                <strong>Room B-214 Assigned</strong>
                <span>Assigned to Mango House with roommate</span>
              </div>
            </div>

            <div className="timeline-row">
              <div className="timeline-dot">
                <DoorOpen size={11} />
              </div>
              <div className="timeline-content">
                <strong>Check-In & Key Collection</strong>
                <span>Sep 08, 2026 · Hall Warden Office</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Services Row: Roommate Pairing, Fee Payment & Maintenance */}
      <div className="three-col reveal delay-2" style={{ marginBottom: 18 }}>
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#277f60' }}>Roommate Pairing</div>
            <span className="tag sage">96% Matched</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>Farouk Mustapha</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Mutual pair in Room B-214. Compatible night owl study schedule.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/student/roommates" className="btn btn-ghost btn-sm" style={{ width: '100%' }} data-testid="link-roommates-overview">
              Roommate Desk <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#b26829' }}>Fee Verification</div>
            <span className="tag sage">Cleared (₦185k)</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>Remita RRR & Clearance</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Submit payment e-receipts, track bursary audits, and get your digital gate pass.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/student/payments" className="btn btn-dark btn-sm" style={{ width: '100%' }} data-testid="link-payments-overview">
              Payment & Pass <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: '#0284c7' }}>Room Maintenance</div>
            <span className="tag sage">Desk Ready</span>
          </div>
          <h3 style={{ fontSize: 16, margin: '6px 0 4px' }}>B-214 Service Desk</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Report electrical, plumbing, fan, or lock issues directly to technicians.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/student/maintenance" className="btn btn-ghost btn-sm" style={{ width: '100%' }} data-testid="link-maintenance-overview">
              Lodge Issue <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Available Hostels Grid & Preference Box */}
      <div className="two-col">
        <section className="card card-pad reveal delay-2">
          <div className="section-heading">
            <div>
              <h2>Recommended Campus Hostels</h2>
              <p>Ranked by location, amenities & compatibility</p>
            </div>
            <Link href="/student/rooms" className="btn btn-ghost btn-sm" data-testid="link-see-all-rooms">
              Explore all <ArrowUpRight size={13} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {hostels.map((hostel) => (
              <RoomCard
                key={hostel.name}
                hostel={hostel}
                onSelect={() => {
                  setSelectedRoom(hostel);
                  setModal('room');
                }}
                onSave={() => onToast(`${hostel.name} saved to your housing bookmarks.`)}
                onApply={() => {
                  setSelectedRoom(hostel);
                  setModal('room');
                }}
              />
            ))}
          </div>
        </section>

        <section className="card card-pad reveal delay-3">
          <div className="section-heading">
            <div>
              <h2>Your Housing Preferences</h2>
              <p>Active parameters matching your room</p>
            </div>
            <button
              className="icon-button"
              onClick={openPreferences}
              aria-label="Edit preferences"
              data-testid="button-edit-preferences"
            >
              <Settings size={15} />
            </button>
          </div>

          {saved && (
            <div className="notice" style={{ marginBottom: 14 }}>
              Preferences updated. Room matches recalculated successfully.
            </div>
          )}

          <div className="preference-list">
            <div className="preference-item">
              <small>Room Type</small>
              <strong>{preference.roomType}</strong>
            </div>
            <div className="preference-item">
              <small>Preferred Floor</small>
              <strong>{preference.floor}</strong>
            </div>
            <div className="preference-item">
              <small>Quiet Study Hours</small>
              <strong>{preference.quietHours}</strong>
            </div>
            <div className="preference-item">
              <small>Preferred Roommate</small>
              <strong>{preference.roommateRegNo || 'Any compatible'}</strong>
            </div>
          </div>

          <div
            style={{
              background: '#f8f9fa',
              borderRadius: 12,
              padding: 12,
              marginTop: 14,
              fontSize: 11,
              color: '#555',
            }}
          >
            <div style={{ fontWeight: 700, color: '#181818', marginBottom: 4 }}>
              Roommate Cross-Match:
            </div>
            Matched with <strong>Farouk M.</strong> ({preference.roommateRegNo}) in B-214 with 94% compatibility index.
          </div>

          <button
            className="btn btn-dark"
            onClick={openPreferences}
            data-testid="button-update-preferences"
            style={{ width: '100%', marginTop: 14 }}
          >
            Update preferences <SlidersHorizontal size={14} />
          </button>
        </section>
      </div>

      {/* Modals */}
      {modal === 'preferences' && (
        <PreferenceModal
          form={form}
          setForm={setForm}
          onClose={() => setModal(null)}
          onSave={savePreferences}
        />
      )}

      {modal === 'room' && selectedRoom && (
        <RoomModal
          hostel={selectedRoom}
          onClose={() => setModal(null)}
          onToast={onToast}
          onConfirmAllocation={() => {
            onToast(`Allocation preference updated to ${selectedRoom.name} (${selectedRoom.block}).`);
            setModal(null);
          }}
        />
      )}

      {modal === 'slip' && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Digital Allocation Pass</div>
                <h2>Hostel Clearance Slip</h2>
                <p>Present this slip upon arrival at the Hall Warden Office.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setModal(null)}
                aria-label="Close slip"
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                border: '2px dashed #e0e2e5',
                borderRadius: 16,
                padding: 18,
                background: '#fafbfc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Victory Okafor</div>
                  <div style={{ fontSize: 11, color: '#777', fontFamily: 'var(--app-font-mono)' }}>
                    CSC/22/1048 · Computer Science (300L)
                  </div>
                </div>
                <span className="tag sage">Cleared & Verified</span>
              </div>

              <div className="preference-list" style={{ gap: 8 }}>
                <div className="preference-item">
                  <small>Allocated Hostel</small>
                  <strong>Mango House (Block B)</strong>
                </div>
                <div className="preference-item">
                  <small>Room Number</small>
                  <strong>Room B-214</strong>
                </div>
                <div className="preference-item">
                  <small>Room Type</small>
                  <strong>Double Room (2-Bed)</strong>
                </div>
                <div className="preference-item">
                  <small>Academic Session</small>
                  <strong>2026/2027</strong>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 10, color: '#666', borderTop: '1px solid #eee', paddingTop: 10 }}>
                Verification Hash: <span style={{ fontFamily: 'var(--app-font-mono)' }}>HV-2026-CSC-B214-94AF</span>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Close
              </button>
              <button
                className="btn btn-dark"
                onClick={() => {
                  onToast('Allocation clearance slip downloaded as PDF.');
                  setModal(null);
                }}
              >
                <Download size={14} /> Download PDF Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentRooms({ onToast }: { onToast: (message: string) => void }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All room types');
  const [blockFilter, setBlockFilter] = useState('All campus blocks');
  const [floorFilter, setFloorFilter] = useState('All floors');
  const [hideOccupied, setHideOccupied] = useState(false);
  const [viewMode, setViewMode] = useState<'units' | 'blocks'>('units');
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedRoomUnit, setSelectedRoomUnit] = useState<Room | null>(null);

  // Map block names to hostel config
  const getHostel = (block: string) => {
    if (block.includes('Block B') || block === 'Block B') return hostels[0];
    if (block.includes('Block D') || block === 'Block D') return hostels[1];
    return hostels[2];
  };

  // Filter individual room units
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      const hostel = getHostel(room.block);
      const matchesSearch =
        `${room.number} ${room.block} ${hostel.name} ${room.type} ${room.status} ${room.occupants?.join(' ') || ''}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === 'All room types' ||
        (type === 'Single rooms' && room.type === 'Single') ||
        (type === 'Double rooms' && room.type === 'Double') ||
        (type === 'Four-person rooms' && (room.type === 'Four-person' || room.capacity === 4));

      const matchesBlock =
        blockFilter === 'All campus blocks' ||
        (blockFilter === 'Block B (Mango House)' && room.block === 'Block B') ||
        (blockFilter === 'Block A (The Lantern)' && room.block === 'Block A') ||
        (blockFilter === 'Block D (Aster Court)' && room.block === 'Block D');

      const matchesFloor =
        floorFilter === 'All floors' ||
        (floorFilter === '1st Floor' && room.floor === 1) ||
        (floorFilter === '2nd Floor' && room.floor === 2) ||
        (floorFilter === '3rd Floor' && room.floor === 3);

      // Hide occupied filter logic: if hideOccupied is true, exclude occupied rooms
      const matchesOccupancy = !hideOccupied || room.status === 'Available';

      return matchesSearch && matchesType && matchesBlock && matchesFloor && matchesOccupancy;
    });
  }, [search, type, blockFilter, floorFilter, hideOccupied]);

  // Filter hostel blocks
  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      const matchesSearch =
        `${hostel.name} ${hostel.block} ${hostel.location} ${hostel.amenities.join(' ')}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === 'All room types' ||
        (type === 'Double rooms' && hostel.capacity === 2) ||
        (type === 'Four-person rooms' && hostel.capacity === 4);

      const matchesBlock =
        blockFilter === 'All campus blocks' ||
        (blockFilter === 'Block B (Mango House)' && hostel.block === 'Block B') ||
        (blockFilter === 'Block A (The Lantern)' && hostel.block === 'Block A') ||
        (blockFilter === 'Block D (Aster Court)' && hostel.block === 'Block D');

      const matchesOccupancy = !hideOccupied || hostel.available > 0;

      return matchesSearch && matchesType && matchesBlock && matchesOccupancy;
    });
  }, [search, type, blockFilter, hideOccupied]);

  const totalAvailableRooms = allRooms.filter((r) => r.status === 'Available').length;
  const totalOccupiedRooms = allRooms.filter((r) => r.status === 'Occupied').length;
  const totalMaintenanceRooms = allRooms.filter((r) => r.status === 'Maintenance').length;

  const resetAllFilters = () => {
    setSearch('');
    setType('All room types');
    setBlockFilter('All campus blocks');
    setFloorFilter('All floors');
    setHideOccupied(false);
  };

  return (
    <div data-testid="page-student-rooms">
      {/* Room Discovery Header */}
      <div className="card card-pad" style={{ marginBottom: 18, background: '#f4c59e', border: 0 }}>
        <div className="eyebrow">Room Discovery & Allocation</div>
        <h2 style={{ fontSize: 26, letterSpacing: '-.06em', margin: '8px 0 5px' }}>
          Explore Campus Hostels & Rooms
        </h2>
        <p style={{ color: '#765e4a', fontSize: 12, margin: 0 }}>
          Browse available room units across all blocks. Toggle the vacant filter to hide occupied rooms and spot open spaces instantly.
        </p>
      </div>

      {/* Main Filter & Action Toolbar */}
      <div className="card card-pad" style={{ marginBottom: 20, padding: '16px 18px' }}>
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <div>
            <div className="eyebrow">Room Directory</div>
            <h2 style={{ fontSize: 20, margin: '4px 0 0', letterSpacing: '-.05em' }}>
              {viewMode === 'units'
                ? `${filteredRooms.length} room units shown`
                : `${filteredHostels.length} hostel blocks available`}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* View Mode Segmented Switcher */}
            <div className="view-tabs" role="tablist" aria-label="Room browsing view modes">
              <button
                type="button"
                className={`view-tab ${viewMode === 'units' ? 'active' : ''}`}
                onClick={() => setViewMode('units')}
                data-testid="tab-view-units"
                role="tab"
                aria-selected={viewMode === 'units'}
              >
                <LayoutGrid size={13} /> Room Units ({allRooms.length})
              </button>
              <button
                type="button"
                className={`view-tab ${viewMode === 'blocks' ? 'active' : ''}`}
                onClick={() => setViewMode('blocks')}
                data-testid="tab-view-blocks"
                role="tab"
                aria-selected={viewMode === 'blocks'}
              >
                <Building size={13} /> Hostel Blocks ({hostels.length})
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="filter-row" style={{ gap: 10 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 190 }}>
            <Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 12 }} />
            <input
              className="search-input"
              style={{ paddingLeft: 32, width: '100%' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room number, block, or amenities"
              data-testid="input-search-rooms"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 10,
                  background: 'transparent',
                  border: 0,
                  color: '#999',
                  cursor: 'pointer',
                  padding: 2,
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Block Filter */}
          <select
            className="select"
            value={blockFilter}
            onChange={(event) => setBlockFilter(event.target.value)}
            data-testid="select-block-filter"
            aria-label="Filter by block"
          >
            <option>All campus blocks</option>
            <option>Block B (Mango House)</option>
            <option>Block A (The Lantern)</option>
            <option>Block D (Aster Court)</option>
          </select>

          {/* Room Type Filter */}
          <select
            className="select"
            value={type}
            onChange={(event) => setType(event.target.value)}
            data-testid="select-room-filter"
            aria-label="Filter by room type"
          >
            <option>All room types</option>
            <option>Single rooms</option>
            <option>Double rooms</option>
            <option>Four-person rooms</option>
          </select>

          {/* Floor Filter (when in units view) */}
          {viewMode === 'units' && (
            <select
              className="select"
              value={floorFilter}
              onChange={(event) => setFloorFilter(event.target.value)}
              data-testid="select-floor-filter"
              aria-label="Filter by floor"
            >
              <option>All floors</option>
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
            </select>
          )}

          {/* Hide Occupied Rooms Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={hideOccupied}
            onClick={() => {
              const nextState = !hideOccupied;
              setHideOccupied(nextState);
              onToast(
                nextState
                  ? `Filtered: Showing only vacant rooms (${totalAvailableRooms} available).`
                  : 'Showing all campus rooms including occupied spaces.'
              );
            }}
            className={`filter-toggle ${hideOccupied ? 'active' : ''}`}
            data-testid="toggle-hide-occupied"
            id="toggle-hide-occupied"
            title={hideOccupied ? 'Hide occupied rooms is ON (Click to show all)' : 'Click to hide occupied rooms and show only vacant options'}
          >
            <span className={`switch-track ${hideOccupied ? 'active' : ''}`}>
              <span className={`switch-thumb ${hideOccupied ? 'active' : ''}`} />
            </span>
            <span style={{ fontWeight: 700 }}>
              {hideOccupied ? 'Hide occupied rooms (ON)' : 'Hide occupied rooms'}
            </span>
            {hideOccupied ? (
              <span
                className="tag sage"
                style={{ fontSize: 9, padding: '2px 7px', background: '#d7f2e4', color: '#145c46' }}
              >
                <EyeOff size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                Vacant only
              </span>
            ) : (
              <span className="tag" style={{ fontSize: 9, padding: '2px 7px' }}>
                All rooms
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Indicators / Quick Stats bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #f0f1f3',
            flexWrap: 'wrap',
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#888d96', fontWeight: 600 }}>Room Availability:</span>
            <button
              type="button"
              onClick={() => setHideOccupied(true)}
              className="tag sage"
              style={{
                cursor: 'pointer',
                border: hideOccupied ? '1.5px solid #277f60' : '1px solid transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              title="Click to filter vacant rooms only"
              data-testid="badge-vacant-count"
            >
              <Check size={11} /> {totalAvailableRooms} Vacant Rooms
            </button>
            <button
              type="button"
              onClick={() => setHideOccupied(false)}
              className="tag"
              style={{
                cursor: 'pointer',
                border: !hideOccupied ? '1.5px solid #888' : '1px solid transparent',
                color: hideOccupied ? '#999' : '#555',
                textDecoration: hideOccupied ? 'line-through' : 'none',
              }}
              title={hideOccupied ? 'Occupied rooms currently hidden' : 'Occupied rooms count'}
              data-testid="badge-occupied-count"
            >
              {totalOccupiedRooms} Occupied {hideOccupied && '(Hidden)'}
            </button>
            <span className="tag peach">{totalMaintenanceRooms} Maintenance</span>
          </div>

          {hideOccupied && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#eef9f4',
                padding: '4px 10px',
                borderRadius: 8,
                color: '#17604a',
                fontWeight: 600,
              }}
              data-testid="banner-hide-occupied-active"
            >
              <Sparkles size={13} color="#277f60" />
              <span>Vacant mode active: {totalOccupiedRooms} occupied rooms hidden</span>
              <button
                type="button"
                onClick={() => setHideOccupied(false)}
                className="btn btn-ghost btn-sm"
                style={{ height: 22, padding: '0 7px', fontSize: 10, background: '#fff' }}
                data-testid="button-disable-vacant-filter"
              >
                Show all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {viewMode === 'units' ? (
        filteredRooms.length === 0 ? (
          <div className="empty-state card" data-testid="empty-room-results">
            <div className="empty-state-mark">
              <Search size={19} />
            </div>
            <strong>No matching room units found</strong>
            <p>
              {hideOccupied
                ? 'No vacant rooms match your current search criteria. Try disabling "Hide occupied rooms" or clearing filters.'
                : 'Try searching for a different block name or resetting your room type and floor filters.'}
            </p>
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetAllFilters}
              data-testid="button-clear-room-filter"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filteredRooms.map((room) => {
              const hostel = getHostel(room.block);
              // Calculate custom fit score matching student's preferences (2nd floor, double room)
              let matchScore = 80;
              if (room.floor === 2) matchScore += 8;
              if (room.type === 'Double') matchScore += 6;
              if (room.block === 'Block B') matchScore += 4;
              if (room.number === 'B-214') matchScore = 94;

              return (
                <IndividualRoomCard
                  key={room.number}
                  room={room}
                  hostel={hostel}
                  matchScore={matchScore}
                  onSelect={() => setSelectedRoomUnit(room)}
                  onApply={() => {
                    if (room.status === 'Available') {
                      onToast(`Allocation preference requested for Room ${room.number} (${hostel.name}).`);
                      setSelectedRoomUnit(null);
                    } else {
                      setSelectedRoomUnit(room);
                    }
                  }}
                />
              );
            })}
          </div>
        )
      ) : filteredHostels.length === 0 ? (
        <div className="empty-state card" data-testid="empty-room-results">
          <div className="empty-state-mark">
            <Search size={19} />
          </div>
          <strong>No matching hostel blocks found</strong>
          <p>Try searching for a different block name or resetting your room type filter.</p>
          <button
            className="btn btn-ghost btn-sm"
            onClick={resetAllFilters}
            data-testid="button-clear-room-filter"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filteredHostels.map((hostel) => (
            <RoomCard
              key={hostel.name}
              hostel={hostel}
              onSelect={() => setSelectedHostel(hostel)}
              onSave={() => onToast(`${hostel.name} saved to your bookmarks.`)}
              onApply={() => setSelectedHostel(hostel)}
            />
          ))}
        </div>
      )}

      {/* Allocation policy notice */}
      <div className="notice" style={{ marginTop: 20 }}>
        <CircleAlert size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Rooms are allocated on a rolling basis according to algorithm match scores and verified bursary payments. Your current allocation in <strong>Room B-214</strong> remains safely reserved.
      </div>

      {/* Hostel Block Details Modal */}
      {selectedHostel && (
        <RoomModal
          hostel={selectedHostel}
          onClose={() => setSelectedHostel(null)}
          onToast={onToast}
          onConfirmAllocation={() => {
            onToast(`Request submitted to transfer preference to ${selectedHostel.name}.`);
            setSelectedHostel(null);
          }}
        />
      )}

      {/* Individual Room Unit Details Modal */}
      {selectedRoomUnit && (
        <IndividualRoomModal
          room={selectedRoomUnit}
          hostel={getHostel(selectedRoomUnit.block)}
          onClose={() => setSelectedRoomUnit(null)}
          onToast={onToast}
          onConfirm={() => {
            onToast(`Request submitted to allocate Room ${selectedRoomUnit.number} in ${selectedRoomUnit.block}.`);
            setSelectedRoomUnit(null);
          }}
        />
      )}
    </div>
  );
}

export function StudentPreferences({
  preference,
  setPreference,
  onToast,
}: {
  preference: Preference;
  setPreference: (value: Preference) => void;
  onToast: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(preference);

  const save = (event: FormEvent) => {
    event.preventDefault();
    setPreference(form);
    setEditing(false);
    onToast('Your preferences have been updated and algorithm matches refreshed.');
  };

  return (
    <div data-testid="page-student-preferences">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Smart Matching Engine</div>
          <h2 style={{ fontSize: 27, letterSpacing: '-.06em', marginTop: 6 }}>
            Personalize Your Housing Criteria
          </h2>
          <p>We balance your study patterns, floor requirements, and roommate requests.</p>
        </div>
        <button
          className="btn btn-dark"
          onClick={() => {
            setForm(preference);
            setEditing(true);
          }}
          data-testid="button-edit-preferences-page"
        >
          <Settings size={14} /> Edit preferences
        </button>
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <div className="section-heading">
            <div>
              <h2>Current Saved Parameters</h2>
              <p>Active for Victory Okafor (CSC/22/1048)</p>
            </div>
            <span className="tag sage">Active in Engine</span>
          </div>

          <div className="preference-list">
            <div className="preference-item">
              <small>Room Type</small>
              <strong>{preference.roomType}</strong>
            </div>
            <div className="preference-item">
              <small>Preferred Floor</small>
              <strong>{preference.floor}</strong>
            </div>
            <div className="preference-item">
              <small>Quiet Hours</small>
              <strong>{preference.quietHours}</strong>
            </div>
            <div className="preference-item">
              <small>Target Roommate</small>
              <strong>{preference.roommateRegNo || 'None specified'}</strong>
            </div>
            <div className="preference-item">
              <small>Study Habit Preference</small>
              <strong>{preference.studyHabit || 'Evening / Night'}</strong>
            </div>
            <div className="preference-item">
              <small>Special Accommodation</small>
              <strong>{preference.specialNeeds || 'None'}</strong>
            </div>
          </div>

          <div className="notice" style={{ marginTop: 18 }}>
            <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Your current room (<strong>B-214</strong>) was allocated with a <strong>94% match score</strong> matching your 2nd floor and quiet hours criteria.
          </div>
        </section>

        <section className="card card-pad" style={{ background: '#e7f5ef' }}>
          <Sparkles size={20} color="#3d8469" />
          <h2 style={{ fontSize: 21, letterSpacing: '-.05em', margin: '18px 0 7px' }}>
            How Smart Allocation Matches You
          </h2>
          <p style={{ color: '#5a8777', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            Our algorithmic engine minimizes roommate friction and enhances academic focus by pairing students with complementary sleep schedules, department needs, and verified clearance.
          </p>

          <div
            style={{
              borderTop: '1px solid rgba(58,130,101,.18)',
              paddingTop: 14,
              marginTop: 20,
              fontSize: 11,
              color: '#477762',
            }}
          >
            <strong>Active Matching Signals</strong>
            <div className="mini-meta" style={{ marginTop: 8 }}>
              <span className="tag sage">Sleep & Quiet Hours (35%)</span>
              <span className="tag sage">Department & Level (25%)</span>
              <span className="tag sage">Floor & Accessibility (20%)</span>
              <span className="tag sage">Mutual Roommate Pairing (20%)</span>
            </div>
          </div>
        </section>
      </div>

      {editing && (
        <PreferenceModal
          form={form}
          setForm={setForm}
          onClose={() => setEditing(false)}
          onSave={save}
        />
      )}
    </div>
  );
}
