'use client';
import React from 'react';
import { PYQSemester } from '@/lib/pyq-service';

interface SemesterTabsProps {
  semesters: PYQSemester[];
  selectedSemester: string;
  onSelectSemester: (semName: string) => void;
  totalPapers: number;
}

export default function SemesterTabs({
  semesters,
  selectedSemester,
  onSelectSemester,
  totalPapers,
}: SemesterTabsProps) {
  return (
    <div className="semester-tabs-wrapper">
      <div className="semester-tabs-scroll" role="tablist" aria-label="Filter by Semester">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSemester === 'ALL'}
          className={`semester-tab-btn ${selectedSemester === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectSemester('ALL')}
        >
          <span>All Semesters</span>
          <span className="tab-badge">{totalPapers}</span>
        </button>

        {semesters.map((sem) => {
          const isActive = selectedSemester === sem.semesterName;
          return (
            <button
              key={sem.semesterName}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`semester-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSemester(sem.semesterName)}
            >
              <span>{sem.displayName}</span>
              <span className="tab-badge">{sem.paperCount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
