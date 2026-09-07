import { useState, useMemo } from 'react';
import {
  Cpu,
  Zap,
  Play,
  CheckCheck,
  RotateCcw,
  Sliders,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  BatchAllocationConfig,
  SimulationResult,
  SimulationAssignment,
  AllocationRequest,
  Room,
} from '../types';
import { defaultBatchConfig } from '../data';

export function AdminBatchAllocation({
  requests,
  setRequests,
  rooms,
  setRooms,
  onToast,
}: {
  requests: AllocationRequest[];
  setRequests: React.Dispatch<React.SetStateAction<AllocationRequest[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onToast: (msg: string) => void;
}) {
  const [config, setConfig] = useState<BatchAllocationConfig>(defaultBatchConfig);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState<SimulationAssignment | null>(null);
  const [committed, setCommitted] = useState(false);

  // Baseline metrics
  const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Review');
  const approvedRequests = requests.filter((r) => r.status === 'Approved');

  const runSimulation = () => {
    setIsSimulating(true);
    setCommitted(false);

    setTimeout(() => {
      // Mock deterministic optimization algorithm
      const candidateList: SimulationAssignment[] = [
        {
          studentId: 's-1',
          studentName: 'Farouk Mustapha',
          regNo: 'CSC/22/1192',
          department: 'Computer Science',
          level: '300 Level',
          targetRoom: 'B-214',
          targetBlock: 'Block B (Mango House)',
          hostelName: 'Mango House',
          fitScore: 96,
          roommateName: 'Victory Okafor',
          rationale: 'Mutual pairing verified (VO-CSC-2026). Matched 300L CS cohort & night-owl study schedule.',
          status: 'Ready',
        },
        {
          studentId: 's-2',
          studentName: 'Zainab Bello',
          regNo: 'MED/22/0391',
          department: 'Human Medicine',
          level: '300 Level',
          targetRoom: 'D-204',
          targetBlock: 'Block D (Aster Court)',
          hostelName: 'Aster Court',
          fitScore: 93,
          roommateName: 'Nadia Yusuf',
          rationale: 'Placed in Aster Court 2nd floor quiet medical wing; matched study hours and bursary cleared.',
          status: 'Ready',
        },
        {
          studentId: 's-3',
          studentName: 'Tariq Al-Mansoor',
          regNo: 'ARC/22/0115',
          department: 'Architecture',
          level: '300 Level',
          targetRoom: 'B-201',
          targetBlock: 'Block B (Mango House)',
          hostelName: 'Mango House',
          fitScore: 89,
          roommateName: 'Chuka Eze',
          rationale: 'Assigned double room B-201 corner layout accommodating architectural drafting boards.',
          status: 'Ready',
        },
        {
          studentId: 's-4',
          studentName: 'Somtochukwu Obi',
          regNo: 'CSC/22/1420',
          department: 'Computer Science',
          level: '300 Level',
          targetRoom: 'B-108',
          targetBlock: 'Block B (Mango House)',
          hostelName: 'Mango House',
          fitScore: 91,
          roommateName: 'Tobi Adeleke',
          rationale: 'Matched tech cohort, 11pm quiet hours, ground-to-1st floor preference satisfied.',
          status: 'Ready',
        },
        {
          studentId: 's-5',
          studentName: 'Ifeanyi Okoli',
          regNo: 'MEE/24/0081',
          department: 'Mechanical Eng.',
          level: '100 Level',
          targetRoom: 'A-108',
          targetBlock: 'Block A (The Lantern)',
          hostelName: 'The Lantern',
          fitScore: 87,
          roommateName: 'Kelechi Amadi',
          rationale: 'Freshman cohort priority applied. Warning: Bursary fee payment confirmation still pending in student bursary portal.',
          status: 'Hold',
          warningMessage: 'Pending Bursary Cleared Receipt. Allocation conditionally held until payment verified.',
        },
        {
          studentId: 's-6',
          studentName: 'Blessing Ogundele',
          regNo: 'BIO/23/0771',
          department: 'Biochemistry',
          level: '200 Level',
          targetRoom: 'D-102',
          targetBlock: 'Block D (Aster Court)',
          hostelName: 'Aster Court',
          fitScore: 88,
          roommateName: 'Amina S.',
          rationale: 'Ground floor allocation matching accessibility preference in Aster Court female wing.',
          status: 'Ready',
        },
      ];

      const avgFit = Math.round(
        candidateList.reduce((acc, c) => acc + c.fitScore, 0) / candidateList.length
      );

      const result: SimulationResult = {
        totalProcessed: candidateList.length,
        allocatedCount: candidateList.filter((c) => c.status === 'Ready').length,
        averageFitScore: avgFit,
        conflictsResolved: 4,
        occupancyRate: 94.6,
        assignments: candidateList,
      };

      setSimulationResult(result);
      setIsSimulating(false);
      onToast(`Batch optimization complete: ${result.allocatedCount} rooms assigned with ${result.averageFitScore}% avg fit!`);
    }, 600);
  };

  const handleCommitAllocations = () => {
    if (!simulationResult) return;

    // Update live requests
    setRequests((prev) =>
      prev.map((req) => {
        const match = simulationResult.assignments.find(
          (a) => a.regNo === req.student.regNo || a.studentName === req.student.name
        );
        if (match && match.status === 'Ready') {
          return {
            ...req,
            status: 'Approved',
            room: match.targetRoom,
            matchScore: match.fitScore,
            notes: `Batch Allocated: ${match.rationale}`,
          };
        }
        return req;
      })
    );

    // Update rooms to Occupied
    setRooms((prev) =>
      prev.map((room) => {
        const isTargeted = simulationResult.assignments.some(
          (a) => a.targetRoom === room.number && a.status === 'Ready'
        );
        if (isTargeted && room.status !== 'Maintenance') {
          return {
            ...room,
            status: 'Occupied',
          };
        }
        return room;
      })
    );

    setCommitted(true);
    onToast(`✅ Successfully committed batch allocations to live student records and hostel rooms!`);
  };

  const filteredAssignments = useMemo(() => {
    if (!simulationResult) return [];
    return simulationResult.assignments.filter((a) => {
      const matchesSearch =
        `${a.studentName} ${a.regNo} ${a.department} ${a.targetRoom} ${a.rationale}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Ready to Commit' && a.status === 'Ready') ||
        (statusFilter === 'Payment Holds' && a.status === 'Hold');
      return matchesSearch && matchesStatus;
    });
  }, [simulationResult, search, statusFilter]);

  return (
    <div data-testid="page-admin-batch-allocation">
      {/* Top Banner */}
      <div className="card card-pad reveal" style={{ marginBottom: 18, background: '#f4c59e', border: 0 }}>
        <div className="eyebrow">Smart Allocation Engine</div>
        <h2 style={{ fontSize: 26, letterSpacing: '-.06em', margin: '8px 0 5px' }}>
          Automated Batch Allocation Engine
        </h2>
        <p style={{ margin: 0, color: '#4a3d31', fontSize: 13, maxWidth: 650, lineHeight: 1.5 }}>
          Run high-precision algorithmic room placement based on student preference rankings, academic level priority, mutual roommate pairings, and bursary payment clearance.
        </p>
      </div>

      {/* Engine Controls Grid */}
      <div className="two-col reveal delay-1" style={{ marginBottom: 20 }}>
        {/* Policy & Rules Config Card */}
        <div className="card card-pad" style={{ background: '#fff' }}>
          <div className="section-heading" style={{ marginBottom: 14 }}>
            <div>
              <div className="eyebrow">Algorithm Parameters</div>
              <h3 style={{ fontSize: 17, margin: '2px 0 0' }}>Allocation Rules & Weights</h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfig(defaultBatchConfig)}
            >
              Reset Defaults
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Seniority Priority Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <strong>Academic Seniority Priority (Weight: {config.seniorityWeight}x)</strong>
                <span style={{ color: '#666' }}>Prioritizes Finalists & Freshers</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={config.seniorityWeight}
                onChange={(e) => setConfig({ ...config, seniorityWeight: Number(e.target.value) })}
                className="range-slider"
                data-testid="slider-seniority-weight"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginTop: 3 }}>
                <span>Equal Priority (1x)</span>
                <span>Heavy Seniority (5x)</span>
              </div>
            </div>

            {/* Department Cohort Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8f9fa',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 12, display: 'block' }}>Department Cohort Proximity</strong>
                <span style={{ fontSize: 10, color: '#666' }}>Group students in same faculty/department on shared wings</span>
              </div>
              <input
                type="checkbox"
                checked={config.prioritizeCohort}
                onChange={(e) => setConfig({ ...config, prioritizeCohort: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
            </label>

            {/* Study Hours & Sleep Alignment */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8f9fa',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 12, display: 'block' }}>Quiet Hours & Sleep Habit Alignment</strong>
                <span style={{ fontSize: 10, color: '#666' }}>Pair night owls with night owls; early birds with early birds</span>
              </div>
              <input
                type="checkbox"
                checked={config.prioritizeStudyHours}
                onChange={(e) => setConfig({ ...config, prioritizeStudyHours: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
            </label>

            {/* Strict Bursary Clearance */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8f9fa',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 12, display: 'block' }}>Strict Bursary Clearance Gate</strong>
                <span style={{ fontSize: 10, color: '#666' }}>Hold assignments for students with pending payment status</span>
              </div>
              <input
                type="checkbox"
                checked={config.strictPaymentClearance}
                onChange={(e) => setConfig({ ...config, strictPaymentClearance: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
            </label>

            {/* Floor Load Balancing */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8f9fa',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 12, display: 'block' }}>Even Floor & Hostel Load Balancing</strong>
                <span style={{ fontSize: 10, color: '#666' }}>Distribute occupancies evenly across Blocks A, B, and D</span>
              </div>
              <input
                type="checkbox"
                checked={config.balanceFloorLoads}
                onChange={(e) => setConfig({ ...config, balanceFloorLoads: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <button
              className="btn btn-dark"
              style={{ flex: 1 }}
              onClick={runSimulation}
              disabled={isSimulating}
              data-testid="button-run-simulation"
            >
              {isSimulating ? (
                <>Optimizing Placement...</>
              ) : (
                <>
                  <Play size={14} fill="#fff" /> Run Batch Allocation Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Engine Impact / Output Summary Card */}
        <div className="card card-pad" style={{ background: '#fcfdfd', display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow" style={{ color: '#277f60' }}>Engine Analysis & Diagnostics</div>
          <h3 style={{ fontSize: 17, margin: '2px 0 10px' }}>Simulation Telemetry</h3>

          {simulationResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Metric Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div style={{ background: '#eef9f4', padding: '12px 14px', borderRadius: 10 }}>
                  <span style={{ fontSize: 10, color: '#277f60', textTransform: 'uppercase', fontWeight: 700 }}>
                    Avg Match Fit Score
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#17604a', marginTop: 2 }}>
                    {simulationResult.averageFitScore}%
                  </div>
                  <span style={{ fontSize: 10, color: '#447a66' }}>↑ 13% vs random allocation</span>
                </div>

                <div style={{ background: '#fff8f2', padding: '12px 14px', borderRadius: 10 }}>
                  <span style={{ fontSize: 10, color: '#a14b43', textTransform: 'uppercase', fontWeight: 700 }}>
                    Pending Resolved
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#883d34', marginTop: 2 }}>
                    {simulationResult.allocatedCount} / {simulationResult.totalProcessed}
                  </div>
                  <span style={{ fontSize: 10, color: '#77524e' }}>1 hold (bursary pending)</span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5, background: '#f8f9fa', padding: 12, borderRadius: 10 }}>
                <strong>Algorithm Summary:</strong> Evaluated 18 floor plan constraints. Successfully clustered CS 300L cohort in Mango House 2nd Floor, preserved quiet study floors in Aster Court, and resolved {simulationResult.conflictsResolved} mutual roommate pairing cross-references.
              </div>

              {committed ? (
                <div style={{ background: '#e7f5ef', border: '1px solid #bce6d4', padding: '12px 14px', borderRadius: 10, color: '#1f6e55', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCheck size={18} />
                  <strong>Allocations are LIVE and committed to student portals!</strong>
                </div>
              ) : (
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-peach"
                    style={{ flex: 1 }}
                    onClick={handleCommitAllocations}
                    data-testid="button-commit-allocations"
                  >
                    <CheckCheck size={14} /> Commit & Apply Live Allocations
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0', margin: 'auto 0' }}>
              <Cpu size={32} color="#888" />
              <strong>No Active Simulation</strong>
              <p>Configure parameters on the left and click "Run Batch Allocation Simulation" to view optimal assignments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Assignments Table */}
      {simulationResult && (
        <section className="card card-pad reveal delay-2">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Simulated Placements</div>
              <h3 style={{ fontSize: 19, margin: '2px 0 0' }}>
                Batch Assignments Preview ({filteredAssignments.length})
              </h3>
              <p>Inspect recommended room placements before committing to official records.</p>
            </div>

            <div className="filter-row">
              <div style={{ position: 'relative', minWidth: 220 }}>
                <Search size={14} color="#9298a0" style={{ position: 'absolute', left: 11, top: 12 }} />
                <input
                  className="search-input"
                  style={{ paddingLeft: 32, width: '100%' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter student or room..."
                  data-testid="input-search-simulation"
                />
              </div>

              <select
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-testid="select-simulation-status"
              >
                <option>All</option>
                <option>Ready to Commit</option>
                <option>Payment Holds</option>
              </select>
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table className="table" data-testid="table-batch-assignments">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Level & Dept</th>
                  <th>Target Room</th>
                  <th>Paired Roommate</th>
                  <th>Fit Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((item) => (
                  <tr key={item.studentId} data-testid={`row-simulation-${item.studentId}`}>
                    <td>
                      <strong>{item.studentName}</strong>
                      <div style={{ fontSize: 10, color: '#888' }}>{item.regNo}</div>
                    </td>
                    <td>
                      <div>{item.department}</div>
                      <span className="tag" style={{ fontSize: 9 }}>{item.level}</span>
                    </td>
                    <td>
                      <strong>Room {item.targetRoom}</strong>
                      <div style={{ fontSize: 10, color: '#777' }}>{item.hostelName}</div>
                    </td>
                    <td>
                      {item.roommateName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={12} color="#277f60" />
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{item.roommateName}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#999' }}>Single / Auto</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: item.fitScore >= 90 ? '#277f60' : '#b26829' }}>
                        {item.fitScore}%
                      </strong>
                    </td>
                    <td>
                      <span
                        className={item.status === 'Ready' ? 'tag sage' : 'tag peach'}
                        style={{ fontSize: 10 }}
                      >
                        {item.status === 'Ready' ? 'Ready to Allocate' : 'Payment Hold'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedAssignment(item)}
                        data-testid={`button-inspect-assignment-${item.studentId}`}
                      >
                        Rationale
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Assignment Rationale Inspect Modal */}
      {selectedAssignment && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Algorithmic Placement Rationale</div>
                <h2>{selectedAssignment.studentName}</h2>
                <p>{selectedAssignment.regNo} · {selectedAssignment.department} ({selectedAssignment.level})</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedAssignment(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="preference-list" style={{ margin: '14px 0' }}>
              <div className="preference-item">
                <small>Target Placement</small>
                <strong>Room {selectedAssignment.targetRoom} ({selectedAssignment.hostelName})</strong>
              </div>
              <div className="preference-item">
                <small>Calculated Fit</small>
                <strong>{selectedAssignment.fitScore}% Compatibility</strong>
              </div>
              <div className="preference-item">
                <small>Matched Roommate</small>
                <strong>{selectedAssignment.roommateName || 'None assigned'}</strong>
              </div>
              <div className="preference-item">
                <small>Allocation Status</small>
                <strong>{selectedAssignment.status}</strong>
              </div>
            </div>

            <div style={{ background: '#f5faf7', padding: 12, borderRadius: 10, border: '1px solid #d7efe1' }}>
              <strong style={{ fontSize: 11, color: '#17604a', display: 'block', marginBottom: 4 }}>
                Decision Explanation:
              </strong>
              <p style={{ margin: 0, fontSize: 11, color: '#333', lineHeight: 1.5 }}>
                {selectedAssignment.rationale}
              </p>
            </div>

            {selectedAssignment.warningMessage && (
              <div style={{ marginTop: 10, background: '#fff4f2', border: '1px solid #fad2cb', padding: 10, borderRadius: 10, fontSize: 11, color: '#a14b43' }}>
                <ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                <strong>Warning:</strong> {selectedAssignment.warningMessage}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setSelectedAssignment(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
