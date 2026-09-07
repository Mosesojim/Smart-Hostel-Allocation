import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  QrCode,
  ShieldCheck,
  Building,
  RefreshCw,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  FileCheck,
  AlertTriangle,
  Receipt,
  Printer,
  BadgeCheck,
} from 'lucide-react';
import {
  PaymentReceipt,
  PaymentReceiptStatus,
  PaymentChannel,
  AppNotification,
  Student,
  AllocationRequest,
} from '../types';
import { student as defaultStudent, hostels } from '../data';

// Helper to format Nigerian Naira currency
export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

// ----------------------------------------------------------------------
// 1. STUDENT PORTAL: FEE PAYMENT & RECEIPT SUBMISSION
// ----------------------------------------------------------------------
export function StudentPayments({
  receipts,
  setReceipts,
  student = defaultStudent,
  onToast,
  onAddNotification,
}: {
  receipts: PaymentReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<PaymentReceipt[]>>;
  student?: Student;
  onToast: (message: string) => void;
  onAddNotification?: (notif: AppNotification) => void;
}) {
  // Form State
  const [referenceNo, setReferenceNo] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('School Portal (Remita RRR)');
  const [amountPaid, setAmountPaid] = useState('185000');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerName, setPayerName] = useState(student.name);
  const [bankName, setBankName] = useState('Zenith Bank / Remita');
  const [feeType, setFeeType] = useState<'Full Accommodation Package' | 'Hostel Accommodation Fee' | 'Caution & Maintenance Levy'>('Full Accommodation Package');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | undefined>();
  const [receiptFileSize, setReceiptFileSize] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'pass'>('submit');

  // Modals
  const [inspectingReceipt, setInspectingReceipt] = useState<PaymentReceipt | null>(null);
  const [showClearancePassModal, setShowClearancePassModal] = useState(false);

  // Student's personal receipts
  const studentReceipts = useMemo(() => {
    return receipts.filter((r) => r.regNo === student.regNo);
  }, [receipts, student.regNo]);

  const latestReceipt = studentReceipts[0];
  const isCleared = studentReceipts.some((r) => r.status === 'Approved');

  // Handle file drop / select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      setReceiptFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Sample Demo Receipt
  const generateSampleReceipt = () => {
    const rrr = `RRR-2608-${Math.floor(1000 + Math.random() * 9000)}-${student.regNo.split('/')[2] || '1048'}`;
    setReferenceNo(rrr);
    setPaymentChannel('School Portal (Remita RRR)');
    setAmountPaid('185000');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPayerName(student.name);
    setBankName('Zenith Bank / University Remita Gateway');
    setReceiptFileName(`Hostel_Fee_Remita_Receipt_${student.regNo.replace(/\//g, '_')}.pdf`);
    setReceiptFileSize('1.2 MB');
    setReceiptDataUrl('sample_receipt');
    onToast('Generated realistic University Portal e-receipt mockup.');
  };

  // Handle Form Submission
  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNo.trim()) {
      onToast('Please enter your payment RRR or transaction reference number.');
      return;
    }
    if (!amountPaid || Number(amountPaid) <= 0) {
      onToast('Please provide a valid amount paid.');
      return;
    }
    if (!receiptFileName) {
      onToast('Please attach or upload your payment receipt document.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReceipt: PaymentReceipt = {
        id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
        studentName: student.name,
        regNo: student.regNo,
        department: student.department,
        level: student.level,
        amountPaid: Number(amountPaid),
        expectedAmount: 185000,
        paymentDate: paymentDate || new Date().toISOString().split('T')[0],
        paymentChannel,
        referenceNo: referenceNo.trim().toUpperCase(),
        session: '2026/2027 Session',
        hostelName: student.assignedHostel || 'Mango House (Block B)',
        roomNumber: student.room || 'B-214',
        feeType,
        receiptFileName: receiptFileName || 'hostel_fee_receipt.pdf',
        receiptFileSize: receiptFileSize || '1.1 MB',
        receiptDataUrl: receiptDataUrl || 'sample_receipt',
        status: 'Pending',
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bankName,
        payerName,
        adminNotes: studentNotes ? `Student note: ${studentNotes}` : undefined,
      };

      setReceipts((prev) => [newReceipt, ...prev]);
      setIsSubmitting(false);
      onToast('Payment verification receipt submitted successfully! Sent to Bursary for clearance.');

      if (onAddNotification) {
        onAddNotification({
          id: `notif-${Date.now()}`,
          recipientRegNo: student.regNo,
          title: 'Receipt Submitted for Verification',
          message: `Your payment receipt (${newReceipt.referenceNo}) for ${formatNaira(newReceipt.amountPaid)} is now queued for Bursary approval.`,
          type: 'system',
          read: false,
          timestamp: 'Just now',
          actionUrl: '/student/payments',
        });
      }

      // Reset form fields
      setReferenceNo('');
      setReceiptFileName('');
      setReceiptDataUrl(undefined);
      setStudentNotes('');
      setActiveTab('history');
    }, 450);
  };

  // Prefill for resubmission
  const handleResubmit = (failedReceipt: PaymentReceipt) => {
    setReferenceNo(failedReceipt.referenceNo);
    setAmountPaid(failedReceipt.expectedAmount.toString());
    setPaymentChannel(failedReceipt.paymentChannel);
    setPayerName(failedReceipt.payerName || student.name);
    setBankName(failedReceipt.bankName || 'School Portal Gateway');
    setActiveTab('submit');
    onToast(`Re-submission initialized for ${failedReceipt.id}. Update reference and receipt.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner & Context */}
      <div
        className="card card-pad reveal"
        style={{
          background: 'linear-gradient(135deg, #fefcfb 0%, #fdf5ef 100%)',
          border: '1px solid #fae2d0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 640 }}>
            <div className="eyebrow" style={{ color: '#b26829' }}>
              Bursary & Student Accounts
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', margin: '6px 0 8px', letterSpacing: '-0.02em', color: '#1f1f1f' }}>
              Hostel Fee Payment & Receipt Verification
            </h2>
            <p style={{ fontSize: 13, color: '#68707c', lineHeight: 1.5, margin: 0 }}>
              Official accommodation fees are remitted via the University Student Portal (Remita RRR Gateway) or accredited campus bank branches. Submit your transaction e-receipt below to receive verified Bursary clearance and access your digital gate pass.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={generateSampleReceipt}
              data-testid="button-demo-receipt"
              style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            >
              <Sparkles size={13} color="#b26829" />
              <span>Fill Sample E-Receipt</span>
            </button>
            {isCleared && (
              <button
                className="btn btn-dark btn-sm"
                onClick={() => setShowClearancePassModal(true)}
                data-testid="button-view-clearance-pass"
              >
                <QrCode size={14} />
                <span>View Clearance Pass</span>
              </button>
            )}
          </div>
        </div>

        {/* Future Automation Notice */}
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 10,
            border: '1px dashed #e8d0bc',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 11,
            color: '#7b5337',
          }}
        >
          <Info size={15} style={{ flexShrink: 0, color: '#b26829' }} />
          <span>
            <strong>Bursary Policy Notice:</strong> Receipts submitted here are cross-referenced with bank transaction ledgers. In upcoming releases, direct API verification will validate RRR transactions in real-time.
          </span>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="three-col reveal delay-1">
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow">Assigned Accommodation</div>
            <Building size={16} color="#888" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 4px', color: '#1a1a1a' }}>
            Mango House · Room B-214
          </div>
          <div style={{ fontSize: 11, color: '#68707c' }}>
            Double Room (2nd Floor) · 2026/2027 Session
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <span className="tag peach">Block B</span>
            <span className="tag sage">Bed Space Cleared</span>
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow">Session Fee Tariff</div>
            <Receipt size={16} color="#888" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 4px', color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
            {formatNaira(185000)}
          </div>
          <div style={{ fontSize: 11, color: '#68707c', lineHeight: 1.4 }}>
            Includes ₦165,000 room tariff + ₦10,000 maintenance + ₦10,000 refundable caution.
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: '#277f60', fontWeight: 600 }}>
            ✓ Standard Approved University Rate
          </div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow">Clearance Status</div>
            <ShieldCheck size={16} color={isCleared ? '#277f60' : '#b26829'} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 4px', color: isCleared ? '#277f60' : '#b26829' }}>
            {isCleared ? 'Verified & Cleared' : latestReceipt?.status === 'Pending' ? 'Verification In Progress' : 'Payment Required'}
          </div>
          <div style={{ fontSize: 11, color: '#68707c' }}>
            {isCleared
              ? 'Bursary verified. Digital move-in clearance pass active.'
              : latestReceipt?.status === 'Pending'
              ? `Receipt ${latestReceipt.referenceNo} under Bursary review.`
              : 'Submit your portal RRR payment slip to complete room check-in.'}
          </div>
          <div style={{ marginTop: 12 }}>
            <span className={`tag ${isCleared ? 'sage' : latestReceipt?.status === 'Pending' ? 'sand' : 'peach'}`}>
              {isCleared ? 'Official Stamp Issued' : latestReceipt?.status === 'Pending' ? 'Pending Review' : 'Action Required'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs for Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: 8, paddingBottom: 2, flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'submit' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          onClick={() => setActiveTab('submit')}
          data-testid="tab-submit-receipt"
        >
          <Upload size={14} />
          <span>Submit Payment Receipt</span>
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          onClick={() => setActiveTab('history')}
          data-testid="tab-receipt-history"
        >
          <FileText size={14} />
          <span>Verification History ({studentReceipts.length})</span>
        </button>
        {isCleared && (
          <button
            className={`btn ${activeTab === 'pass' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
            onClick={() => setActiveTab('pass')}
            data-testid="tab-clearance-pass"
          >
            <QrCode size={14} />
            <span>Digital Gate Pass</span>
          </button>
        )}
      </div>

      {/* Tab 1: Submit Form */}
      {activeTab === 'submit' && (
        <div className="two-col reveal delay-2">
          {/* Main Submission Form */}
          <form onSubmit={handleSubmitReceipt} className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
            <div className="card-head" style={{ marginBottom: 16 }}>
              <div>
                <div className="eyebrow" style={{ color: '#b26829' }}>Receipt Submission Form</div>
                <h3 style={{ fontSize: 16, margin: '4px 0 0' }}>Bursary Verification Details</h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={generateSampleReceipt}
                style={{ fontSize: 11 }}
              >
                Auto-fill Demo
              </button>
            </div>

            <div className="form-grid" style={{ gap: 14 }}>
              {/* Reference / RRR Number */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label" htmlFor="input-rrr-reference">
                  Remita Retrieval Reference (RRR) or Transaction ID *
                </label>
                <input
                  id="input-rrr-reference"
                  className="input"
                  placeholder="e.g. RRR-2608-9941-1048 or TXN-9018429"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  required
                  data-testid="input-reference-no"
                  style={{ fontFamily: 'var(--app-font-mono)', fontWeight: 600, letterSpacing: '0.04em' }}
                />
                <span style={{ fontSize: 10, color: '#888', marginTop: 3, display: 'block' }}>
                  Located at the top right of your school portal or Remita payment receipt.
                </span>
              </div>

              {/* Payment Channel */}
              <div>
                <label className="field-label" htmlFor="select-payment-channel">
                  Payment Channel *
                </label>
                <select
                  id="select-payment-channel"
                  className="input"
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as PaymentChannel)}
                  data-testid="select-payment-channel"
                >
                  <option value="School Portal (Remita RRR)">School Portal (Remita RRR)</option>
                  <option value="Direct Bank Deposit">Direct Bank Deposit / Teller</option>
                  <option value="Interswitch / WebPay">Interswitch / WebPay</option>
                  <option value="Campus Microfinance">Campus Microfinance Bank</option>
                  <option value="NIBSS Instant Transfer">NIBSS Instant Transfer</option>
                </select>
              </div>

              {/* Amount Paid */}
              <div>
                <label className="field-label" htmlFor="input-amount-paid">
                  Amount Paid (₦) *
                </label>
                <input
                  id="input-amount-paid"
                  type="number"
                  className="input"
                  placeholder="185000"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  required
                  data-testid="input-amount-paid"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="field-label" htmlFor="input-payment-date">
                  Payment Date *
                </label>
                <input
                  id="input-payment-date"
                  type="date"
                  className="input"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  data-testid="input-payment-date"
                />
              </div>

              {/* Fee Type */}
              <div>
                <label className="field-label" htmlFor="select-fee-type">
                  Fee Category *
                </label>
                <select
                  id="select-fee-type"
                  className="input"
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value as any)}
                >
                  <option value="Full Accommodation Package">Full Accommodation Package (₦185k)</option>
                  <option value="Hostel Accommodation Fee">Accommodation Fee Only (₦165k)</option>
                  <option value="Caution & Maintenance Levy">Caution & Maintenance Levy (₦20k)</option>
                </select>
              </div>

              {/* Bank / Gateway Name */}
              <div>
                <label className="field-label" htmlFor="input-bank-name">
                  Bank / Gateway Name
                </label>
                <input
                  id="input-bank-name"
                  className="input"
                  placeholder="e.g. Zenith Bank PLC / Remita"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              {/* Payer Name */}
              <div>
                <label className="field-label" htmlFor="input-payer-name">
                  Payer Name on Receipt
                </label>
                <input
                  id="input-payer-name"
                  className="input"
                  placeholder="e.g. Victory Okafor"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                />
              </div>

              {/* File Upload Area */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">
                  Attach Official Payment Receipt / Teller (PDF or Image) *
                </label>

                <div
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: 12,
                    padding: '22px 18px',
                    textAlign: 'center',
                    background: receiptFileName ? '#f0fdf4' : '#fafafa',
                    borderColor: receiptFileName ? '#86efac' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => document.getElementById('receipt-file-input')?.click()}
                >
                  <input
                    type="file"
                    id="receipt-file-input"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    data-testid="input-file-receipt"
                  />

                  {receiptFileName ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <div className="avatar sage" style={{ width: 36, height: 36 }}>
                        <FileCheck size={20} color="#277f60" />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#181818' }}>{receiptFileName}</div>
                        <div style={{ fontSize: 11, color: '#68707c' }}>{receiptFileSize || 'Ready for upload'} · Click to replace file</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} style={{ color: '#9ca3af', margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                        Click to upload or drag and drop receipt
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                        PDF, JPG, PNG up to 10MB (Ensure RRR, Amount, and Date are clearly legible)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Remarks */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label" htmlFor="input-student-notes">
                  Additional Notes to Bursary Officer (Optional)
                </label>
                <textarea
                  id="input-student-notes"
                  className="input"
                  rows={2}
                  placeholder="e.g. Payment made on behalf of student by sponsor / guardian..."
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="submit"
                className="btn btn-dark"
                disabled={isSubmitting}
                data-testid="button-submit-payment"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Uploading & Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Submit for Bursary Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guide & Instructions Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="eyebrow" style={{ color: '#277f60' }}>Verification Steps</div>
              <h3 style={{ fontSize: 15, margin: '6px 0 12px' }}>How Payment Clearance Works</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>1</div>
                  <div>
                    <strong style={{ fontSize: 12 }}>Generate RRR & Pay on Portal</strong>
                    <p style={{ fontSize: 11, color: '#68707c', margin: '2px 0 0' }}>
                      Log in to the central school student portal, select Hostel Fee for <strong>Mango House</strong>, generate your RRR and make payment.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>2</div>
                  <div>
                    <strong style={{ fontSize: 12 }}>Upload E-Receipt Slip Here</strong>
                    <p style={{ fontSize: 11, color: '#68707c', margin: '2px 0 0' }}>
                      Submit your RRR number and upload the PDF/image receipt using the form on the left.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>3</div>
                  <div>
                    <strong style={{ fontSize: 12 }}>Bursary Officer Verification</strong>
                    <p style={{ fontSize: 11, color: '#68707c', margin: '2px 0 0' }}>
                      Campus Finance matches your RRR against bank settlement logs. Typical clearance takes under 24 hours.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="avatar sage" style={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>4</div>
                  <div>
                    <strong style={{ fontSize: 12 }}>Instant Notification & Gate Pass</strong>
                    <p style={{ fontSize: 11, color: '#68707c', margin: '2px 0 0' }}>
                      Once approved, an in-app notification is sent to your notification panel and your Digital Clearance Gate Pass is activated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* University Bank Accounts Reference */}
            <div className="card card-pad" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <div className="eyebrow">Bank Account Reference</div>
              <h4 style={{ fontSize: 13, margin: '4px 0 8px' }}>Accredited Campus Payment Channels</h4>
              <div style={{ fontSize: 11, color: '#4a4f56', lineHeight: 1.5 }}>
                <div><strong>Remita Service:</strong> University Hostel Accommodation</div>
                <div><strong>Bank Name:</strong> Zenith Bank PLC</div>
                <div><strong>Account Name:</strong> University Housing & Bursary Operations</div>
                <div><strong>Sort Code:</strong> 057150013</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Verification History */}
      {activeTab === 'history' && (
        <div className="card card-pad reveal delay-1" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="card-head" style={{ marginBottom: 16 }}>
            <div>
              <div className="eyebrow">Submission History</div>
              <h3 style={{ fontSize: 16, margin: '4px 0 0' }}>My Submitted Fee Receipts</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('submit')}>
              <Upload size={13} />
              <span>Submit Another Receipt</span>
            </button>
          </div>

          {studentReceipts.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: '#888' }}>
              <Receipt size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ margin: 0 }}>No receipts submitted yet. Use the form above to upload your payment receipt.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {studentReceipts.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    background: rec.status === 'Approved' ? '#fcfdfd' : rec.status === 'Rejected' ? '#fffbfa' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#181818' }}>{rec.referenceNo}</span>
                        <span
                          className={`tag ${
                            rec.status === 'Approved'
                              ? 'sage'
                              : rec.status === 'Pending'
                              ? 'sand'
                              : 'peach'
                          }`}
                        >
                          {rec.status === 'Approved' ? 'Verified & Cleared' : rec.status === 'Pending' ? 'Pending Review' : 'Rejected'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#68707c', marginTop: 4 }}>
                        {rec.feeType} · Submitted on {rec.submittedAt} · Channel: {rec.paymentChannel}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#181818', fontVariantNumeric: 'tabular-nums' }}>
                        {formatNaira(rec.amountPaid)}
                      </div>
                      <div style={{ fontSize: 10, color: '#888' }}>
                        Expected: {formatNaira(rec.expectedAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Status Banner / Feedback */}
                  {rec.status === 'Approved' && (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: '#f0fdf4',
                        borderRadius: 8,
                        fontSize: 11,
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={14} color="#166534" />
                        <span>
                          Verified by {rec.verifiedBy || 'Campus Bursary'} on {rec.verifiedAt || 'Aug 23, 2026'}.
                        </span>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ height: 26, padding: '0 8px', fontSize: 10, background: '#fff' }}
                        onClick={() => setShowClearancePassModal(true)}
                      >
                        <QrCode size={11} />
                        <span>Clearance Pass</span>
                      </button>
                    </div>
                  )}

                  {rec.status === 'Rejected' && (
                    <div
                      style={{
                        padding: '10px 12px',
                        background: '#fff1f2',
                        borderRadius: 8,
                        fontSize: 11,
                        color: '#9f1239',
                        border: '1px solid #fecdd3',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <strong>Verification Rejected: </strong>
                          <span>{rec.rejectionReason}</span>
                          {rec.adminNotes && (
                            <div style={{ marginTop: 4, fontStyle: 'italic' }}>Note: {rec.adminNotes}</div>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 8, textAlign: 'right' }}>
                        <button
                          className="btn btn-dark btn-sm"
                          style={{ height: 26, fontSize: 10 }}
                          onClick={() => handleResubmit(rec)}
                        >
                          <RefreshCw size={11} />
                          <span>Resubmit Payment Receipt</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 11, color: '#68707c', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={13} />
                      <span>{rec.receiptFileName}</span>
                      {rec.receiptFileSize && <span>({rec.receiptFileSize})</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 11 }}
                        onClick={() => setInspectingReceipt(rec)}
                      >
                        <Eye size={12} />
                        <span>Inspect Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Digital Gate Pass */}
      {activeTab === 'pass' && isCleared && (
        <div className="reveal delay-1" style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
          <ClearancePassCard student={student} receipt={latestReceipt} onPrint={() => window.print()} />
        </div>
      )}

      {/* Receipt Inspection Modal */}
      {inspectingReceipt && (
        <ReceiptInspectionModal
          receipt={inspectingReceipt}
          onClose={() => setInspectingReceipt(null)}
        />
      )}

      {/* Clearance Pass Modal */}
      {showClearancePassModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 580, padding: 24 }}>
            <div className="modal-head" style={{ marginBottom: 14 }}>
              <div>
                <div className="eyebrow" style={{ color: '#277f60' }}>Official Clearance Pass</div>
                <h2 style={{ fontSize: 18 }}>Digital Gate Pass & Verification Slip</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowClearancePassModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <ClearancePassCard student={student} receipt={latestReceipt} onPrint={() => window.print()} />

            <div className="modal-actions" style={{ marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setShowClearancePassModal(false)}>
                Close
              </button>
              <button
                className="btn btn-dark"
                onClick={() => {
                  onToast('Official Clearance Pass PDF downloaded to device.');
                  setShowClearancePassModal(false);
                }}
              >
                <Download size={14} />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. CLEARANCE PASS CARD COMPONENT
// ----------------------------------------------------------------------
function ClearancePassCard({
  student,
  receipt,
  onPrint,
}: {
  student: Student;
  receipt?: PaymentReceipt;
  onPrint?: () => void;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '2px solid #277f60',
        padding: 24,
        boxShadow: '0 8px 30px rgba(39, 127, 96, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      data-testid="clearance-pass-card"
    >
      {/* Decorative Watermark Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px dashed #e2e8f0',
          paddingBottom: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#277f60', fontWeight: 800 }}>
            University Housing & Bursary Directorate
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginTop: 2 }}>
            Official Hostel Clearance Gate Pass
          </div>
          <div style={{ fontSize: 11, color: '#68707c', marginTop: 2 }}>
            2026/2027 Academic Session · Valid for Check-in
          </div>
        </div>

        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 10,
            padding: '6px 10px',
            textAlign: 'center',
          }}
        >
          <BadgeCheck size={20} color="#166534" style={{ margin: '0 auto 2px' }} />
          <div style={{ fontSize: 9, fontWeight: 800, color: '#166534', letterSpacing: '0.05em' }}>VERIFIED</div>
        </div>
      </div>

      {/* Student & Room Grid */}
      <div className="form-grid" style={{ gap: 14, fontSize: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Student Name</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#181818' }}>{student.name}</div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Matric / Reg No</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#181818', fontFamily: 'var(--app-font-mono)' }}>
            {student.regNo}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Allocated Hostel & Block</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#277f60' }}>
            {student.assignedHostel || 'Mango House'} (Block B)
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Room & Floor</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#181818' }}>
            Room {student.room || 'B-214'} · 2nd Floor (Double)
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Bursary Receipt Reference</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', fontFamily: 'var(--app-font-mono)' }}>
            {receipt?.referenceNo || 'RRR-2608-9941-1048'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Amount Cleared</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#181818', fontVariantNumeric: 'tabular-nums' }}>
            {formatNaira(receipt?.amountPaid || 185000)} (Full Tariff)
          </div>
        </div>
      </div>

      {/* QR Code & Hall Warden Instructions */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: 12,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            background: '#fff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <QrCode size={56} color="#0f172a" />
        </div>

        <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.45 }}>
          <strong>Hall Warden Instructions:</strong> Scan this encrypted QR code at Block B porter lodge to collect your keys and room inventory checklist. Move-in window opens Sept 8, 2026.
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. ADMIN PORTAL: BURSARY PAYMENT VERIFICATION DESK
// ----------------------------------------------------------------------
export function AdminPayments({
  receipts,
  setReceipts,
  requests,
  setRequests,
  onToast,
  onAddNotification,
}: {
  receipts: PaymentReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<PaymentReceipt[]>>;
  requests?: AllocationRequest[];
  setRequests?: React.Dispatch<React.SetStateAction<AllocationRequest[]>>;
  onToast: (message: string) => void;
  onAddNotification?: (notif: AppNotification) => void;
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentReceiptStatus>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [inspectingReceipt, setInspectingReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectModalReceipt, setRejectModalReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Tariff discrepancy: Amount paid is less than the required room fee.');
  const [customRejectNotes, setCustomRejectNotes] = useState('');

  // Metrics
  const stats = useMemo(() => {
    const total = receipts.length;
    const pending = receipts.filter((r) => r.status === 'Pending').length;
    const approved = receipts.filter((r) => r.status === 'Approved').length;
    const rejected = receipts.filter((r) => r.status === 'Rejected').length;
    const totalFunds = receipts
      .filter((r) => r.status === 'Approved')
      .reduce((sum, r) => sum + r.amountPaid, 0);

    return { total, pending, approved, rejected, totalFunds };
  }, [receipts]);

  // Filtered List
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchesQuery =
        r.studentName.toLowerCase().includes(query.toLowerCase()) ||
        r.regNo.toLowerCase().includes(query.toLowerCase()) ||
        r.referenceNo.toLowerCase().includes(query.toLowerCase()) ||
        r.hostelName.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesChannel = channelFilter === 'All' || r.paymentChannel === channelFilter;

      return matchesQuery && matchesStatus && matchesChannel;
    });
  }, [receipts, query, statusFilter, channelFilter]);

  // 1-Click Approve
  const handleApprove = (receipt: PaymentReceipt) => {
    const updatedReceipt: PaymentReceipt = {
      ...receipt,
      status: 'Approved',
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifiedBy: 'Bursar G. Adeleke (Campus Finance)',
      adminNotes: 'Verified and approved via Bursary Desk.',
    };

    setReceipts((prev) => prev.map((r) => (r.id === receipt.id ? updatedReceipt : r)));

    // Synchronize allocation requests if applicable
    if (setRequests) {
      setRequests((prev) =>
        prev.map((req) =>
          req.student.regNo === receipt.regNo
            ? { ...req, student: { ...req.student, paymentStatus: 'Cleared' } }
            : req
        )
      );
    }

    // Dispatch Notification to Student
    if (onAddNotification) {
      onAddNotification({
        id: `notif-${Date.now()}`,
        recipientRegNo: receipt.regNo,
        title: '🎉 Payment Verified & Cleared!',
        message: `Your hostel accommodation payment of ${formatNaira(receipt.amountPaid)} (${receipt.referenceNo}) was approved by the University Bursary. Your digital room check-in pass is now active!`,
        type: 'payment_approved',
        read: false,
        timestamp: 'Just now',
        actionUrl: '/student/payments',
      });
    }

    onToast(`Receipt ${receipt.referenceNo} for ${receipt.studentName} approved. Student notified via panel.`);
    if (inspectingReceipt?.id === receipt.id) {
      setInspectingReceipt(null);
    }
  };

  // Confirm Reject
  const handleConfirmReject = () => {
    if (!rejectModalReceipt) return;

    const updatedReceipt: PaymentReceipt = {
      ...rejectModalReceipt,
      status: 'Rejected',
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedBy: 'Bursar G. Adeleke (Campus Finance)',
      rejectionReason,
      adminNotes: customRejectNotes || undefined,
    };

    setReceipts((prev) => prev.map((r) => (r.id === rejectModalReceipt.id ? updatedReceipt : r)));

    // Dispatch Notification to Student
    if (onAddNotification) {
      onAddNotification({
        id: `notif-${Date.now()}`,
        recipientRegNo: rejectModalReceipt.regNo,
        title: '⚠️ Payment Receipt Rejected',
        message: `Your payment receipt (${rejectModalReceipt.referenceNo}) requires revision: ${rejectionReason}. Please check your payment desk to resubmit.`,
        type: 'payment_rejected',
        read: false,
        timestamp: 'Just now',
        actionUrl: '/student/payments',
      });
    }

    onToast(`Payment verification for ${rejectModalReceipt.studentName} marked as rejected with notes sent.`);
    setRejectModalReceipt(null);
    if (inspectingReceipt?.id === rejectModalReceipt.id) {
      setInspectingReceipt(null);
    }
  };

  // Batch Clear All Pending
  const handleBatchApprovePending = () => {
    const pendingList = receipts.filter((r) => r.status === 'Pending');
    if (pendingList.length === 0) {
      onToast('No pending receipts to verify.');
      return;
    }

    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setReceipts((prev) =>
      prev.map((r) =>
        r.status === 'Pending'
          ? {
              ...r,
              status: 'Approved',
              verifiedAt: timestamp,
              verifiedBy: 'Bursar G. Adeleke (Batch Reconciliation)',
            }
          : r
      )
    );

    // Notify all students
    if (onAddNotification) {
      pendingList.forEach((rec, idx) => {
        setTimeout(() => {
          onAddNotification({
            id: `notif-${Date.now()}-${idx}`,
            recipientRegNo: rec.regNo,
            title: 'Payment Cleared (Batch Reconciliation)',
            message: `Your payment receipt (${rec.referenceNo}) has been verified and cleared by the University Bursary.`,
            type: 'payment_approved',
            read: false,
            timestamp: 'Just now',
            actionUrl: '/student/payments',
          });
        }, idx * 40);
      });
    }

    onToast(`Batch approved ${pendingList.length} pending receipts. All students notified.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner */}
      <div
        className="card card-pad reveal"
        style={{
          background: 'linear-gradient(135deg, #fbfcfe 0%, #f1f5f9 100%)',
          border: '1px solid #cbd5e1',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="eyebrow" style={{ color: '#0284c7' }}>Bursary & Audit Operations</div>
            <h2 style={{ fontSize: 22, margin: '6px 0 8px', letterSpacing: '-0.02em', color: '#0f172a' }}>
              Payment Clearance & Receipt Verification Desk
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0, maxWidth: 680 }}>
              Verify student Remita retrieval reference (RRR) codes and bank deposit slips against the central Treasury Single Account (TSA) ledger before confirming hostel bed-space allocation passes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-dark btn-sm"
              onClick={handleBatchApprovePending}
              data-testid="button-batch-approve"
            >
              <Check size={14} />
              <span>Batch Clear Pending ({stats.pending})</span>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onToast('Exported Bursary Reconciliation Ledger (CSV).')}
              style={{ background: '#fff', border: '1px solid #cbd5e1' }}
            >
              <Download size={13} />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="four-col reveal delay-1">
        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="eyebrow">Total Submissions</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', color: '#0f172a' }}>{stats.total}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Receipts logged this session</div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="eyebrow" style={{ color: '#b26829' }}>Pending Verification</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', color: '#b26829' }}>{stats.pending}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Awaiting bursary audit</div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="eyebrow" style={{ color: '#277f60' }}>Verified Funds Cleared</div>
          <div style={{ fontSize: 22, fontWeight: 800, margin: '6px 0 2px', color: '#277f60', fontVariantNumeric: 'tabular-nums' }}>
            {formatNaira(stats.totalFunds)}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{stats.approved} approved accounts</div>
        </div>

        <div className="card card-pad" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="eyebrow" style={{ color: '#b91c1c' }}>Flagged / Rejected</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px', color: '#b91c1c' }}>{stats.rejected}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Discrepancies / partial tariffs</div>
        </div>
      </div>

      {/* Verification Queue & Filters */}
      <div className="card card-pad reveal delay-2" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                className="input"
                style={{ paddingLeft: 32, height: 36, fontSize: 12 }}
                placeholder="Search by student name, Matric/Reg No, RRR reference, or hostel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="input-admin-search-receipts"
              />
            </div>
          </div>

          {/* Status & Channel Filters */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              className="input"
              style={{ height: 36, fontSize: 12, width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              data-testid="select-filter-status"
            >
              <option value="All">All Statuses ({stats.total})</option>
              <option value="Pending">Pending Audit ({stats.pending})</option>
              <option value="Approved">Verified & Cleared ({stats.approved})</option>
              <option value="Rejected">Rejected ({stats.rejected})</option>
            </select>

            <select
              className="input"
              style={{ height: 36, fontSize: 12, width: 'auto' }}
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="All">All Channels</option>
              <option value="School Portal (Remita RRR)">School Portal (Remita)</option>
              <option value="Direct Bank Deposit">Direct Bank Deposit</option>
              <option value="Interswitch / WebPay">Interswitch WebPay</option>
            </select>
          </div>
        </div>

        {/* Receipts Table */}
        <div className="table-wrap">
          <table className="data-table" data-testid="table-admin-receipts">
            <thead>
              <tr>
                <th>Student & Matric</th>
                <th>Reference / RRR</th>
                <th>Channel & Date</th>
                <th>Hostel & Room</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((rec) => {
                const hasDiscrepancy = rec.amountPaid < rec.expectedAmount;

                return (
                  <tr key={rec.id} data-testid={`row-receipt-${rec.id}`}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{rec.studentName}</div>
                      <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--app-font-mono)' }}>
                        {rec.regNo} · {rec.department}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontFamily: 'var(--app-font-mono)', fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                        {rec.referenceNo}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>
                        {rec.receiptFileName}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: 11, color: '#1e293b' }}>{rec.paymentChannel}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{rec.paymentDate}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{rec.roomNumber}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{rec.hostelName}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: hasDiscrepancy ? '#b91c1c' : '#0f172a' }}>
                        {formatNaira(rec.amountPaid)}
                      </div>
                      {hasDiscrepancy && (
                        <div style={{ fontSize: 9, color: '#b91c1c', fontWeight: 600 }}>
                          Expected {formatNaira(rec.expectedAmount)}
                        </div>
                      )}
                    </td>

                    <td>
                      <span
                        className={`tag ${
                          rec.status === 'Approved'
                            ? 'sage'
                            : rec.status === 'Pending'
                            ? 'sand'
                            : 'peach'
                        }`}
                      >
                        {rec.status === 'Approved' ? 'Cleared' : rec.status === 'Pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ height: 28, padding: '0 8px', fontSize: 11 }}
                          onClick={() => setInspectingReceipt(rec)}
                          data-testid={`btn-inspect-${rec.id}`}
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>

                        {rec.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-dark btn-sm"
                              style={{ height: 28, padding: '0 8px', fontSize: 11, background: '#166534' }}
                              onClick={() => handleApprove(rec)}
                              data-testid={`btn-approve-${rec.id}`}
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>

                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ height: 28, padding: '0 8px', fontSize: 11, color: '#b91c1c' }}
                              onClick={() => {
                                setRejectModalReceipt(rec);
                                setRejectionReason(
                                  hasDiscrepancy
                                    ? `Tariff discrepancy: Double room rate is ${formatNaira(rec.expectedAmount)}, submitted payment is ${formatNaira(rec.amountPaid)}.`
                                    : 'Invalid or unmatched RRR number on central Remita ledger.'
                                );
                              }}
                              data-testid={`btn-reject-${rec.id}`}
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Inspector Drawer / Modal */}
      {inspectingReceipt && (
        <ReceiptInspectionModal
          receipt={inspectingReceipt}
          isAdmin
          onClose={() => setInspectingReceipt(null)}
          onApprove={() => handleApprove(inspectingReceipt)}
          onReject={() => {
            setRejectModalReceipt(inspectingReceipt);
            setRejectionReason('Invalid or unmatched RRR number on central Remita ledger.');
          }}
        />
      )}

      {/* Reject Reason Modal */}
      {rejectModalReceipt && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div>
                <div className="eyebrow" style={{ color: '#b91c1c' }}>Bursary Audit Action</div>
                <h2>Reject Payment Receipt</h2>
                <p>Specify the rejection reason. A notification will be sent to the student's portal with guidance.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setRejectModalReceipt(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <div>
                <label className="field-label">Rejection Reason *</label>
                <select
                  className="input"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  <option value="Tariff discrepancy: Amount paid is less than the required room fee.">
                    Tariff discrepancy: Partial payment / less than room fee
                  </option>
                  <option value="Invalid or unmatched RRR number on central Remita ledger.">
                    Invalid / Unmatched RRR Reference
                  </option>
                  <option value="Receipt image/document is unreadable or heavily blurred.">
                    Receipt image unreadable or cropped
                  </option>
                  <option value="Duplicate payment submission already processed for another room.">
                    Duplicate transaction reference
                  </option>
                  <option value="Payment belongs to a prior academic session.">
                    Expired academic session payment
                  </option>
                </select>
              </div>

              <div>
                <label className="field-label">Specific Instructions to Student</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="e.g. Please log in to student portal and make a top-up payment of ₦65,000 to clear your tariff."
                  value={customRejectNotes}
                  onChange={(e) => setCustomRejectNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setRejectModalReceipt(null)}>
                Cancel
              </button>
              <button
                className="btn btn-dark"
                style={{ background: '#b91c1c' }}
                onClick={handleConfirmReject}
                data-testid="button-confirm-reject-receipt"
              >
                Confirm Rejection & Dispatch Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. SHARED RECEIPT INSPECTION MODAL
// ----------------------------------------------------------------------
function ReceiptInspectionModal({
  receipt,
  isAdmin = false,
  onClose,
  onApprove,
  onReject,
}: {
  receipt: PaymentReceipt;
  isAdmin?: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 640, padding: 24 }}>
        <div className="modal-head" style={{ marginBottom: 14 }}>
          <div>
            <div className="eyebrow" style={{ color: '#b26829' }}>Official Payment Receipt Preview</div>
            <h2 style={{ fontSize: 18 }}>{receipt.referenceNo}</h2>
            <p style={{ margin: 0, fontSize: 11, color: '#68707c' }}>
              Submitted by {receipt.studentName} ({receipt.regNo}) on {receipt.submittedAt}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* High-Fidelity Simulated E-Receipt Visual Box */}
        <div
          style={{
            background: '#fafbfc',
            borderRadius: 12,
            border: '1px solid #cbd5e1',
            padding: 20,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Receipt Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
                CENTRAL UNIVERSITY OF TECHNOLOGY
              </div>
              <div style={{ fontSize: 9, color: '#64748b' }}>
                Bursary Department · Student Accommodation E-Receipt
              </div>
            </div>

            <span
              className={`tag ${
                receipt.status === 'Approved'
                  ? 'sage'
                  : receipt.status === 'Pending'
                  ? 'sand'
                  : 'peach'
              }`}
            >
              {receipt.status}
            </span>
          </div>

          {/* Receipt Key-Value Rows */}
          <div className="form-grid" style={{ gap: 10, fontSize: 11 }}>
            <div>
              <span style={{ color: '#64748b' }}>Payer Name:</span>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{receipt.payerName || receipt.studentName}</div>
            </div>

            <div>
              <span style={{ color: '#64748b' }}>Matric / Reg No:</span>
              <div style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'var(--app-font-mono)' }}>{receipt.regNo}</div>
            </div>

            <div>
              <span style={{ color: '#64748b' }}>Payment Channel:</span>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{receipt.paymentChannel}</div>
            </div>

            <div>
              <span style={{ color: '#64748b' }}>Transaction Reference / RRR:</span>
              <div style={{ fontWeight: 700, color: '#0284c7', fontFamily: 'var(--app-font-mono)' }}>{receipt.referenceNo}</div>
            </div>

            <div>
              <span style={{ color: '#64748b' }}>Payment Date:</span>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{receipt.paymentDate}</div>
            </div>

            <div>
              <span style={{ color: '#64748b' }}>Allocated Room & Hostel:</span>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{receipt.roomNumber} ({receipt.hostelName})</div>
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#f1f5f9', padding: '10px 12px', borderRadius: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Amount Paid</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                  {formatNaira(receipt.amountPaid)}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: '#64748b' }}>
                <div>Session: {receipt.session}</div>
                <div>Status: {receipt.status === 'Approved' ? 'Verified in TSA' : 'Pending Bank Clearance'}</div>
              </div>
            </div>
          </div>

          {/* Audit Trail info */}
          {receipt.verifiedBy && (
            <div style={{ marginTop: 12, padding: '6px 10px', background: '#f0fdf4', borderRadius: 6, fontSize: 10, color: '#166534' }}>
              <strong>Verified By:</strong> {receipt.verifiedBy} ({receipt.verifiedAt})
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions" style={{ marginTop: 18 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close Preview
          </button>

          {isAdmin && receipt.status === 'Pending' && (
            <>
              {onReject && (
                <button className="btn btn-ghost" style={{ color: '#b91c1c' }} onClick={onReject}>
                  Reject
                </button>
              )}
              {onApprove && (
                <button className="btn btn-dark" style={{ background: '#166534' }} onClick={onApprove}>
                  <Check size={14} />
                  <span>Verify & Clear Student</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
