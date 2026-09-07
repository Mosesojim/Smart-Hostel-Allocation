import { FormEvent, useState } from 'react';
import {
  Check,
  ChevronRight,
  Heart,
  X,
  Building,
  Users,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  RequestStatus,
  AllocationStatus,
  PaymentStatus,
  Hostel,
  Preference,
  Room,
  AllocationRequest,
} from '../types';

export function StatusPill({
  status,
}: {
  status: RequestStatus | AllocationStatus | PaymentStatus | string;
}) {
  const normalized = status.toLowerCase().replace(' ', '-');
  return (
    <span
      className={`status ${
        normalized === 'approved' || normalized === 'allocated' || normalized === 'cleared'
          ? 'approved'
          : normalized === 'flagged'
          ? 'flagged'
          : normalized === 'pending-review' || normalized === 'pending'
          ? 'pending'
          : 'review'
      }`}
      data-testid={`status-${normalized}`}
    >
      {status}
    </span>
  );
}

export function RoomCard({
  hostel,
  onSelect,
  onSave,
  onApply,
}: {
  hostel: Hostel;
  onSelect: () => void;
  onSave: () => void;
  onApply?: () => void;
}) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article
      className="room-card"
      data-testid={`card-hostel-${hostel.name.toLowerCase().replaceAll(' ', '-')}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className="room-top">
        <div>
          <div className="room-number">{hostel.block}</div>
          <div className="room-hostel">{hostel.name}</div>
        </div>
        <button
          className="icon-button"
          style={{
            width: 32,
            height: 32,
            color: isSaved ? '#e0533c' : '#727780',
            background: isSaved ? '#fdf0ed' : '#fff',
          }}
          aria-label={`Save ${hostel.name}`}
          onClick={() => {
            setIsSaved(!isSaved);
            onSave();
          }}
          data-testid={`button-save-hostel-${hostel.block}`}
        >
          <Heart size={15} fill={isSaved ? '#e0533c' : 'none'} />
        </button>
      </div>

      <div
        className="room-illustration"
        style={{
          background:
            hostel.accent === 'sage'
              ? 'linear-gradient(135deg, #eef6f1 0%, #d8ece2 100%)'
              : hostel.accent === 'sand'
              ? 'linear-gradient(135deg, #faf6ed 0%, #f0e6d2 100%)'
              : 'linear-gradient(135deg, #fbf2eb 0%, #f7e0ce 100%)',
        }}
      >
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <span className="tag" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
            {hostel.gender || 'Co-ed'}
          </span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#686e77', marginBottom: 12, lineHeight: 1.45, flex: '1 0 auto' }}>
        {hostel.description}
      </div>

      <div className="room-meta" style={{ marginTop: 'auto' }}>
        <div>
          <div className="room-price">
            ₦{hostel.price.toLocaleString()} <span>/ session</span>
          </div>
          <div className="mini-meta" style={{ marginTop: 4 }}>
            <span className="tag">{hostel.capacity} sharing</span>
            <span className="tag sage">{hostel.available} left</span>
          </div>
        </div>
        <div className="match-score">
          <small>fit score</small>
          {hostel.name === 'Mango House' ? '94%' : hostel.name === 'Aster Court' ? '88%' : '81%'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onSelect}
          data-testid={`button-view-hostel-${hostel.block}`}
          style={{ width: '100%' }}
        >
          Details <ChevronRight size={13} />
        </button>
        <button
          className="btn btn-peach btn-sm"
          onClick={onApply || onSelect}
          data-testid={`button-apply-hostel-${hostel.block}`}
          style={{ width: '100%' }}
        >
          Select room
        </button>
      </div>
    </article>
  );
}

export function PreferenceModal({
  form,
  setForm,
  onClose,
  onSave,
}: {
  form: Preference;
  setForm: (value: Preference) => void;
  onClose: () => void;
  onSave: (event: FormEvent) => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={onSave} data-testid="modal-preferences" style={{ maxWidth: 520 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">Personalized Allocation</div>
            <h2>Room & Living Preferences</h2>
            <p>Our matching algorithm uses these signals to suggest your optimal room and roommates.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close preferences"
            data-testid="button-close-preferences"
          >
            <X size={16} />
          </button>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="room-type">Preferred Room Type</label>
            <select
              id="room-type"
              value={form.roomType}
              onChange={(event) => setForm({ ...form, roomType: event.target.value })}
              data-testid="select-room-type"
            >
              <option>Single room</option>
              <option>Double room</option>
              <option>Four-person room</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="floor">Preferred Floor</label>
            <select
              id="floor"
              value={form.floor}
              onChange={(event) => setForm({ ...form, floor: event.target.value })}
              data-testid="select-floor"
            >
              <option>Ground floor</option>
              <option>1st floor</option>
              <option>2nd floor</option>
              <option>3rd floor</option>
            </select>
          </div>

          <div className="field full">
            <label htmlFor="quiet-hours">Quiet & Study Hours</label>
            <select
              id="quiet-hours"
              value={form.quietHours}
              onChange={(event) => setForm({ ...form, quietHours: event.target.value })}
              data-testid="select-quiet-hours"
            >
              <option>9:00 pm to 5:00 am (Early sleeper)</option>
              <option>10:00 pm to 6:00 am (Standard)</option>
              <option>12:00 am to 8:00 am (Night study owl)</option>
            </select>
          </div>

          <div className="field full">
            <label htmlFor="roommate-reg">Preferred Roommate (Registration Number)</label>
            <input
              id="roommate-reg"
              value={form.roommateRegNo}
              onChange={(event) => setForm({ ...form, roommateRegNo: event.target.value })}
              placeholder="e.g. CSC/22/1192 or leave blank"
              data-testid="input-roommate-reg"
            />
            <span style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
              If your desired roommate also inputs your registration number (CSC/22/1048), you will be paired together.
            </span>
          </div>

          <div className="field full">
            <label htmlFor="special-needs">Special Housing Accommodations (Optional)</label>
            <input
              id="special-needs"
              value={form.specialNeeds || ''}
              onChange={(event) => setForm({ ...form, specialNeeds: event.target.value })}
              placeholder="e.g. Ground floor required for mobility, allergy restrictions"
              data-testid="input-special-needs"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-preferences">
            Cancel
          </button>
          <button type="submit" className="btn btn-dark" data-testid="button-save-preferences">
            Save preferences <Check size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function RoomModal({
  hostel,
  onClose,
  onToast,
  onConfirmAllocation,
}: {
  hostel: Hostel;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmAllocation?: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" data-testid="modal-room-details" style={{ maxWidth: 540 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">
              {hostel.block} · {hostel.location}
            </div>
            <h2>{hostel.name}</h2>
            <p>{hostel.description}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close room details"
            data-testid="button-close-room"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="room-illustration"
          style={{
            height: 140,
            background:
              hostel.accent === 'sage'
                ? 'linear-gradient(135deg, #eef6f1 0%, #d8ece2 100%)'
                : hostel.accent === 'sand'
                ? 'linear-gradient(135deg, #faf6ed 0%, #f0e6d2 100%)'
                : 'linear-gradient(135deg, #fbf2eb 0%, #f7e0ce 100%)',
          }}
        />

        <div className="preference-list" style={{ marginTop: 12 }}>
          <div className="preference-item">
            <small>Session fee</small>
            <strong>₦{hostel.price.toLocaleString()}</strong>
          </div>
          <div className="preference-item">
            <small>Available Spaces</small>
            <strong style={{ color: '#277f60' }}>{hostel.available} spaces open</strong>
          </div>
          <div className="preference-item">
            <small>Room Capacity</small>
            <strong>{hostel.capacity} students / room</strong>
          </div>
          <div className="preference-item">
            <small>Hostel Category</small>
            <strong>{hostel.gender || 'Standard'}</strong>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6 }}>Included Amenities:</div>
          <div className="mini-meta">
            {hostel.amenities.map((item) => (
              <span className="tag sage" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose} data-testid="button-back-room-details">
            Close
          </button>
          <button
            className="btn btn-dark"
            onClick={() => {
              if (onConfirmAllocation) {
                onConfirmAllocation();
              } else {
                onToast(`${hostel.name} selected as your primary hostel preference.`);
                onClose();
              }
            }}
            data-testid="button-shortlist-room"
          >
            <Check size={14} /> Request room in {hostel.block}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FloorGrid({
  rooms,
  selectedRoom,
  onSelect,
  compact = false,
  filterBlock,
}: {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelect: (room: Room) => void;
  compact?: boolean;
  filterBlock?: string;
}) {
  const filteredRooms = filterBlock
    ? rooms.filter((r) => r.block === filterBlock)
    : rooms;

  const shownRooms = compact ? filteredRooms.slice(0, 10) : filteredRooms;
  const availableCount = shownRooms.filter((room) => room.status === 'Available').length;
  const occupiedCount = shownRooms.filter((room) => room.status === 'Occupied').length;
  const maintenanceCount = shownRooms.filter((room) => room.status === 'Maintenance').length;

  return (
    <div className="floor-map">
      <div className="floor-head">
        <div>
          <strong>{filterBlock ? `${filterBlock} Floor Layout` : compact ? 'Live Block Floor View' : 'All Campus Blocks'}</strong>
          <span style={{ display: 'block', fontSize: 10, color: '#888', marginTop: 2 }}>
            {shownRooms.length} rooms mapped
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="tag sage">{availableCount} Free</span>
          <span className="tag">{occupiedCount} Filled</span>
          {maintenanceCount > 0 && <span className="tag peach">{maintenanceCount} Maint</span>}
        </div>
      </div>

      <div
        className="floor-grid"
        style={{
          gridTemplateColumns: compact ? 'repeat(5, minmax(0, 1fr))' : 'repeat(auto-fill, minmax(70px, 1fr))',
        }}
      >
        {shownRooms.map((room) => (
          <button
            key={room.number}
            className={`floor-room ${room.status.toLowerCase()} ${
              selectedRoom?.number === room.number ? 'selected' : ''
            }`}
            onClick={() => onSelect(room)}
            data-testid={`button-floor-room-${room.number}`}
            title={`Room ${room.number} (${room.type}, Floor ${room.floor}): ${room.status}`}
          >
            <small>{room.number}</small>
            <span>{room.status}</span>
          </button>
        ))}
      </div>

      <div className="legend">
        <span>
          <i /> Available
        </span>
        <span>
          <i className="occupied-dot" /> Occupied
        </span>
        <span>
          <i className="maintenance-dot" /> Maintenance
        </span>
      </div>
    </div>
  );
}

export function ReassignModal({
  request,
  rooms,
  onClose,
  onConfirm,
}: {
  request: AllocationRequest;
  rooms: Room[];
  onClose: () => void;
  onConfirm: (targetRoom: string) => void;
}) {
  const availableRooms = rooms.filter((r) => r.status === 'Available');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(
    availableRooms[0]?.number || 'B-101'
  );

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">Room Allocation Action</div>
            <h2>Reassign Student</h2>
            <p>Assign an available room to <strong>{request.student.name}</strong> ({request.student.regNo}).</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="preference-list" style={{ marginBottom: 16 }}>
          <div className="preference-item">
            <small>Department</small>
            <strong>{request.department}</strong>
          </div>
          <div className="preference-item">
            <small>Current Allocated Room</small>
            <strong>{request.room}</strong>
          </div>
          <div className="preference-item">
            <small>Match Fit Score</small>
            <strong style={{ color: '#277f60' }}>{request.matchScore}% fit</strong>
          </div>
          <div className="preference-item">
            <small>Payment Status</small>
            <strong>{request.student.paymentStatus}</strong>
          </div>
        </div>

        <div className="field full">
          <label htmlFor="select-reassign-room">Select Target Available Room</label>
          <select
            id="select-reassign-room"
            value={selectedRoomNumber}
            onChange={(e) => setSelectedRoomNumber(e.target.value)}
          >
            {availableRooms.map((room) => (
              <option key={room.number} value={room.number}>
                {room.number} ({room.block} · {room.type} room · Floor {room.floor})
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions" style={{ marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-dark"
            onClick={() => onConfirm(selectedRoomNumber)}
            data-testid="button-confirm-reassign"
          >
            <Check size={14} /> Assign to {selectedRoomNumber}
          </button>
        </div>
      </div>
    </div>
  );
}

export function IndividualRoomCard({
  room,
  hostel,
  onSelect,
  onApply,
  matchScore = 90,
}: {
  room: Room;
  hostel?: Hostel;
  onSelect: () => void;
  onApply?: () => void;
  matchScore?: number;
}) {
  const isVacant = room.status === 'Available';
  const isOccupied = room.status === 'Occupied';
  const isMaintenance = room.status === 'Maintenance';

  return (
    <article
      className="room-card"
      data-testid={`card-room-${room.number.toLowerCase()}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderColor: isVacant ? '#c5ebd9' : undefined,
        background: isOccupied ? '#fcfdfe' : '#ffffff',
      }}
    >
      <div className="room-top">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="room-number" style={{ fontSize: 20 }}>
              {room.number}
            </span>
            {isVacant && (
              <span className="tag sage" style={{ fontSize: 10 }}>
                <Check size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} /> Vacant
              </span>
            )}
            {isOccupied && (
              <span className="tag" style={{ fontSize: 10, background: '#edeef0', color: '#7a8089' }}>
                Occupied
              </span>
            )}
            {isMaintenance && (
              <span className="tag peach" style={{ fontSize: 10 }}>
                Maintenance
              </span>
            )}
          </div>
          <div className="room-hostel" style={{ marginTop: 3 }}>
            {hostel?.name || room.block} · Floor {room.floor}
          </div>
        </div>

        <div className="match-score" style={{ textAlign: 'right' }}>
          <small>fit score</small>
          <span style={{ color: isVacant ? '#277f60' : '#888' }}>{matchScore}%</span>
        </div>
      </div>

      <div
        style={{
          margin: '12px 0',
          padding: '10px 12px',
          background: isVacant ? '#f4fbf7' : isOccupied ? '#f8f9fa' : '#fff8f2',
          borderRadius: 10,
          fontSize: 11,
          border: `1px solid ${isVacant ? '#d9f2e4' : isOccupied ? '#ebedf0' : '#fbe5d3'}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: '#686e77' }}>Room Type:</span>
          <strong>{room.type} Room ({room.capacity} beds)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#686e77' }}>Status:</span>
          <strong style={{ color: isVacant ? '#247357' : isOccupied ? '#666' : '#b26829' }}>
            {isVacant
              ? 'Ready for allocation'
              : isOccupied
              ? `Filled (${room.occupants?.length || room.capacity} students)`
              : 'Maintenance hold'}
          </strong>
        </div>
        {room.occupants && room.occupants.length > 0 && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px dashed #dedede', fontSize: 10, color: '#6e737c' }}>
            Occupants: {room.occupants.join(', ')}
          </div>
        )}
      </div>

      <div className="room-meta" style={{ marginTop: 'auto' }}>
        <div>
          <div className="room-price">
            ₦{(hostel?.price || 185000).toLocaleString()} <span>/ session</span>
          </div>
          <div className="mini-meta" style={{ marginTop: 4 }}>
            <span className="tag">{room.block}</span>
            <span className="tag">Floor {room.floor}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isVacant ? '1fr 1.2fr' : '1fr', gap: 8, marginTop: 14 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onSelect}
          data-testid={`button-details-room-${room.number}`}
          style={{ width: '100%' }}
        >
          Details <ChevronRight size={13} />
        </button>
        {isVacant && (
          <button
            className="btn btn-peach btn-sm"
            onClick={onApply || onSelect}
            data-testid={`button-select-room-${room.number}`}
            style={{ width: '100%' }}
          >
            Select room
          </button>
        )}
      </div>
    </article>
  );
}

export function IndividualRoomModal({
  room,
  hostel,
  onClose,
  onToast,
  onConfirm,
}: {
  room: Room;
  hostel?: Hostel;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirm?: () => void;
}) {
  const isVacant = room.status === 'Available';
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" data-testid="modal-individual-room" style={{ maxWidth: 520 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">
              {room.block} · Floor {room.floor}
            </div>
            <h2>Room {room.number} ({hostel?.name || room.block})</h2>
            <p>{hostel?.description || `Campus living space on floor ${room.floor} in ${room.block}.`}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close room details"
            data-testid="button-close-individual-room"
          >
            <X size={16} />
          </button>
        </div>

        <div className="preference-list" style={{ marginTop: 12 }}>
          <div className="preference-item">
            <small>Room Status</small>
            <strong style={{ color: isVacant ? '#277f60' : room.status === 'Occupied' ? '#555' : '#c27838' }}>
              {isVacant ? 'Vacant & Available' : room.status === 'Occupied' ? 'Occupied' : 'Under Maintenance'}
            </strong>
          </div>
          <div className="preference-item">
            <small>Session Fee</small>
            <strong>₦{(hostel?.price || 185000).toLocaleString()}</strong>
          </div>
          <div className="preference-item">
            <small>Room Capacity</small>
            <strong>{room.capacity} students ({room.type})</strong>
          </div>
          <div className="preference-item">
            <small>Floor Level</small>
            <strong>Floor {room.floor}</strong>
          </div>
        </div>

        {room.occupants && room.occupants.length > 0 && (
          <div style={{ marginTop: 14, background: '#f8f9fa', padding: 12, borderRadius: 12, fontSize: 11 }}>
            <strong style={{ display: 'block', marginBottom: 4, color: '#333' }}>Current Assigned Occupants:</strong>
            <div style={{ color: '#666' }}>{room.occupants.join(' · ')}</div>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6 }}>Hostel Block Amenities:</div>
          <div className="mini-meta">
            {(hostel?.amenities || ['High-speed Wi-Fi', 'Study Desk', '24/7 Security', 'Backup Power']).map((item) => (
              <span className="tag sage" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose} data-testid="button-close-room-modal">
            Close
          </button>
          {isVacant ? (
            <button
              className="btn btn-dark"
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onToast(`Room ${room.number} selected! Transfer request registered.`);
                  onClose();
                }
              }}
              data-testid="button-confirm-room-selection"
            >
              <Check size={14} /> Request Room {room.number}
            </button>
          ) : (
            <button
              className="btn btn-ghost"
              onClick={() => {
                onToast(`Added to waitlist for Room ${room.number}.`);
                onClose();
              }}
              data-testid="button-waitlist-room"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
