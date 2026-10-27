'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import HeroHeader from './HeroHeader';
import SemesterTabs from './SemesterTabs';
import SearchAndFilters from './SearchAndFilters';
import SubjectCard from './SubjectCard';
import PdfViewerModal from './PdfViewerModal';
import StudentRequestModal from './StudentRequestModal';
import EmptyState from './EmptyState';
import { PYQCatalog, PYQPaper, PYQSubject } from '@/lib/pyq-service';
import { ShieldCheck, FileQuestion, Bell } from 'lucide-react';

interface PYQExplorerProps {
  initialCatalog: PYQCatalog;
}

export default function PYQExplorer({ initialCatalog }: PYQExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Filtered subjects based on semester, category, and search query
  const filteredSubjects = useMemo(() => {
    let subjects = initialCatalog.allSubjects;

    // 1. Semester filter
    if (selectedSemester !== 'ALL') {
      subjects = subjects.filter((s) => s.semesterName === selectedSemester);
    }

    // 2. Category filter
    if (selectedCategory !== 'ALL') {
      subjects = subjects.filter((s) => s.category === selectedCategory);
    }

    // 3. Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      subjects = subjects.filter((s) => {
        const matchesCode = s.code.toLowerCase().includes(query);
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesSem = s.semesterName.toLowerCase().includes(query);
        const matchesYears = s.yearsAvailable.some((y) => y.toLowerCase().includes(query));
        const matchesTopics = s.insight.keyTopics.some((t) => t.toLowerCase().includes(query));
        const matchesPapers = s.papers.some((p) => p.fileName.toLowerCase().includes(query));

        return matchesCode || matchesTitle || matchesSem || matchesYears || matchesTopics || matchesPapers;
      });
    }

    return subjects;
  }, [initialCatalog.allSubjects, selectedSemester, selectedCategory, searchQuery]);

  const totalFilteredPapers = useMemo(() => {
    return filteredSubjects.reduce((acc, sub) => acc + sub.paperCount, 0);
  }, [filteredSubjects]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSemester('ALL');
    setSelectedCategory('ALL');
  };

  const selectedSemObj = initialCatalog.semesters.find((s) => s.semesterName === selectedSemester);
  const isSelectedSemEmpty = selectedSemester !== 'ALL' && selectedSemObj && selectedSemObj.paperCount === 0;

  return (
    <>
      <Navbar
        totalPapers={initialCatalog.stats.totalPapers}
        totalSubjects={initialCatalog.stats.totalSubjects}
        onRequestOpen={() => setIsRequestModalOpen(true)}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Department Announcement Banner */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.625rem 0.875rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span>
              <strong>Archival Notice:</strong> Semester papers from 2021 to 2026 are verified. Missing a paper? Submit a direct inquiry to the Examination Desk.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            style={{
              color: 'var(--accent-primary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Request Paper</span>
          </button>
        </div>

        <HeroHeader stats={initialCatalog.stats} />

        {/* Semester Navigation */}
        <SemesterTabs
          semesters={initialCatalog.semesters}
          selectedSemester={selectedSemester}
          onSelectSemester={setSelectedSemester}
          totalPapers={initialCatalog.stats.totalPapers}
        />

        {/* Search and Category Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          resultCount={filteredSubjects.length}
        />

        {/* Results count header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            Showing <strong>{filteredSubjects.length}</strong> courses (<strong>{totalFilteredPapers}</strong> archived papers)
            {selectedSemester !== 'ALL' && ` in ${selectedSemester}`}
            {selectedCategory !== 'ALL' && ` | ${selectedCategory}`}
          </div>
          {(searchQuery || selectedSemester !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Subject Grid or Empty States */}
        {isSelectedSemEmpty ? (
          <EmptyState
            type="empty-semester"
            semesterName={selectedSemObj?.displayName}
            onResetFilters={handleResetFilters}
            onRequestOpen={() => setIsRequestModalOpen(true)}
          />
        ) : filteredSubjects.length === 0 ? (
          <EmptyState
            type="no-search-results"
            searchQuery={searchQuery}
            onResetFilters={handleResetFilters}
            onRequestOpen={() => setIsRequestModalOpen(true)}
          />
        ) : (
          <section className="subject-grid" aria-label="Archived Courses and Question Papers">
            {filteredSubjects.map((sub) => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                onPreviewPaper={(paper) => setPreviewPaper(paper)}
              />
            ))}
          </section>
        )}
      </main>

      {/* In-Browser PDF Reader Modal */}
      <PdfViewerModal
        paper={previewPaper}
        onClose={() => setPreviewPaper(null)}
      />

      {/* Student CRM Request Modal */}
      <StudentRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultSemester={selectedSemester !== 'ALL' ? selectedSemester : 'Semester 1st'}
      />

      {/* Institutional Footer with Required Attribution */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-brand">Department of Computer Applications | University Examination Archive</div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
              Choice Based Credit System (CBCS) Repository for BCA and B.Sc Computer Science.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} strokeWidth={2.2} style={{ color: '#16a34a' }} />
              <span>Verified Departmental Records</span>
            </div>
            <div>
              <a href="https://atulsah.in" target="_blank" rel="noopener noreferrer">
                Developed by Atul Sah
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
