import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  RefreshCw,
  Check,
  X,
  Trash2,
  AlertCircle,
  Sparkles,
  Volume2,
  SwitchCamera,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Tech Scholar',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Campus Leader',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Innovator',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    name: 'Researcher',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
];

export function PhotoCaptureModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  studentName,
  initials,
  onSaveAvatar,
  onRemoveAvatar,
  onToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  studentName: string;
  initials: string;
  onSaveAvatar: (url: string) => void;
  onRemoveAvatar: () => void;
  onToast: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'presets'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera and microphone media tracks
  const stopMediaStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setMicLevel(0);
    setIsMicActive(false);
  }, [stream]);

  // Start Camera with Video & Microphone stream
  const startCamera = useCallback(async () => {
    stopMediaStream();
    setCameraError(null);
    setCapturedImage(null);

    try {
      // First attempt: Request both camera and microphone
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 640 },
          },
          audio: true,
        });
        setIsMicActive(true);
      } catch (micErr) {
        // Fallback: If audio denied/failed, request camera only
        console.warn('Microphone stream optional fallback:', micErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 640 },
          },
          audio: false,
        });
        setIsMicActive(false);
      }

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      // If audio tracks exist, set up audio analyzer for live mic meter
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(mediaStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setMicLevel(Math.min(100, Math.round((average / 128) * 100)));
            }
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera/Microphone permission was denied. Please allow camera access in your browser or choose "Upload Image" instead.'
          : `Unable to access camera: ${err.message || 'Device not found'}`
      );
    }
  }, [facingMode, stopMediaStream]);

  // Manage camera on open/tab change
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopMediaStream();
    }

    return () => {
      stopMediaStream();
    };
  }, [isOpen, activeTab, facingMode]);

  if (!isOpen) return null;

  // Handle capture snapshot from live video
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Center crop square
      const startX = ((video.videoWidth || size) - size) / 2;
      const startY = ((video.videoHeight || size) - size) / 2;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopMediaStream();
    }
    setIsCapturing(false);
  };

  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Please drop a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Confirm photo save
  const handleConfirmSave = (photoUrl: string) => {
    onSaveAvatar(photoUrl);
    stopMediaStream();
    onClose();
    onToast('Student profile avatar updated successfully.');
  };

  // Switch between front/back cameras
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-photo-capture">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fcf2ea',
                color: '#b26829',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Update Profile Photo</h3>
              <p style={{ fontSize: 11, color: '#68707c', margin: 0 }}>
                Capture with camera/mic or upload a clearance photo
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} data-testid="button-close-photo-modal">
            <X size={16} />
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 16 }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'camera' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => {
              setActiveTab('camera');
              setCapturedImage(null);
            }}
            style={{ flex: 1, fontSize: 11 }}
            data-testid="tab-capture-camera"
          >
            <Camera size={13} /> Live Camera
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'upload' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('upload')}
            style={{ flex: 1, fontSize: 11 }}
            data-testid="tab-capture-upload"
          >
            <Upload size={13} /> Upload File
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'presets' ? 'btn-dark' : 'btn-ghost'}`}
            onClick={() => setActiveTab('presets')}
            style={{ flex: 1, fontSize: 11 }}
            data-testid="tab-capture-presets"
          >
            <Sparkles size={13} /> Campus Presets
          </button>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Tab 1: Live Camera Capture */}
        {activeTab === 'camera' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            {cameraError ? (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '16px',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <AlertCircle size={24} color="#dc2626" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>Camera Access Required</div>
                <p style={{ fontSize: 12, color: '#7f1d1d', margin: '6px 0 12px', lineHeight: 1.45 }}>
                  {cameraError}
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button type="button" className="btn btn-sm btn-dark" onClick={startCamera}>
                    <RefreshCw size={12} /> Retry Permission
                  </button>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => setActiveTab('upload')}>
                    <Upload size={12} /> Upload from Files
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              /* Captured Image Preview */
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '3px solid #b26829',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={capturedImage}
                    alt="Captured student avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: '#277f60',
                      color: '#fff',
                      borderRadius: 99,
                      padding: 4,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Check size={14} />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#181818' }}>Snapshot Captured!</div>
                  <div style={{ fontSize: 11, color: '#68707c', marginTop: 2 }}>
                    Ready to set as verified student avatar for {studentName}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setCapturedImage(null);
                      startCamera();
                    }}
                    data-testid="button-retake-photo"
                  >
                    <RefreshCw size={13} /> Retake
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    style={{ flex: 1.5 }}
                    onClick={() => handleConfirmSave(capturedImage)}
                    data-testid="button-confirm-captured-photo"
                  >
                    <Check size={14} /> Use This Photo
                  </button>
                </div>
              </div>
            ) : (
              /* Live Video Viewfinder */
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    position: 'relative',
                    width: 240,
                    height: 240,
                    borderRadius: 24,
                    overflow: 'hidden',
                    background: '#181818',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                    }}
                  />

                  {/* Framing Overlay Target Guides */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 20,
                      border: '1px dashed rgba(255,255,255,0.4)',
                      borderRadius: 16,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Switch Camera Button */}
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 99,
                      width: 32,
                      height: 32,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                    title="Switch Camera (Front / Back)"
                  >
                    <SwitchCamera size={15} />
                  </button>
                </div>

                {/* Microphone Sensor Status & Level Indicator */}
                <div
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    {isMicActive ? (
                      <Mic size={14} color="#277f60" />
                    ) : (
                      <MicOff size={14} color="#888" />
                    )}
                    <span style={{ color: '#475569', fontWeight: 600 }}>
                      {isMicActive ? 'Microphone Active' : 'Microphone Inactive'}
                    </span>
                  </div>

                  {isMicActive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          background: '#e2e8f0',
                          borderRadius: 99,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${micLevel}%`,
                            background: micLevel > 50 ? '#e59d6c' : '#277f60',
                            transition: 'width 0.1s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 9, font: '600 9px var(--app-font-mono)', color: '#64748b' }}>
                        {micLevel}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Capture Button */}
                <button
                  type="button"
                  className="btn btn-dark"
                  style={{ width: '100%', padding: '10px 16px', fontSize: 13, gap: 8 }}
                  onClick={handleCaptureSnapshot}
                  disabled={isCapturing || !stream}
                  data-testid="button-take-snapshot"
                >
                  <Camera size={16} /> Take Photo Snapshot
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              data-testid="input-file-avatar"
            />

            {uploadedPreview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '3px solid #b26829',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={uploadedPreview}
                    alt="Uploaded preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setUploadedPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <RefreshCw size={13} /> Change File
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    style={{ flex: 1.5 }}
                    onClick={() => handleConfirmSave(uploadedPreview)}
                    data-testid="button-confirm-uploaded-photo"
                  >
                    <Check size={14} /> Apply Photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 16,
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: '#eef2f6',
                    color: '#64748b',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Upload size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#181818' }}>
                  Click to select photo or drag and drop
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>
                  Supports JPEG, PNG, WEBP up to 5MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Presets */}
        {activeTab === 'presets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#68707c' }}>
              Choose a standard campus identification photo preset:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {PRESET_AVATARS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleConfirmSave(p.url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 8,
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:border-slate-400"
                  data-testid={`button-preset-${p.id}`}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#181818' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#277f60' }}>Campus Verified</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer / Remove photo option */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 12,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {currentAvatarUrl ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ color: '#b91c1c', fontSize: 11, gap: 5 }}
              onClick={() => {
                onRemoveAvatar();
                stopMediaStream();
                onClose();
                onToast('Profile photo removed. Initial avatar restored.');
              }}
              data-testid="button-remove-avatar"
            >
              <Trash2 size={12} /> Remove Current Photo
            </button>
          ) : (
            <span style={{ fontSize: 11, color: '#888' }}>
              Using initial avatar ({initials})
            </span>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              stopMediaStream();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
