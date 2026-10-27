import fs from 'fs';
import path from 'path';

export interface CRMRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentRoll?: string;
  semester: string;
  subject: string;
  examYear: string;
  requestType: 'MISSING_PAPER' | 'SYLLABUS_QUERY' | 'CORRECTION' | 'GENERAL';
  message: string;
  status: 'NEW' | 'IN_REVIEW' | 'FULFILLED' | 'REJECTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMEventLog {
  id: string;
  type: 'VIEW' | 'DOWNLOAD' | 'UPLOAD' | 'STATUS_CHANGE' | 'REQUEST_CREATED';
  details: string;
  timestamp: string;
}

export interface CRMDataStore {
  requests: CRMRequest[];
  analytics: {
    totalDownloads: number;
    totalViews: number;
    paperDownloads: Record<string, number>;
    subjectDownloads: Record<string, number>;
  };
  eventLogs: CRMEventLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CRM_FILE = path.join(DATA_DIR, 'crm.json');

// Default initial data for realistic departmental CRM workflow
const INITIAL_DATA: CRMDataStore = {
  requests: [
    {
      id: 'REQ-2026-101',
      studentName: 'Rahul Sharma',
      studentEmail: 'rahul.s@univ.edu.in',
      studentRoll: '22BCA041',
      semester: 'Semester 1st',
      subject: 'CC-1 Programming in C',
      examYear: '2023',
      requestType: 'MISSING_PAPER',
      message: 'Looking for 2023 Semester 1st Programming in C end-term question paper. Sem 1 folder is currently empty.',
      status: 'NEW',
      priority: 'HIGH',
      adminNotes: 'Contacting examination branch archives to digitize Sem 1 physical papers.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'REQ-2026-102',
      studentName: 'Pooja Verma',
      studentEmail: 'pooja.verma@univ.edu.in',
      studentRoll: '21BCA019',
      semester: 'Semester 5th',
      subject: 'CC-11 Data Structures',
      examYear: '2025',
      requestType: 'SYLLABUS_QUERY',
      message: 'Does CC-11 2025 question paper include red-black trees in Section C? Please verify module 4 coverage.',
      status: 'IN_REVIEW',
      priority: 'MEDIUM',
      adminNotes: 'Verified with faculty: Module 4 syllabus covers AVL and Red-Black trees.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'REQ-2026-103',
      studentName: 'Amit Patel',
      studentEmail: 'amit.patel@student.ac.in',
      studentRoll: '23BCA088',
      semester: 'Semester 4th',
      subject: 'CC-8 Computer Networks',
      examYear: '2025',
      requestType: 'CORRECTION',
      message: 'There are two papers uploaded for 2025 (Set 1 and Main). Could you clarify which one is the regular batch?',
      status: 'FULFILLED',
      priority: 'LOW',
      adminNotes: 'Updated paper tags to clearly designate Regular Session and Supplementary Session.',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ],
  analytics: {
    totalDownloads: 48,
    totalViews: 132,
    paperDownloads: {
      'Semester 3rd/CC-5 Python Programming/2024.pdf': 14,
      'Semester 5th/CC-11 Data Structures/CC-11 2024.pdf': 18,
      'Semester 4th/CC-8 Computer Networks/CC-8 2024.pdf': 16,
    },
    subjectDownloads: {
      'CC-5 Python Programming': 14,
      'CC-11 Data Structures': 18,
      'CC-8 Computer Networks': 16,
    },
  },
  eventLogs: [
    {
      id: 'LOG-001',
      type: 'REQUEST_CREATED',
      details: 'Student Rahul Sharma submitted paper request for CC-1 Programming in C (REQ-2026-101)',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'LOG-002',
      type: 'STATUS_CHANGE',
      details: 'Ticket REQ-2026-103 marked as FULFILLED',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ],
};

function ensureDataFile(): CRMDataStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(CRM_FILE)) {
    fs.writeFileSync(CRM_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }

  try {
    const raw = fs.readFileSync(CRM_FILE, 'utf-8');
    return JSON.parse(raw) as CRMDataStore;
  } catch (error) {
    console.error('Error reading CRM data file, resetting to initial store:', error);
    fs.writeFileSync(CRM_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
}

function saveData(data: CRMDataStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${CRM_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, CRM_FILE);
}

export function getAllCRMRequests(): CRMRequest[] {
  const data = ensureDataFile();
  return [...data.requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCRMRequestById(id: string): CRMRequest | null {
  const data = ensureDataFile();
  return data.requests.find((r) => r.id === id) || null;
}

export function createCRMRequest(input: {
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentRoll?: string;
  semester: string;
  subject: string;
  examYear: string;
  requestType: CRMRequest['requestType'];
  message: string;
}): CRMRequest {
  const data = ensureDataFile();
  const id = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newRequest: CRMRequest = {
    id,
    studentName: input.studentName.trim(),
    studentEmail: input.studentEmail.trim(),
    studentPhone: input.studentPhone?.trim() || '',
    studentRoll: input.studentRoll?.trim() || '',
    semester: input.semester.trim(),
    subject: input.subject.trim(),
    examYear: input.examYear.trim(),
    requestType: input.requestType,
    message: input.message.trim(),
    status: 'NEW',
    priority: input.requestType === 'MISSING_PAPER' ? 'HIGH' : 'MEDIUM',
    adminNotes: '',
    createdAt: now,
    updatedAt: now,
  };

  data.requests.unshift(newRequest);
  data.eventLogs.unshift({
    id: `LOG-${Date.now()}`,
    type: 'REQUEST_CREATED',
    details: `New ticket ${id} created by ${newRequest.studentName} (${newRequest.subject})`,
    timestamp: now,
  });

  saveData(data);
  return newRequest;
}

export function updateCRMRequest(
  id: string,
  updates: Partial<Pick<CRMRequest, 'status' | 'priority' | 'adminNotes'>>
): CRMRequest | null {
  const data = ensureDataFile();
  const index = data.requests.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = data.requests[index];
  const updated: CRMRequest = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  data.requests[index] = updated;
  data.eventLogs.unshift({
    id: `LOG-${Date.now()}`,
    type: 'STATUS_CHANGE',
    details: `Ticket ${id} status updated to ${updated.status} (Priority: ${updated.priority})`,
    timestamp: updated.updatedAt,
  });

  saveData(data);
  return updated;
}

export function deleteCRMRequest(id: string): boolean {
  const data = ensureDataFile();
  const initialLen = data.requests.length;
  data.requests = data.requests.filter((r) => r.id !== id);

  if (data.requests.length !== initialLen) {
    saveData(data);
    return true;
  }
  return false;
}

export function recordDownload(paperRelPath: string, subjectName: string): void {
  try {
    const data = ensureDataFile();
    data.analytics.totalDownloads += 1;
    data.analytics.paperDownloads[paperRelPath] = (data.analytics.paperDownloads[paperRelPath] || 0) + 1;
    data.analytics.subjectDownloads[subjectName] = (data.analytics.subjectDownloads[subjectName] || 0) + 1;
    data.eventLogs.unshift({
      id: `LOG-${Date.now()}`,
      type: 'DOWNLOAD',
      details: `Paper downloaded: ${path.basename(paperRelPath)} (${subjectName})`,
      timestamp: new Date().toISOString(),
    });
    // Keep logs bounded to last 200 items
    if (data.eventLogs.length > 200) data.eventLogs = data.eventLogs.slice(0, 200);
    saveData(data);
  } catch (err) {
    console.error('Failed to log download:', err);
  }
}

export function recordView(paperRelPath: string, subjectName: string): void {
  try {
    const data = ensureDataFile();
    data.analytics.totalViews += 1;
    saveData(data);
  } catch (err) {
    console.error('Failed to log view:', err);
  }
}

export function getCRMAnalytics() {
  const data = ensureDataFile();
  const total = data.requests.length;
  const newCount = data.requests.filter((r) => r.status === 'NEW').length;
  const inReview = data.requests.filter((r) => r.status === 'IN_REVIEW').length;
  const fulfilled = data.requests.filter((r) => r.status === 'FULFILLED').length;
  const closed = data.requests.filter((r) => r.status === 'CLOSED').length;

  return {
    requests: {
      total,
      newCount,
      inReview,
      fulfilled,
      closed,
    },
    analytics: data.analytics,
    recentEvents: data.eventLogs.slice(0, 25),
  };
}

export async function uploadQuestionPaper(params: {
  semester: string;
  subjectFolderName: string;
  fileName: string;
  buffer: Buffer;
}): Promise<{ success: boolean; filePath: string }> {
  const rootDir = path.resolve(process.cwd(), 'Previous Year Question');
  const safeSem = path.basename(params.semester);
  const safeSub = path.basename(params.subjectFolderName);
  const safeFileName = path.basename(params.fileName);

  const targetDir = path.join(rootDir, safeSem, safeSub);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, safeFileName);
  fs.writeFileSync(targetFile, params.buffer);

  // Log in CRM event logs
  const data = ensureDataFile();
  data.eventLogs.unshift({
    id: `LOG-${Date.now()}`,
    type: 'UPLOAD',
    details: `Admin uploaded new paper ${safeFileName} to ${safeSem}/${safeSub}`,
    timestamp: new Date().toISOString(),
  });
  saveData(data);

  return { success: true, filePath: `${safeSem}/${safeSub}/${safeFileName}` };
}
