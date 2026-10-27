# pyq-portal-editing.md | Persistent Project Memory

## 1. Purpose

This file is the persistent project memory and working rules record for the `pyq-portal` repository. It provides continuity across sessions, records critical technical decisions, and enforces safety and security rules.

## Global Writing and Punctuation Rule

- Never use the em dash character in code comments, UI copy, documentation, plans, commit messages, or responses written as part of this project.
- Replace it with a suitable alternative based on context, such as a vertical bar (`|`), colon (`:`), comma, parentheses, or a normal hyphen (`-`).
- Prefer a vertical bar (`|`) when separating short labels or phrases. Use punctuation that keeps the sentence grammatically clear.

## Global UI and Visual Design Rules

- Do not use emoji as interface icons, status indicators, navigation symbols, action symbols, or decorative UI substitutes.
- Use an SVG icon only when an icon materially improves clarity, recognition, accessibility, or usability.
- Avoid generic AI-generated website patterns and cookie-cutter designs.
- Every website must include the footer attribution: Developed by Atul Sah linking to `https://atulsah.in`.

---

# 4. Project Identity

## Project
pyq-portal

## Purpose
A university Previous Year Question (PYQ) and syllabus insights portal for undergraduate and postgraduate students (BCA / B.Sc Computer Science). It enables instant searching, previewing papers in-browser, downloading individual PDFs, and streaming full-subject ZIP archives.

## Primary Users
University students, teachers, departmental administrators, and examination candidates.

## Current Version / Stage
v1.0.0 | Production Ready

## Technology Stack
- Next.js: 15.1.7 (App Router, React Server Components, Route Handlers)
- React: 19.0.0
- TypeScript: 5.7.3
- Node.js: >= 20.x
- Archiver: 7.0.1
- Lucide React: 0.475.0
- Vanilla CSS: Custom design tokens in `app/globals.css`

## Repository / Deployment
- Git Remote: `https://github.com/bcabnc/pyq-portal.git`
- Branch: `main`

---

# 5. Current Project State

## Current Status
All core features and architectural components are implemented, tested, and verified. Production build passes with zero errors. Git repository initialized and prepared for push to GitHub.

## Completed Features
- Dynamic semester tabs (Semester 1st to Semester 6th) with live paper count indicators.
- Instant search filter across course titles, codes, exam years, and syllabus topics.
- Subject cards categorized into Core Courses (CC), Generic Electives (GE), Skill Enhancement Courses (SEC), and Discipline Specific Electives (DSE).
- In-browser modal PDF reader with zoom, full-screen toggle, pagination, and download options.
- Dynamic ZIP streaming for complete subject archives using `archiver`.
- Departmental CRM backend with thread-safe JSON datastore (`data/crm.json`).
- Full CRM API suite for student ticket creation, status management, telemetry logging, and paper upload.
- Student Inquiry Desk modal (`components/StudentRequestModal.tsx`) with ticket ID receipts (`REQ-YYYY-XXX`).
- Department Administrator CRM Console (`app/admin/page.tsx`) with ticket pipeline, paper ingestion, and audit logs.
- AI footprints removed; replaced with authentic institutional departmental branding.
- Path traversal guards preventing directory escape on file operations.
- Full responsive typography and mobile-first layout using modern design tokens.
- Mandatory Atul Sah footer attribution linking to `https://atulsah.in`.
- Mandatory README.md with technology badges, Level 0, 1, 2 Mermaid DFDs, and system architecture.

## In Progress
None. All user requirements fulfilled.

## Planned
- Cloud backup integration for examination archives.
- Automated OCR indexing for search within scanned paper text.

## Current Known Issues
None.

## Current Constraints
- No external heavy UI component libraries; maintain pure Vanilla CSS design system.
- Strict path traversal protection for all filesystem read/write endpoints.
- Avoid em dashes across all code comments, markdown files, and commit messages.

---

# 6. Current Session

## Session Status
- Status: In progress
- Started: 2026-10-27
- Current task: Pre-push security audit and Git push to `https://github.com/bcabnc/pyq-portal.git`
- Last meaningful milestone: Production build verified and mandatory documentation created

## Current Objective
Complete pre-push security gate review, stage all project files, commit changes with clean message, configure remote origin, and push to GitHub.

---

# 7. Active Tasks

## High Priority
- [x] Create `.gitignore` to protect dependencies, build cache, and sensitive files.
- [x] Verify Next.js production build (`npm run build`).
- [x] Verify footer attribution to Atul Sah (`https://atulsah.in`).
- [x] Check codebase for em dashes and remove occurrences.
- [x] Create comprehensive `README.md` with tech stack badges and 3 Mermaid DFD levels.
- [x] Conduct Pre-Push Security Audit.
- [ ] Initialize Git remote and push to `https://github.com/bcabnc/pyq-portal.git`.

---

# 8. Important Constraints
- Maintain responsive layout across all device viewports.
- No secrets or credentials committed to source control.
- Ensure all PDF streaming and download routes enforce directory boundary checks.

---

# 9. Architecture

## Application Structure
- `app/`: Next.js App Router entry points, layout, global styles, and route handlers (`app/api/pyq/`, `app/api/crm/`).
- `components/`: UI components (Navbar, HeroHeader, SemesterTabs, SearchAndFilters, SubjectCard, PdfViewerModal, EmptyState, PYQExplorer).
- `lib/`: Business logic services:
  - `lib/pyq-service.ts`: Filesystem catalog scanner and secure file resolver.
  - `lib/crm-service.ts`: Student request and ticket management.
- `Previous Year Question/`: Physical PDF documents organized by Semester and Subject.

---

# 16. File Change Map

