'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Lock,
  Layers,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { CRMRequest } from '@/lib/crm-service';

export default function AdminCRMPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'requests' | 'upload' | 'analytics'>('requests');
  const [requests, setRequests] = useState<CRMRequest[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected request for editing
  const [editingRequest, setEditingRequest] = useState<CRMRequest | null>(null);
  const [newStatus, setNewStatus] = useState<CRMRequest['status']>('NEW');
  const [newPriority, setNewPriority] = useState<CRMRequest['priority']>('MEDIUM');
  const [adminNotes, setAdminNotes] = useState('');

  // Upload Paper Form State
  const [uploadSemester, setUploadSemester] = useState('Semester 1st');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Check stored auth
  useEffect(() => {
    const token = sessionStorage.getItem('crm_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/crm/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('crm_admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || 'Invalid passcode.');
      }
    } catch {
      setAuthError('Authentication network error.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('crm_admin_token');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, anaRes] = await Promise.all([
        fetch('/api/crm/requests'),
        fetch('/api/crm/analytics'),
      ]);
      if (reqRes.ok) {
        const d = await reqRes.json();
        setRequests(d.requests || []);
      }
      if (anaRes.ok) {
        const a = await anaRes.json();
        setAnalytics(a);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = async () => {
    if (!editingRequest) return;
    try {
      const res = await fetch(`/api/crm/requests/${editingRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          priority: newPriority,
          adminNotes,
        }),
      });
      if (res.ok) {
        setEditingRequest(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Delete inquiry ticket ${id}?`)) return;
    try {
      const res = await fetch(`/api/crm/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete request:', err);
    }
  };

  const handlePaperUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadSubject) return;

    setUploadStatus({ type: 'loading', message: 'Uploading document to archive...' });
    const formData = new FormData();
    formData.append('semester', uploadSemester);
    formData.append('subject', uploadSubject);
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/crm/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus({ type: 'success', message: data.message });
        setUploadSubject('');
        setUploadFile(null);
        fetchData();
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Upload failed.' });
      }
    } catch {
      setUploadStatus({ type: 'error', message: 'Network error during upload.' });
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.studentName.toLowerCase().includes(q) ||
        r.studentEmail.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Login view
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem auto', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={24} strokeWidth={2.2} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Examination Helpdesk Admin
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Department of Computer Applications and IT
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {authError && (
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                {authError}
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                Administrator Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (Default: admin123)"
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.875rem' }}
              />
            </div>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '0.875rem' }}
            >
              Sign In to CRM Console
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Public Repository</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Admin Header */}
      <header style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Department CRM & Paper Ingestion Desk
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                University Examination Archive Management
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/" className="modal-btn" style={{ fontSize: '0.8125rem' }}>
              <ArrowLeft size={14} />
              <span>Public Portal</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="modal-btn"
              style={{ fontSize: '0.8125rem', color: '#b91c1c' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main CRM Body */}
      <main className="container" style={{ flex: 1, padding: '1.5rem 1rem 3rem 1rem' }}>
        {/* Metric Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="metric-card">
            <div className="metric-icon-wrap">
              <FileText size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="metric-val">{analytics?.requests?.total || requests.length}</div>
              <div className="metric-lbl">Total Student Requests</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ color: '#d97706', backgroundColor: '#fffbeb' }}>
              <Clock size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="metric-val">{analytics?.requests?.newCount || 0}</div>
              <div className="metric-lbl">New / Pending Review</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ color: '#16a34a', backgroundColor: '#f0fdf4' }}>
              <CheckCircle size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="metric-val">{analytics?.requests?.fulfilled || 0}</div>
              <div className="metric-lbl">Fulfilled / Digitized</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-subtle)' }}>
              <Download size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="metric-val">{analytics?.analytics?.totalDownloads || 0}</div>
              <div className="metric-lbl">Total Paper Downloads</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '0.625rem 1rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: activeTab === 'requests' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'requests' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Student Requests Pipeline ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '0.625rem 1rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: activeTab === 'upload' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'upload' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Upload New Paper to Archive
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '0.625rem 1rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: activeTab === 'analytics' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'analytics' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Activity Logs & Downloads
          </button>
        </div>

        {/* TAB 1: REQUESTS PIPELINE */}
        {activeTab === 'requests' && (
          <div>
            {/* Filter toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student, email, subject, or Ticket ID..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8125rem',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="FULFILLED">Fulfilled</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8125rem',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                <button
                  type="button"
                  onClick={fetchData}
                  className="modal-btn"
                  title="Refresh"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No requests match the selected filters.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredRequests.map((req) => {
                  let statusBadgeStyle = { backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' };
                  if (req.status === 'NEW') statusBadgeStyle = { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
                  if (req.status === 'FULFILLED') statusBadgeStyle = { backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' };
                  if (req.status === 'CLOSED') statusBadgeStyle = { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };

                  return (
                    <div
                      key={req.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                            {req.id}
                          </span>
                          <span style={{ ...statusBadgeStyle, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700 }}>
                            {req.status}
                          </span>
                          <span style={{ padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 600 }}>
                            Priority: {req.priority}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                          {req.subject}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          ({req.semester} | Year: {req.examYear})
                        </span>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5, backgroundColor: 'var(--bg-subtle)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        &ldquo;{req.message}&rdquo;
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <div>
                          Requested by: <strong>{req.studentName}</strong> ({req.studentEmail}) {req.studentRoll ? `| Roll: ${req.studentRoll}` : ''}
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button
                            type="button"
                            className="modal-btn"
                            onClick={() => {
                              setEditingRequest(req);
                              setNewStatus(req.status);
                              setNewPriority(req.priority);
                              setAdminNotes(req.adminNotes || '');
                            }}
                          >
                            Update Ticket
                          </button>
                          <button
                            type="button"
                            className="modal-btn"
                            onClick={() => handleDeleteRequest(req.id)}
                            style={{ color: '#b91c1c' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {req.adminNotes && (
                        <div style={{ marginTop: '0.625rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8125rem', color: '#166534', backgroundColor: '#f0fdf4', padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-sm)' }}>
                          <strong>Admin Resolution Notes:</strong> {req.adminNotes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD PAPER */}
        {activeTab === 'upload' && (
          <div style={{ maxWidth: '640px', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
              Direct Question Paper Ingestion
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Upload digitized examination question papers directly into the server directory. The paper will immediately become accessible to students for viewing and download.
            </p>

            {uploadStatus.message && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                  backgroundColor: uploadStatus.type === 'success' ? '#f0fdf4' : uploadStatus.type === 'error' ? '#fef2f2' : '#eff6ff',
                  color: uploadStatus.type === 'success' ? '#166534' : uploadStatus.type === 'error' ? '#991b1b' : '#1e40af',
                  border: `1px solid ${uploadStatus.type === 'success' ? '#bbf7d0' : uploadStatus.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
                }}
              >
                {uploadStatus.message}
              </div>
            )}

            <form onSubmit={handlePaperUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  Semester Target Folder *
                </label>
                <select
                  value={uploadSemester}
                  onChange={(e) => setUploadSemester(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.875rem' }}
                >
                  <option value="Semester 1st">Semester 1st (New Ingestion)</option>
                  <option value="Semester 2nd">Semester 2nd (New Ingestion)</option>
                  <option value="Semester 3rd">Semester 3rd</option>
                  <option value="Semester 4th">Semester 4th</option>
                  <option value="Semester 5th">Semester 5th</option>
                  <option value="Semester 6th">Semester 6th</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  Subject Folder Name (e.g. CC-1 Programming in C) *
                </label>
                <input
                  type="text"
                  required
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder="e.g. CC-1 Programming in C or CC-5 Python Programming"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  PDF Question Paper File *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={uploadStatus.type === 'loading'}
                  className="modal-btn modal-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Upload size={14} />
                  <span>{uploadStatus.type === 'loading' ? 'Ingesting PDF...' : 'Ingest and Publish Paper'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ANALYTICS & EVENT LOGS */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Real-Time Paper Activity & CRM Telemetry
            </h2>

            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Top Downloaded Question Papers by Students
              </h3>
              {analytics?.analytics?.paperDownloads && Object.keys(analytics.analytics.paperDownloads).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(analytics.analytics.paperDownloads).map(([p, count]) => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 600 }}>{p}</span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{count as number} downloads</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No paper download telemetry recorded yet.</p>
              )}
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Audit & Event Trail
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {analytics?.recentEvents?.map((ev: any) => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.375rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                        {ev.type}
                      </span>
                      <span>{ev.details}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Request Modal */}
        {editingRequest && (
          <div className="modal-backdrop" onClick={() => setEditingRequest(null)}>
            <div className="modal-content-window" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-group">
                  <h3 className="modal-paper-title">Manage Ticket {editingRequest.id}</h3>
                  <div className="modal-paper-sub">{editingRequest.studentName} ({editingRequest.studentEmail})</div>
                </div>
                <button type="button" className="modal-btn-close" onClick={() => setEditingRequest(null)}>
                  ×
                </button>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CRMRequest['status'])}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="NEW">New</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="FULFILLED">Fulfilled</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CRMRequest['priority'])}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Admin Resolution / Action Notes
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Scanned and published to Semester 1st archive."
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" className="modal-btn" onClick={() => setEditingRequest(null)}>
                    Cancel
                  </button>
                  <button type="button" className="modal-btn modal-btn-primary" onClick={handleSaveRequest}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">Department of Computer Applications | University Examination Archive</div>
          <div>
            <a href="https://atulsah.in" target="_blank" rel="noopener noreferrer">
              Developed by Atul Sah
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
