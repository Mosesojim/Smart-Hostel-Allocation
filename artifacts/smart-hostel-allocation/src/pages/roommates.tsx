import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Check,
  X,
  Copy,
  Clock,
  Volume2,
  Sparkle,
  Moon,
  Sun,
  Shield,
  UserPlus,
  Send,
  Heart,
  ChevronRight,
  Filter,
  CheckCheck,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { Preference, RoommateCandidate } from '../types';
import { student } from '../data';

export function StudentRoommates({
  preference,
  setPreference,
  roommates,
  setRoommates,
  onToast,
}: {
  preference: Preference;
  setPreference: (p: Preference) => void;
  roommates: RoommateCandidate[];
  setRoommates: React.Dispatch<React.SetStateAction<RoommateCandidate[]>>;
  onToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All departments');
  const [filterSleep, setFilterSleep] = useState('All sleep schedules');
  const [filterCompat, setFilterCompat] = useState('All scores');
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'lifestyle'>('discover');
  const [selectedCandidate, setSelectedCandidate] = useState<RoommateCandidate | null>(null);
  const [enterCode, setEnterCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Lifestyle form
  const [lifestyle, setLifestyle] = useState({
    sleepSchedule: preference.sleepSchedule || 'Night owl (Study after 8pm)',
    cleanliness: preference.cleanlinessLevel || 5,
    noiseTolerance: preference.noiseTolerance || 'Low / Moderate',
    guestPolicy: preference.guestPolicy || 'Weekends only',
  });

  const pairCode = 'VO-CSC-2026';

  const pairedRoommate = roommates.find((r) => r.requestStatus === 'Accepted');
  const pendingRequests = roommates.filter((r) => r.requestStatus === 'Received');
  const sentRequests = roommates.filter((r) => r.requestStatus === 'Sent');

  const filteredCandidates = useMemo(() => {
    return roommates.filter((c) => {
      const matchesSearch =
        `${c.name} ${c.regNo} ${c.department} ${c.bio}`.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        filterDepartment === 'All departments' || c.department === filterDepartment;
      const matchesSleep =
        filterSleep === 'All sleep schedules' ||
        (filterSleep === 'Night owl' && c.sleepSchedule.toLowerCase().includes('night')) ||
        (filterSleep === 'Early bird' && c.sleepSchedule.toLowerCase().includes('early'));
      const matchesCompat =
        filterCompat === 'All scores' ||
        (filterCompat === '90%+ Match' && c.compatibilityScore >= 90) ||
        (filterCompat === '80%+ Match' && c.compatibilityScore >= 80);

      return matchesSearch && matchesDept && matchesSleep && matchesCompat;
    });
  }, [roommates, search, filterDepartment, filterSleep, filterCompat]);

  const handleSendRequest = (id: string) => {
    setRoommates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, requestStatus: 'Sent' } : c))
    );
    const candidate = roommates.find((c) => c.id === id);
    onToast(`Roommate invitation sent to ${candidate?.name || 'student'}.`);
    if (selectedCandidate?.id === id) {
      setSelectedCandidate((prev) => (prev ? { ...prev, requestStatus: 'Sent' } : null));
    }
  };

  const handleCancelRequest = (id: string) => {
    setRoommates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, requestStatus: 'None' } : c))
    );
    onToast('Roommate invitation retracted.');
    if (selectedCandidate?.id === id) {
      setSelectedCandidate((prev) => (prev ? { ...prev, requestStatus: 'None' } : null));
    }
  };

  const handleAcceptRequest = (id: string) => {
    const candidate = roommates.find((c) => c.id === id);
    setRoommates((prev) =>
      prev.map((c) => {
        if (c.id === id) return { ...c, requestStatus: 'Accepted' };
        if (c.requestStatus === 'Accepted') return { ...c, requestStatus: 'None' };
        return c;
      })
    );
    if (candidate) {
      setPreference({
        ...preference,
        roommateRegNo: candidate.regNo,
      });
      onToast(`🎉 Mutual pairing confirmed with ${candidate.name}! Roommate preference updated.`);
    }
  };

  const handleDeclineRequest = (id: string) => {
    setRoommates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, requestStatus: 'Declined' } : c))
    );
    onToast('Invitation declined.');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(pairCode);
    setCopiedCode(true);
    onToast(`Pairing code ${pairCode} copied to clipboard! Share with your preferred roommate.`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleApplyPairCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterCode.trim()) return;
    const clean = enterCode.trim().toUpperCase();
    const found = roommates.find(
      (r) => r.regNo.toUpperCase() === clean || clean.includes(r.initials)
    );
    if (found) {
      handleAcceptRequest(found.id);
      setEnterCode('');
    } else {
      setPreference({
        ...preference,
        roommateRegNo: clean,
      });
      onToast(`Pairing code ${clean} linked to your housing profile!`);
      setEnterCode('');
    }
  };

  const handleSaveLifestyle = (e: React.FormEvent) => {
    e.preventDefault();
    setPreference({
      ...preference,
      sleepSchedule: lifestyle.sleepSchedule,
      cleanlinessLevel: lifestyle.cleanliness,
      noiseTolerance: lifestyle.noiseTolerance,
      guestPolicy: lifestyle.guestPolicy,
    });
    onToast('Lifestyle compatibility preferences saved and recalculated!');
  };

  return (
    <div data-testid="page-student-roommates">
      {/* Header Banner */}
      <div className="card card-pad" style={{ marginBottom: 18, background: '#f4c59e', border: 0 }}>
        <div className="eyebrow">Roommate Compatibility Engine</div>
        <h2 style={{ fontSize: 26, letterSpacing: '-.06em', margin: '8px 0 5px' }}>
          Roommate Pairing & Lifestyle Matching
        </h2>
        <p style={{ margin: 0, color: '#4a3d31', fontSize: 13, maxWidth: 620, lineHeight: 1.5 }}>
          Match with compatible students based on sleep patterns, study discipline, noise levels, and academic cohort.
        </p>
      </div>

      {/* Paired Roommate Status Card & Pairing Code */}
      <div className="two-col" style={{ marginBottom: 20 }}>
        {/* Current Paired Roommate */}
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #d9f2e4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="eyebrow" style={{ color: '#277f60' }}>Active Roommate Status</div>
            <span className="tag sage">
              <CheckCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Mutual Pair Confirmed
            </span>
          </div>

          {pairedRoommate ? (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="avatar sage" style={{ width: 48, height: 48, fontSize: 16, flexShrink: 0 }}>
                {pairedRoommate.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 17 }}>{pairedRoommate.name}</h3>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#277f60' }}>
                    {pairedRoommate.compatibilityScore}% Compatibility
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                  {pairedRoommate.regNo} · {pairedRoommate.department} ({pairedRoommate.level})
                </div>

                <div style={{ margin: '10px 0', padding: '8px 10px', background: '#f5faf7', borderRadius: 8, fontSize: 11 }}>
                  <strong>Assigned Room:</strong> {student.room} ({student.assignedHostel || 'Mango House'})
                  <div style={{ marginTop: 3, color: '#555' }}>
                    <strong>Habits:</strong> {pairedRoommate.sleepSchedule} · {pairedRoommate.studyHabit}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedCandidate(pairedRoommate)}
                    data-testid="button-view-roommate-profile"
                  >
                    View Roommate Profile
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setRoommates((prev) =>
                        prev.map((c) => (c.id === pairedRoommate.id ? { ...c, requestStatus: 'None' } : c))
                      );
                      setPreference({ ...preference, roommateRegNo: '' });
                      onToast('Roommate pairing unlinked. You can now request another roommate.');
                    }}
                    style={{ color: '#a14b43' }}
                    data-testid="button-unlink-roommate"
                  >
                    Unlink Pair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <Users size={24} color="#888" />
              <strong>No Roommate Paired Yet</strong>
              <p>Explore candidate profiles below or share your pairing code with a friend.</p>
            </div>
          )}
        </div>

        {/* Shareable Pair Code Card */}
        <div className="card card-pad" style={{ background: '#fbfcfc', display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">Direct Pairing System</div>
          <h3 style={{ margin: '4px 0 6px', fontSize: 16 }}>Your Personal Pairing Code</h3>
          <p style={{ fontSize: 11, color: '#68707c', margin: '0 0 12px' }}>
            Give this code to a classmate to cross-reference each other directly for room allocation.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#fff',
              border: '1.5px dashed #d1d5db',
              borderRadius: 10,
              padding: '8px 12px',
              marginBottom: 14,
            }}
          >
            <span style={{ font: '700 16px var(--app-font-mono)', color: '#181818', letterSpacing: '0.05em' }}>
              {pairCode}
            </span>
            <button
              className="btn btn-peach btn-sm"
              onClick={handleCopyCode}
              data-testid="button-copy-pair-code"
            >
              {copiedCode ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <form onSubmit={handleApplyPairCode} style={{ marginTop: 'auto' }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#444', display: 'block', marginBottom: 4 }}>
              Have a friend's Matric No. or code?
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                className="search-input"
                placeholder="e.g. CSC/22/1192 or CODE"
                value={enterCode}
                onChange={(e) => setEnterCode(e.target.value)}
                style={{ flex: 1, textTransform: 'uppercase' }}
                data-testid="input-pair-code"
              />
              <button type="submit" className="btn btn-dark btn-sm" data-testid="button-submit-pair-code">
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div className="view-tabs" role="tablist">
          <button
            type="button"
            className={`view-tab ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
            data-testid="tab-roommate-discover"
          >
            <Sparkles size={13} /> Discover Matches ({filteredCandidates.length})
          </button>
          <button
            type="button"
            className={`view-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
            data-testid="tab-roommate-requests"
          >
            <Send size={13} /> Requests ({pendingRequests.length + sentRequests.length})
            {pendingRequests.length > 0 && (
              <span className="tag peach" style={{ fontSize: 9, padding: '1px 5px' }}>
                {pendingRequests.length} new
              </span>
            )}
          </button>
          <button
            type="button"
            className={`view-tab ${activeTab === 'lifestyle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifestyle')}
            data-testid="tab-roommate-lifestyle"
          >
            <Sliders size={13} /> My Habits & Lifestyle
          </button>
        </div>
      </div>

      {/* TAB 1: Discover Roommates */}
      {activeTab === 'discover' && (
        <div>
          {/* Filters Bar */}
          <div className="card card-pad" style={{ marginBottom: 16, padding: '14px 16px' }}>
            <div className="filter-row" style={{ gap: 10 }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 12 }} />
                <input
                  className="search-input"
                  style={{ paddingLeft: 32, width: '100%' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, reg number, department, bio..."
                  data-testid="input-search-roommates"
                />
              </div>

              <select
                className="select"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                data-testid="select-roommate-dept"
              >
                <option>All departments</option>
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Electrical Engineering</option>
                <option>Mathematics</option>
              </select>

              <select
                className="select"
                value={filterSleep}
                onChange={(e) => setFilterSleep(e.target.value)}
                data-testid="select-roommate-sleep"
              >
                <option>All sleep schedules</option>
                <option>Night owl</option>
                <option>Early bird</option>
              </select>

              <select
                className="select"
                value={filterCompat}
                onChange={(e) => setFilterCompat(e.target.value)}
                data-testid="select-roommate-compat"
              >
                <option>All scores</option>
                <option>90%+ Match</option>
                <option>80%+ Match</option>
              </select>
            </div>
          </div>

          {/* Candidates Grid */}
          {filteredCandidates.length === 0 ? (
            <div className="card empty-state" data-testid="empty-roommates">
              <Users size={28} color="#999" />
              <strong>No matching students found</strong>
              <p>Try resetting your search query or selecting a different department filter.</p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearch('');
                  setFilterDepartment('All departments');
                  setFilterSleep('All sleep schedules');
                  setFilterCompat('All scores');
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
              {filteredCandidates.map((candidate) => {
                const isPaired = candidate.requestStatus === 'Accepted';
                const isSent = candidate.requestStatus === 'Sent';
                const isReceived = candidate.requestStatus === 'Received';

                return (
                  <div
                    key={candidate.id}
                    className="card"
                    style={{
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      border: isPaired ? '1.5px solid #277f60' : undefined,
                    }}
                    data-testid={`card-roommate-${candidate.id}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                          {candidate.initials}
                        </div>
                        <div>
                          <strong style={{ fontSize: 14, display: 'block' }}>{candidate.name}</strong>
                          <span style={{ fontSize: 11, color: '#68707c' }}>
                            {candidate.regNo} · {candidate.level}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ font: '700 15px var(--app-font-sans)', color: candidate.compatibilityScore >= 90 ? '#277f60' : '#b26829' }}>
                          {candidate.compatibilityScore}%
                        </div>
                        <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          fit score
                        </span>
                      </div>
                    </div>

                    {/* Compatibility Progress Bar */}
                    <div style={{ marginTop: 10 }}>
                      <div className="compat-bar-track">
                        <div className="compat-bar-fill" style={{ width: `${candidate.compatibilityScore}%` }} />
                      </div>
                    </div>

                    <p style={{ fontSize: 11, color: '#555', margin: '12px 0 10px', lineHeight: 1.45 }}>
                      "{candidate.bio}"
                    </p>

                    <div style={{ marginTop: 'auto', background: '#f8f9fa', padding: '8px 10px', borderRadius: 8, fontSize: 10, color: '#555' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: '#777' }}>Sleep Routine:</span>
                        <strong>{candidate.sleepSchedule}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: '#777' }}>Cleanliness:</span>
                        <strong>{'⭐'.repeat(candidate.cleanliness)} ({candidate.cleanliness}/5)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#777' }}>Target Block:</span>
                        <strong>{candidate.preferredBlock}</strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => setSelectedCandidate(candidate)}
                        data-testid={`button-details-${candidate.id}`}
                      >
                        Inspect
                      </button>

                      {isPaired ? (
                        <span className="tag sage" style={{ height: 32, display: 'inline-flex', alignItems: 'center' }}>
                          <Check size={12} style={{ marginRight: 4 }} /> Paired
                        </span>
                      ) : isSent ? (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#a14b43' }}
                          onClick={() => handleCancelRequest(candidate.id)}
                          data-testid={`button-cancel-request-${candidate.id}`}
                        >
                          Cancel Request
                        </button>
                      ) : isReceived ? (
                        <button
                          className="btn btn-peach btn-sm"
                          onClick={() => handleAcceptRequest(candidate.id)}
                          data-testid={`button-accept-request-${candidate.id}`}
                        >
                          <Check size={12} /> Accept Invite
                        </button>
                      ) : (
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => handleSendRequest(candidate.id)}
                          data-testid={`button-send-request-${candidate.id}`}
                        >
                          <UserPlus size={12} /> Invite to Pair
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pending & Sent Requests */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Incoming Requests */}
          <div className="card card-pad">
            <div className="eyebrow" style={{ color: '#277f60' }}>Incoming Invitations</div>
            <h3 style={{ fontSize: 17, margin: '4px 0 12px' }}>
              Received Roommate Requests ({pendingRequests.length})
            </h3>

            {pendingRequests.length === 0 ? (
              <p style={{ fontSize: 12, color: '#777', margin: 0 }}>No pending roommate invitations from other students.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8faf9',
                      border: '1px solid #e0ece6',
                      borderRadius: 12,
                      padding: '12px 16px',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar sage" style={{ width: 36, height: 36, fontSize: 12 }}>
                        {req.initials}
                      </div>
                      <div>
                        <strong>{req.name}</strong> ({req.regNo})
                        <div style={{ fontSize: 11, color: '#666' }}>
                          {req.department} · {req.compatibilityScore}% Compatibility Fit
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeclineRequest(req.id)}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-peach btn-sm"
                        onClick={() => handleAcceptRequest(req.id)}
                      >
                        <Check size={12} /> Accept & Pair
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div className="card card-pad">
            <div className="eyebrow">Sent Invitations</div>
            <h3 style={{ fontSize: 17, margin: '4px 0 12px' }}>
              Pending Outgoing Requests ({sentRequests.length})
            </h3>

            {sentRequests.length === 0 ? (
              <p style={{ fontSize: 12, color: '#777', margin: 0 }}>You have no pending outgoing roommate invitations.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#fcfdfe',
                      border: '1px solid #ebedf0',
                      borderRadius: 12,
                      padding: '12px 16px',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                        {req.initials}
                      </div>
                      <div>
                        <strong>{req.name}</strong> ({req.regNo})
                        <div style={{ fontSize: 11, color: '#666' }}>
                          {req.department} · Awaiting their confirmation
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleCancelRequest(req.id)}
                      style={{ color: '#a14b43' }}
                    >
                      Withdraw Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: My Habits & Lifestyle */}
      {activeTab === 'lifestyle' && (
        <div className="two-col">
          <form onSubmit={handleSaveLifestyle} className="card card-pad">
            <div className="eyebrow">Profile Matching Criteria</div>
            <h3 style={{ fontSize: 18, margin: '6px 0 14px' }}>My Roommate Questionnaire</h3>

            <div className="form-grid" style={{ gap: 14 }}>
              <div className="field full">
                <label>Typical Sleep & Wake Schedule</label>
                <select
                  value={lifestyle.sleepSchedule}
                  onChange={(e) => setLifestyle({ ...lifestyle, sleepSchedule: e.target.value })}
                >
                  <option>Night owl (Study after 8pm, sleep 12am-7am)</option>
                  <option>Early bird (Sleep 10pm, wake 5am-6am)</option>
                  <option>Flexible / Balanced schedule</option>
                </select>
              </div>

              <div className="field full">
                <label>Cleanliness & Orderliness (1 to 5 Stars): {lifestyle.cleanliness} / 5</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={lifestyle.cleanliness}
                  onChange={(e) => setLifestyle({ ...lifestyle, cleanliness: Number(e.target.value) })}
                  className="range-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#777', marginTop: 4 }}>
                  <span>Relaxed</span>
                  <span>Moderate</span>
                  <span>Very Clean & Organized</span>
                </div>
              </div>

              <div className="field full">
                <label>Noise & Study Atmosphere</label>
                <select
                  value={lifestyle.noiseTolerance}
                  onChange={(e) => setLifestyle({ ...lifestyle, noiseTolerance: e.target.value })}
                >
                  <option>Pin-drop silence required</option>
                  <option>Low / Moderate (Headphones standard)</option>
                  <option>Discussion & background music friendly</option>
                </select>
              </div>

              <div className="field full">
                <label>Room Visitors / Guest Policy</label>
                <select
                  value={lifestyle.guestPolicy}
                  onChange={(e) => setLifestyle({ ...lifestyle, guestPolicy: e.target.value })}
                >
                  <option>Rarely / Study group only</option>
                  <option>Weekends only</option>
                  <option>Flexible with notice</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-dark" data-testid="button-save-lifestyle">
                <Check size={14} /> Update Compatibility Profile
              </button>
            </div>
          </form>

          <div className="card card-pad" style={{ background: '#eef9f4', border: 0 }}>
            <Sparkles size={22} color="#277f60" />
            <h3 style={{ fontSize: 18, color: '#17604a', margin: '14px 0 8px' }}>
              Why Lifestyle Pairing Matters
            </h3>
            <p style={{ fontSize: 12, color: '#276853', lineHeight: 1.6 }}>
              Roommate compatibility is the #1 predictor of student satisfaction and academic focus in campus dorms. Our algorithm evaluates 12 behavioural vectors to minimize conflicts before move-in day.
            </p>

            <div style={{ marginTop: 16, borderTop: '1px solid #c9ebd9', paddingTop: 12, fontSize: 11, color: '#1f6e55' }}>
              <strong>Automatic Cross-Referencing:</strong> When you and another student cross-reference each other's matriculation numbers, you are automatically paired in the next batch allocation run.
            </div>
          </div>
        </div>
      )}

      {/* Candidate Inspect Modal */}
      {selectedCandidate && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar sage" style={{ width: 44, height: 44, fontSize: 16 }}>
                  {selectedCandidate.initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 19 }}>{selectedCandidate.name}</h2>
                  <div style={{ fontSize: 11, color: '#666' }}>
                    {selectedCandidate.regNo} · {selectedCandidate.department} ({selectedCandidate.level})
                  </div>
                </div>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f5faf7', padding: 12, borderRadius: 12, margin: '14px 0', border: '1px solid #d7efe1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#277f60', fontWeight: 700 }}>Compatibility Rating</span>
                <strong style={{ fontSize: 18, color: '#277f60' }}>{selectedCandidate.compatibilityScore}%</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: '#444', lineHeight: 1.45 }}>
                "{selectedCandidate.bio}"
              </p>
            </div>

            <div className="preference-list">
              <div className="preference-item">
                <small>Sleep Routine</small>
                <strong>{selectedCandidate.sleepSchedule}</strong>
              </div>
              <div className="preference-item">
                <small>Study Habit</small>
                <strong>{selectedCandidate.studyHabit}</strong>
              </div>
              <div className="preference-item">
                <small>Cleanliness Score</small>
                <strong>{'⭐'.repeat(selectedCandidate.cleanliness)} ({selectedCandidate.cleanliness}/5)</strong>
              </div>
              <div className="preference-item">
                <small>Preferred Hostel</small>
                <strong>{selectedCandidate.preferredBlock}</strong>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setSelectedCandidate(null)}>
                Close
              </button>
              {selectedCandidate.requestStatus === 'Accepted' ? (
                <button
                  className="btn btn-ghost"
                  style={{ color: '#a14b43' }}
                  onClick={() => {
                    handleDeclineRequest(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                >
                  Unlink Roommate
                </button>
              ) : selectedCandidate.requestStatus === 'Sent' ? (
                <button
                  className="btn btn-ghost"
                  style={{ color: '#a14b43' }}
                  onClick={() => {
                    handleCancelRequest(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                >
                  Withdraw Invitation
                </button>
              ) : selectedCandidate.requestStatus === 'Received' ? (
                <button
                  className="btn btn-peach"
                  onClick={() => {
                    handleAcceptRequest(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                >
                  <Check size={13} /> Accept Invitation
                </button>
              ) : (
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    handleSendRequest(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                >
                  <UserPlus size={13} /> Send Roommate Invitation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