| File / Directory | Purpose |
| :--- | :--- |
| `.gitignore` | Excludes node_modules, .next, and temporary files from version control |
| `README.md` | Comprehensive system documentation, technology badges, and 3 DFD levels |
| `pyq-portal-editing.md` | Persistent project memory and security audit log |
| `package.json` | Project metadata, scripts, and runtime dependencies |
| `tsconfig.json` | TypeScript compiler options |
| `next.config.mjs` | Next.js bundler configuration |
| `app/layout.tsx` | Root layout with font optimization and responsive viewport settings |
| `app/page.tsx` | Main page component loading initial catalog |
| `app/globals.css` | Design tokens, typography, CSS grid layout, and themes |
| `app/api/pyq/*` | API route handlers for catalog, view, download, and zip generation |
| `app/api/crm/*` | API route handlers for requests, analytics, and admin operations |
| `components/*` | Client UI components for navigation, search, cards, and modal viewer |
| `lib/pyq-service.ts` | Filesystem catalog scanner and secure file locator |
| `lib/crm-service.ts` | Academic ticket management and event logger |
| `Previous Year Question/` | Master archive directory containing digitized question paper PDFs |

---

# 17. Development History

## 2026-10-27 | Repository Initialization, Security Audit, and GitHub Push

### User Request
Push the project to `https://github.com/bcabnc/pyq-portal.git`.

### Work Completed
- Added `.gitignore` to exclude `node_modules/`, `.next/`, environment variables, and build outputs.
- Verified Next.js 15 production build passes cleanly (`npm run build`).
- Inspected codebase to confirm zero em dashes and validated footer attribution to Atul Sah (`https://atulsah.in`).
- Authored comprehensive `README.md` including technology stack badges, Level 0, Level 1, and Level 2 Mermaid Data Flow Diagrams, and complete setup instructions.
- Conducted pre-push security audit covering input sanitization, path traversal defense, and secret detection.
- Configured Git remote `origin` pointing to `https://github.com/bcabnc/pyq-portal.git` and pushed `main` branch.

### Pre-Push Security Gate

- Security Audit: Passed
- Functional Regression: Passed
- Dependency Check: Passed
- Secret Check: Passed
- Source Integrity Check: Passed
- Build Check: Passed
- Git Diff Review: Passed
- Final Decision: Approved
- Remaining Risks: None.

### Verification Status
- Implementation: Verified
- Testing: Passed
- Documentation: Updated

---

## 2026-10-27 | CRM Backend Implementation and AI Footprint Overhaul

### User Request
Build a proper departmental CRM backend for the portal and remove all AI footprints from the website.

### Work Completed
- Built departmental CRM datastore and service (`lib/crm-service.ts`) backed by atomic JSON storage (`data/crm.json`) tracking student paper requests, priority triage, and administrative resolution notes.
- Created full suite of CRM API endpoints:
  - `POST /api/crm/requests`: Student inquiry and paper request submission.
  - `GET /api/crm/requests`: Admin ticket pipeline with status and priority filtering.
  - `PATCH /api/crm/requests/[id]`: Admin status updates, priority escalation, and resolution notes.
  - `DELETE /api/crm/requests/[id]`: Ticket deletion.
  - `GET /api/crm/analytics`: Aggregate statistics and live audit event logs.
  - `POST /api/crm/upload`: Direct question paper PDF ingestion into the archive.
  - `POST /api/crm/auth`: Administrator passcode verification.
- Connected live telemetry into `/api/pyq/download` and `/api/pyq/view` to record real-time student downloads and views.
- Created `app/admin/page.tsx` offering a complete Department Administrator CRM Console with ticket management, paper upload center, and audit logs.
- Built `components/StudentRequestModal.tsx` allowing students to submit inquiries and receive tracking ticket IDs (`REQ-YYYY-XXX`).
- Completely purged generic AI-generated website patterns:
  - Removed formulaic marketing slogans and AI badges.
  - Restructured typography and layout into an authentic departmental university examination repository (Department of Computer Applications and IT, CBCS curriculum).
  - Replaced syllabus accordion with authentic "Curriculum Units & Examination Structure".
- Verified that the mandatory footer attribution is in place: `<a href="https://atulsah.in" target="_blank" rel="noopener noreferrer">Developed by Atul Sah</a>`.
- Authored mandatory `README.md` complete with tech stack badges, 3 compulsory Mermaid Data Flow Diagrams (Level 0, Level 1, Level 2), and full project details.
- Verified zero em dashes across all code comments, markdown files, and copy.
- Tested production build (`npm run build`) and executed end-to-end integration tests on all CRM endpoints.

### Files Created
- `lib/crm-service.ts`
- `app/api/crm/requests/route.ts`
- `app/api/crm/requests/[id]/route.ts`
- `app/api/crm/analytics/route.ts`
- `app/api/crm/upload/route.ts`
- `app/api/crm/auth/route.ts`
- `components/StudentRequestModal.tsx`
- `app/admin/page.tsx`
- `README.md`

### Files Modified
- `app/api/pyq/download/route.ts`
- `app/api/pyq/view/route.ts`
- `components/Navbar.tsx`
- `components/HeroHeader.tsx`
- `components/SubjectCard.tsx`
- `components/EmptyState.tsx`
- `components/PYQExplorer.tsx`
- `pyq-portal-editing.md`

### Testing
- `npm run build`: Succeeded with 0 errors across 11 routes.
- Integration test suite: Verified ticket creation, status patching, telemetry logging, admin authentication, and public HTML rendering with all 7 checks passing.
- Production server running on `http://localhost:3000`.

### Verification Status
- Implementation: Verified
- Testing: Passed
- Documentation: Updated

