'use client';
import React from 'react';
import { FolderOpen, SearchX, RotateCcw, FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-search-results' | 'empty-semester';
  semesterName?: string;
  searchQuery?: string;
  onResetFilters: () => void;
  onRequestOpen?: () => void;
}

export default function EmptyState({
  type,
  semesterName,
  searchQuery,
  onResetFilters,
  onRequestOpen,
}: EmptyStateProps) {
  if (type === 'no-search-results') {
    return (
      <div className="empty-state-box">
        <div className="empty-icon-wrapper">
          <SearchX size={26} strokeWidth={2} />
        </div>
        <h3 className="empty-state-title">No matching question papers located</h3>
        <p className="empty-state-text">
          No question papers matched &quot;{searchQuery}&quot;. Please verify course codes (e.g., CC-11, CC-5, GE-3) or subject keywords.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onResetFilters}
            className="modal-btn"
          >
            <RotateCcw size={14} strokeWidth={2.2} />
            <span>Reset Search & Filters</span>
          </button>
          {onRequestOpen && (
            <button
              type="button"
              onClick={onRequestOpen}
              className="modal-btn modal-btn-primary"
            >
              <FileQuestion size={14} strokeWidth={2.2} />
              <span>Request Paper From Examination Desk</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state-box">
      <div className="empty-icon-wrapper">
        <FolderOpen size={26} strokeWidth={2} />
      </div>
      <h3 className="empty-state-title">
        {semesterName ? `${semesterName} Archive Ingestion In Progress` : 'No Papers Found'}
      </h3>
      <p className="empty-state-text">
        Physical examination question papers for {semesterName || 'this semester'} are currently undergoing archival scanning and departmental review. You can browse active papers in Semesters 3rd through 6th, or submit a priority request.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onResetFilters}
          className="modal-btn"
        >
          <span>View Active Semesters</span>
        </button>
        {onRequestOpen && (
          <button
            type="button"
            onClick={onRequestOpen}
            className="modal-btn modal-btn-primary"
          >
            <FileQuestion size={14} strokeWidth={2.2} />
            <span>Request {semesterName} Paper</span>
          </button>
        )}
      </div>
    </div>
  );
}
