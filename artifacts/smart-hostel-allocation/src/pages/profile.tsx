import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  SlidersHorizontal,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  Clock,
  Moon,
  Volume2,
  ShieldCheck,
  Edit3,
  QrCode,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Heart,
  ChevronRight,
  Layers,
  MapPin,
  Camera,
  Loader2,
} from 'lucide-react';
import { Student, Preference } from '../types';
import { PhotoCaptureModal } from '../components/photo-capture-modal';
import { dbSaveStudent, dbSavePreferences } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

export function StudentProfile({
  student,
  setStudent,
  preference,
  setPreference,
  onToast,
}: {
  student: Student;
  setStudent: React.Dispatch<React.SetStateAction<Student>>;
  preference: Preference;
  setPreference: (value: Preference) => void;
  onToast: (message: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'idcard'>('profile');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: student.email || 'v.okafor@campus.edu.ng',
    phone: student.phone || '+234 812 345 6789',
    emergencyContact: student.emergencyContact || 'Mrs. Ngozi Okafor (Mother)',
    emergencyPhone: student.emergencyPhone || '+234 803 111 2233',
    bio: student.bio || 'Junior year software engineering student researching distributed systems.',
  });

  // Preference state for editing
  const [prefForm, setPrefForm] = useState<Preference>({
    ...preference,
    sleepSchedule: preference.sleepSchedule || 'Late sleeper (after 12am)',
    cleanlinessLevel: preference.cleanlinessLevel || 4,
    noiseTolerance: preference.noiseTolerance || 'Low ambient sound',
  });
  const [hasPrefChanges, setHasPrefChanges] = useState(false);

  const handleSaveContact = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    const updated = {
      ...student,
      email: contactForm.email,
      phone: contactForm.phone,
      emergencyContact: contactForm.emergencyContact,
      emergencyPhone: contactForm.emergencyPhone,
      bio: contactForm.bio,
    };
    
    if (isSupabaseConfigured()) {
      try {
        await dbSaveStudent(updated);
        setStudent(updated);
        setIsEditingContact(false);
        onToast('Contact details and student profile updated successfully.');
      } catch (err) {
        console.error('Failed to save to Supabase:', err);
        onToast('Error: Failed to update contact profile in database.');
      }
    } else {
      setStudent(updated);
      setIsEditingContact(false);
      onToast('Contact details and student profile updated locally.');
    }
    
    setIsSavingContact(false);
  };

  const handlePrefChange = <K extends keyof Preference>(key: K, value: Preference[K]) => {
    setPrefForm((prev) => ({ ...prev, [key]: value }));
    setHasPrefChanges(true);
  };

  const handleSavePreferences = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    
    if (isSupabaseConfigured()) {
      try {
        await dbSavePreferences(student.regNo, prefForm);
        setPreference(prefForm);
        setHasPrefChanges(false);
        onToast('Living preferences updated successfully.');
      } catch (err) {
        console.error('Failed to save to Supabase:', err);
        onToast('Error: Failed to save preferences to database.');
      }
    } else {
      setPreference(prefForm);
      setHasPrefChanges(false);
      onToast('Living preferences updated locally.');
    }
    
    setIsSavingPrefs(false);
  };

  const handleResetPreferences = () => {
    setPrefForm({
      ...preference,
      sleepSchedule: preference.sleepSchedule || 'Late sleeper (after 12am)',
      cleanlinessLevel: preference.cleanlinessLevel || 4,
      noiseTolerance: preference.noiseTolerance || 'Low ambient sound',
    });
    setHasPrefChanges(false);
    onToast('Preferences reset to currently saved configuration.');
  };

  return (
    <div className="reveal" data-testid="page-student-profile">
      {/* Header Section */}
      <div className="section-heading" style={{ marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#277f60', display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={13} /> Verified Student Profile
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 5vw, 26px)', letterSpacing: '-0.05em', margin: '4px 0' }}>
            Student Identity & Preferences
          </h2>
          <p style={{ color: '#666', fontSize: 13, margin: 0 }}>
            Manage your personal profile, university registry records, and smart hostel matching criteria.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, background: '#eef1f5', padding: 4, borderRadius: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'profile' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('profile')}
            data-testid="tab-profile-overview"
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            <User size={13} /> Overview
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'preferences' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('preferences')}
            data-testid="tab-profile-preferences"
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            <SlidersHorizontal size={13} /> Housing Preferences
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'idcard' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('idcard')}
            data-testid="tab-profile-idcard"
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            <QrCode size={13} /> Digital ID & Gate Pass
          </button>
        </div>
      </div>

      {/* Main Tab 1: Profile & Academic Information */}
      {activeTab === 'profile' && (
        <div className="two-col" style={{ alignItems: 'flex-start', gap: 20 }}>
          {/* Left Column: ID Card & Academic Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Primary Profile Card */}
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="avatar peach"
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 18,
                        fontSize: 22,
                        fontWeight: 800,
                        boxShadow: '0 4px 14px rgba(229,157,108,0.25)',
                        overflow: 'hidden',
                        padding: 0,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {student.avatarUrl ? (
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        student.initials
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 26,
                        height: 26,
                        borderRadius: 99,
                        background: '#181818',
                        color: '#fff',
                        border: '2px solid #fff',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        transition: 'transform 0.15s ease',
                      }}
                      className="hover:scale-110"
                      title="Capture or select photo (Camera/Microphone)"
                      data-testid="button-trigger-photo-capture"
                      aria-label="Capture or upload student photo"
                    >
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>{student.name}</h3>
                      <span className="tag sage" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <ShieldCheck size={11} /> Verified
                      </span>
                    </div>
                    <div style={{ font: '600 12px var(--app-font-mono)', color: '#b26829', marginTop: 3 }}>
                      {student.regNo}
                    </div>
                    <div style={{ fontSize: 11, color: '#68707c', marginTop: 2 }}>
                      {student.level} · {student.department}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsPhotoModalOpen(true)}
                    data-testid="button-change-photo-profile"
                    style={{ fontSize: 11, gap: 5 }}
                    title="Update photo using camera or file"
                  >
                    <Camera size={13} />
                    <span>{student.avatarUrl ? 'Change Photo' : 'Add Photo'}</span>
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsEditingContact(true)}
                    data-testid="button-edit-student-profile"
                    style={{ fontSize: 11 }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                </div>
              </div>

              {/* Bio summary */}
              <div
                style={{
                  background: '#fcfaf8',
                  border: '1px solid #fae7d9',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginTop: 18,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: '#4a4a4a',
                }}
              >
                <strong style={{ color: '#181818', display: 'block', fontSize: 11, marginBottom: 4 }}>
                  Academic & Cohort Statement
                </strong>
                {student.bio || 'Junior year student in Computer Science. Researching distributed systems and cloud networks.'}
              </div>

              {/* Academic & Registry Grid */}
              <div
                className="form-grid"
                style={{
                  gap: 12,
                  marginTop: 18,
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 16,
                }}
              >
                <div>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Department
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#181818', marginTop: 2 }}>
                    {student.department}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Faculty
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#181818', marginTop: 2 }}>
                    {student.faculty || 'Computing & Info Tech'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Registration No
                  </span>
                  <div style={{ font: '600 12px var(--app-font-mono)', color: '#181818', marginTop: 2 }}>
                    {student.regNo}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Academic Standing
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#277f60', marginTop: 2 }}>
                    {student.level} (Good Standing)
                  </div>
                </div>
              </div>
            </div>

            {/* Current Allocation & Bursary Status Card */}
            <div className="card card-pad" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BedDouble size={15} color="#277f60" /> Current Housing Placement
                </strong>
                <span className="tag sage">{student.allocationStatus}</span>
              </div>

              <div className="form-grid" style={{ gap: 10, fontSize: 12 }}>
                <div style={{ background: '#fff', padding: 10, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, color: '#888' }}>Allocated Room</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#181818', marginTop: 2 }}>
                    Room {student.room}
                  </div>
                  <div style={{ fontSize: 10, color: '#68707c' }}>Mango House · 2nd Floor</div>
                </div>

                <div style={{ background: '#fff', padding: 10, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, color: '#888' }}>Algorithm Match</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#277f60', marginTop: 2 }}>
                    {student.matchScore}% Score
                  </div>
                  <div style={{ fontSize: 10, color: '#68707c' }}>High Preference Fit</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <Link href="/student/payments" className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: 11 }}>
                  View Clearance
                </Link>
                <Link href="/student/roommates" className="btn btn-dark btn-sm" style={{ flex: 1, fontSize: 11 }}>
                  Roommate Pairing
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact, Emergency & Quick Preference Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Contact & Emergency Card */}
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <strong style={{ fontSize: 14 }}>Contact & Security Details</strong>
                <span className="tag sand" style={{ fontSize: 10 }}>Official Records</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <div className="avatar sand" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}>
                    <Mail size={14} color="#888" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888' }}>Campus Student Email</div>
                    <div style={{ fontWeight: 600, color: '#181818' }}>{student.email || 'v.okafor@campus.edu.ng'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <div className="avatar sage" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}>
                    <Phone size={14} color="#277f60" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888' }}>Mobile Phone</div>
                    <div style={{ fontWeight: 600, color: '#181818' }}>{student.phone || '+234 812 345 6789'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <div className="avatar peach" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}>
                    <Heart size={14} color="#b26829" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888' }}>Emergency Contact</div>
                    <div style={{ fontWeight: 600, color: '#181818' }}>
                      {student.emergencyContact || 'Mrs. Ngozi Okafor (Mother)'}
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>{student.emergencyPhone || '+234 803 111 2233'}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', fontSize: 11 }}
                  onClick={() => setIsEditingContact(true)}
                  data-testid="button-open-contact-modal"
                >
                  <Edit3 size={13} /> Update Contact Information
                </button>
              </div>
            </div>

            {/* Preferences Quick Card */}
            <div className="card card-pad" style={{ background: '#fefaf6', border: '1px solid #fae7d9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="eyebrow" style={{ color: '#b26829' }}>Housing Preferences</div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveTab('preferences')}
                  style={{ fontSize: 11, color: '#b26829' }}
                  data-testid="button-jump-to-preferences"
                >
                  Change <ChevronRight size={12} />
                </button>
              </div>

              <div className="preference-list" style={{ gap: 8 }}>
                <div className="preference-item" style={{ padding: '8px 10px', background: '#fff', borderRadius: 8 }}>
                  <small>Room Type</small>
                  <strong style={{ fontSize: 12 }}>{preference.roomType}</strong>
                </div>
                <div className="preference-item" style={{ padding: '8px 10px', background: '#fff', borderRadius: 8 }}>
                  <small>Floor Choice</small>
                  <strong style={{ fontSize: 12 }}>{preference.floor}</strong>
                </div>
                <div className="preference-item" style={{ padding: '8px 10px', background: '#fff', borderRadius: 8 }}>
                  <small>Quiet Hours</small>
                  <strong style={{ fontSize: 12 }}>{preference.quietHours}</strong>
                </div>
                <div className="preference-item" style={{ padding: '8px 10px', background: '#fff', borderRadius: 8 }}>
                  <small>Study Habit</small>
                  <strong style={{ fontSize: 12 }}>{preference.studyHabit || 'Night owl'}</strong>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  style={{ width: '100%', fontSize: 11 }}
                  onClick={() => setActiveTab('preferences')}
                >
                  <SlidersHorizontal size={13} /> Edit Full Preference Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Full Housing Preferences Configuration */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSavePreferences} data-testid="form-student-preferences">
          <div className="two-col" style={{ alignItems: 'flex-start', gap: 20 }}>
            {/* Left Column: Form Controls */}
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h3 style={{ fontSize: 18, margin: 0 }}>Living & Room Criteria</h3>
                  <p style={{ fontSize: 12, color: '#68707c', margin: '3px 0 0' }}>
                    Adjust criteria to recalibrate roommate pairing and room floor plan suggestions.
                  </p>
                </div>
                <span className="tag sage" style={{ fontSize: 10 }}>Live Sync</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Room Type */}
                <div>
                  <label className="field-label" htmlFor="pref-roomType">
                    Preferred Room Capacity / Type
                  </label>
                  <select
                    id="pref-roomType"
                    className="select"
                    value={prefForm.roomType}
                    onChange={(e) => handlePrefChange('roomType', e.target.value)}
                    data-testid="select-profile-roomType"
                  >
                    <option>Single room</option>
                    <option>Double room</option>
                    <option>Four-person room</option>
                  </select>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>
                    Double rooms offer the highest availability in Mango House & Aster Court.
                  </div>
                </div>

                {/* Preferred Floor */}
                <div>
                  <label className="field-label" htmlFor="pref-floor">
                    Floor Level Preference
                  </label>
                  <select
                    id="pref-floor"
                    className="select"
                    value={prefForm.floor}
                    onChange={(e) => handlePrefChange('floor', e.target.value)}
                    data-testid="select-profile-floor"
                  >
                    <option>Ground floor</option>
                    <option>1st floor</option>
                    <option>2nd floor</option>
                    <option>3rd floor (Top floor)</option>
                  </select>
                </div>

                {/* Quiet Hours */}
                <div>
                  <label className="field-label" htmlFor="pref-quietHours">
                    Quiet Hours & Noise Policy
                  </label>
                  <select
                    id="pref-quietHours"
                    className="select"
                    value={prefForm.quietHours}
                    onChange={(e) => handlePrefChange('quietHours', e.target.value)}
                    data-testid="select-profile-quietHours"
                  >
                    <option>9:00 pm to 5:00 am</option>
                    <option>10:00 pm to 6:00 am</option>
                    <option>11:00 pm to 7:00 am</option>
                    <option>Midnight to 8:00 am</option>
                    <option>Flexible / Moderate</option>
                  </select>
                </div>

                {/* Study Habits */}
                <div>
                  <label className="field-label" htmlFor="pref-studyHabit">
                    Study Habit & Academic Routine
                  </label>
                  <select
                    id="pref-studyHabit"
                    className="select"
                    value={prefForm.studyHabit || 'Night owl (Study after 8pm)'}
                    onChange={(e) => handlePrefChange('studyHabit', e.target.value)}
                    data-testid="select-profile-studyHabit"
                  >
                    <option>Night owl (Study after 8pm)</option>
                    <option>Early riser (Study 5:00 am to 9:00 am)</option>
                    <option>Afternoon study session</option>
                    <option>Library regular (Rarely in room during day)</option>
                    <option>Group study friendly</option>
                  </select>
                </div>

                {/* Sleep Schedule */}
                <div>
                  <label className="field-label" htmlFor="pref-sleepSchedule">
                    Sleep & Wake Cycle
                  </label>
                  <select
                    id="pref-sleepSchedule"
                    className="select"
                    value={prefForm.sleepSchedule || 'Late sleeper (after 12am)'}
                    onChange={(e) => handlePrefChange('sleepSchedule', e.target.value)}
                    data-testid="select-profile-sleepSchedule"
                  >
                    <option>Late sleeper (after 12am)</option>
                    <option>Early sleeper (before 10:30pm)</option>
                    <option>Standard (11:00 pm to 7:00 am)</option>
                    <option>Irregular / Exam mode</option>
                  </select>
                </div>

                {/* Noise Tolerance */}
                <div>
                  <label className="field-label" htmlFor="pref-noiseTolerance">
                    Room Noise & Social Tolerance
                  </label>
                  <select
                    id="pref-noiseTolerance"
                    className="select"
                    value={prefForm.noiseTolerance || 'Low ambient sound'}
                    onChange={(e) => handlePrefChange('noiseTolerance', e.target.value)}
                    data-testid="select-profile-noiseTolerance"
                  >
                    <option>Strict silence (Headphones only)</option>
                    <option>Low ambient sound</option>
                    <option>Moderate / Soft background music</option>
                    <option>Social & lively</option>
                  </select>
                </div>

                {/* Cleanliness Rating Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label" htmlFor="pref-cleanliness">
                      Cleanliness & Chore Expectation
                    </label>
                    <span className="tag sage" style={{ fontSize: 10 }}>
                      Level {prefForm.cleanlinessLevel || 4} of 5
                    </span>
                  </div>
                  <input
                    id="pref-cleanliness"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={prefForm.cleanlinessLevel || 4}
                    onChange={(e) => handlePrefChange('cleanlinessLevel', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#277f60', marginTop: 6 }}
                    data-testid="range-profile-cleanliness"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginTop: 4 }}>
                    <span>1: Casual / Relaxed</span>
                    <span>3: Moderate weekly</span>
                    <span>5: Spotless daily chores</span>
                  </div>
                </div>

                {/* Target Roommate Reg No */}
                <div>
                  <label className="field-label" htmlFor="pref-roommateRegNo">
                    Mutual Target Roommate (Optional Matric/Reg No)
                  </label>
                  <input
                    id="pref-roommateRegNo"
                    type="text"
                    className="input"
                    placeholder="e.g. CSC/22/1192"
                    value={prefForm.roommateRegNo}
                    onChange={(e) => handlePrefChange('roommateRegNo', e.target.value)}
                    data-testid="input-profile-roommateRegNo"
                  />
                  <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>
                    If both students enter each other's Reg No, the engine pairs you automatically.
                  </div>
                </div>

                {/* Special Medical / Accessibility Needs */}
                <div>
                  <label className="field-label" htmlFor="pref-specialNeeds">
                    Special Accommodation / Accessibility Needs
                  </label>
                  <input
                    id="pref-specialNeeds"
                    type="text"
                    className="input"
                    placeholder="e.g. Ground floor priority for mobility, low allergen"
                    value={prefForm.specialNeeds || ''}
                    onChange={(e) => handlePrefChange('specialNeeds', e.target.value)}
                    data-testid="input-profile-specialNeeds"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 24,
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 16,
                }}
              >
                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{ flex: 2 }}
                  data-testid="button-save-profile-preferences"
                >
                  <Save size={14} /> Save & Apply Preferences
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={handleResetPreferences}
                  disabled={!hasPrefChanges}
                  data-testid="button-reset-profile-preferences"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>

            {/* Right Column: Algorithmic Feedback & Match Impact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Algorithm Impact Card */}
              <div className="card card-pad" style={{ background: '#e7f5ef', border: '1px solid #bde7d4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#277f60" />
                  <strong style={{ fontSize: 15, color: '#145c46' }}>How These Criteria Affect Matching</strong>
                </div>
                <p style={{ color: '#3d8469', fontSize: 12, lineHeight: 1.5, margin: '8px 0 14px' }}>
                  The Smart Hostel allocation engine prioritizes harmonic living compatibility. Changes take effect on subsequent batch allocation sweeps and mutual room trades.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ color: '#477762', fontWeight: 600 }}>Sleep & Quiet Hours</span>
                    <span className="tag sage" style={{ fontSize: 9 }}>35% Weight</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ color: '#477762', fontWeight: 600 }}>Department & Academic Level</span>
                    <span className="tag sage" style={{ fontSize: 9 }}>25% Weight</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ color: '#477762', fontWeight: 600 }}>Floor & Accessibility</span>
                    <span className="tag sage" style={{ fontSize: 9 }}>20% Weight</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ color: '#477762', fontWeight: 600 }}>Mutual Roommate Pairing</span>
                    <span className="tag sage" style={{ fontSize: 9 }}>20% Weight</span>
                  </div>
                </div>

                <div className="notice" style={{ marginTop: 14, background: '#fff', border: '1px solid #c9ebd9' }}>
                  <CheckCircle2 size={13} color="#277f60" style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  Your current room (<strong>B-214</strong>) currently holds a <strong>94% compatibility match</strong>.
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: 13, marginBottom: 8, display: 'block' }}>Quick Preference Presets</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: 11, textAlign: 'left' }}
                    onClick={() => {
                      setPrefForm((prev) => ({
                        ...prev,
                        quietHours: '11:00 pm to 7:00 am',
                        studyHabit: 'Night owl (Study after 8pm)',
                        sleepSchedule: 'Late sleeper (after 12am)',
                        noiseTolerance: 'Low ambient sound',
                        cleanlinessLevel: 4,
                      }));
                      setHasPrefChanges(true);
                      onToast('Applied "Night Scholar" preset criteria.');
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>Night Scholar Preset</div>
                      <div style={{ fontSize: 9, color: '#888' }}>Late study, quiet midnight hours, high cleanliness</div>
                    </div>
                    <ArrowRight size={12} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: 11, textAlign: 'left' }}
                    onClick={() => {
                      setPrefForm((prev) => ({
                        ...prev,
                        quietHours: '10:00 pm to 6:00 am',
                        studyHabit: 'Early riser (Study 5:00 am to 9:00 am)',
                        sleepSchedule: 'Early sleeper (before 10:30pm)',
                        noiseTolerance: 'Strict silence (Headphones only)',
                        cleanlinessLevel: 5,
                      }));
                      setHasPrefChanges(true);
                      onToast('Applied "Early Bird & Focus" preset criteria.');
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>Early Bird & Focus</div>
                      <div style={{ fontSize: 9, color: '#888' }}>Morning study, early bedtime, strict quiet</div>
                    </div>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Main Tab 3: Digital ID & Gate Pass */}
      {activeTab === 'idcard' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <div
            className="card card-pad"
            style={{
              maxWidth: 460,
              width: '100%',
              background: '#fff',
              border: '2px solid #181818',
              borderRadius: 20,
              boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Badge Strip */}
            <div
              style={{
                background: '#181818',
                color: '#fff',
                padding: '12px 18px',
                margin: '-24px -24px 20px -24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 99, background: '#e59d6c' }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Student Hostel Clearance Pass
                </span>
              </div>
              <span style={{ font: '700 10px var(--app-font-mono)', color: '#e59d6c' }}>2026/2027</span>
            </div>

            {/* Main Pass Content */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div
                  className="avatar peach"
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 18,
                    fontSize: 26,
                    fontWeight: 800,
                    flexShrink: 0,
                    overflow: 'hidden',
                    padding: 0,
                    display: 'grid',
                    placeItems: 'center',
                    border: '2px solid #fae7d9',
                  }}
                >
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    student.initials
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 24,
                    height: 24,
                    borderRadius: 99,
                    background: '#181818',
                    color: '#fff',
                    border: '2px solid #fff',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="Update pass photo"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: 19, margin: 0, fontWeight: 800 }}>{student.name}</h3>
                <div style={{ font: '700 13px var(--app-font-mono)', color: '#b26829', marginTop: 2 }}>
                  {student.regNo}
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                  {student.department} · {student.level}
                </div>
              </div>
            </div>

            {/* Room & Clearance Block */}
            <div
              className="form-grid"
              style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: 14,
                padding: '12px 14px',
                marginTop: 18,
                gap: 10,
              }}
            >
              <div>
                <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>Allocated Room</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181818' }}>Room {student.room}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>Mango House (Block B)</div>
              </div>

              <div>
                <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>Bursary Fee</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#277f60' }}>₦185,000</div>
                <div style={{ fontSize: 10, color: '#277f60', fontWeight: 600 }}>Cleared & Verified</div>
              </div>
            </div>

            {/* Mock QR Verification Code */}
            <div
              style={{
                marginTop: 20,
                padding: 14,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#181818' }}>Digital Porter Verification</div>
                <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>Scan at Hostel Gate for Check-in</div>
                <div style={{ font: '600 9px var(--app-font-mono)', color: '#277f60', marginTop: 4 }}>
                  HASH: HAVEN-PASS-2026-{student.regNo.replaceAll('/', '')}-VERIFIED
                </div>
              </div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: '#181818',
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <QrCode size={32} color="#f4c59e" />
              </div>
            </div>

            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-dark btn-sm"
                style={{ width: '100%', fontSize: 11 }}
                onClick={() => onToast('Digital pass saved to device. Ready for hostel porter inspection.')}
                data-testid="button-download-gatepass"
              >
                Download Clearance Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Details Modal */}
      {isEditingContact && (
        <div className="modal-backdrop" onClick={() => setIsEditingContact(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Update Contact Information</h3>
              <button className="icon-button" onClick={() => setIsEditingContact(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="field-label" htmlFor="contact-email">
                  Student University Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="input"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  data-testid="input-contact-email"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="contact-phone">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="input"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  data-testid="input-contact-phone"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="contact-emergency">
                  Emergency Contact Name & Relationship
                </label>
                <input
                  id="contact-emergency"
                  type="text"
                  className="input"
                  value={contactForm.emergencyContact}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                  required
                  data-testid="input-contact-emergency"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="contact-emergency-phone">
                  Emergency Phone Number
                </label>
                <input
                  id="contact-emergency-phone"
                  type="tel"
                  className="input"
                  value={contactForm.emergencyPhone}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
                  required
                  data-testid="input-contact-emergency-phone"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="contact-bio">
                  Academic Statement / Bio
                </label>
                <textarea
                  id="contact-bio"
                  className="textarea"
                  rows={3}
                  value={contactForm.bio}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, bio: e.target.value }))}
                  data-testid="textarea-contact-bio"
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button 
                  type="submit" 
                  className="btn btn-dark" 
                  style={{ flex: 1, gap: '8px' }} 
                  data-testid="button-save-contact-modal"
                  disabled={isSavingContact}
                >
                  {isSavingContact ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isSavingContact ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditingContact(false)}
                  disabled={isSavingContact}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Capture & Upload Modal */}
      <PhotoCaptureModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatarUrl={student.avatarUrl}
        studentName={student.name}
        initials={student.initials}
        onSaveAvatar={async (url) => {
          const updated = { ...student, avatarUrl: url };
          setStudent(updated);
          if (isSupabaseConfigured()) await dbSaveStudent(updated).catch(console.error);
        }}
        onRemoveAvatar={async () => {
          const updated = { ...student, avatarUrl: undefined };
          setStudent(updated);
          if (isSupabaseConfigured()) await dbSaveStudent(updated).catch(console.error);
        }}
        onToast={onToast}
      />
    </div>
  );
}
