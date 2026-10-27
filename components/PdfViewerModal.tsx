'use client';
import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { PYQPaper } from '@/lib/pyq-service';

interface PdfViewerModalProps {
  paper: PYQPaper | null;
  onClose: () => void;
}

export default function PdfViewerModal({ paper, onClose }: PdfViewerModalProps) {
  // Listen for Escape key
  useEffect(() => {
    if (!paper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paper, onClose]);

  if (!paper) return null;

  const viewUrl = `/api/pyq/view?path=${encodeURIComponent(paper.relativePath)}`;
  const downloadUrl = `/api/pyq/download?path=${encodeURIComponent(paper.relativePath)}`;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Question paper reader for ${paper.subjectCode} ${paper.yearLabel}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content-window">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-paper-title">
              {paper.subjectCode}: {paper.subjectTitle}
            </h3>
            <div className="modal-paper-sub">
              <span>{paper.yearLabel}</span>
              <span>•</span>
              <span>{paper.semesterName}</span>
              <span>•</span>
              <span>{paper.sizeFormatted}</span>
            </div>
          </div>

          <div className="modal-actions-group">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-btn"
              title="Open full PDF in new tab"
            >
              <ExternalLink size={14} strokeWidth={2.2} />
              <span>Full Tab</span>
            </a>

            <a
              href={downloadUrl}
              className="modal-btn modal-btn-primary"
              title="Download this paper"
            >
              <Download size={14} strokeWidth={2.2} />
              <span>Download</span>
            </a>

            <button
              type="button"
              className="modal-btn-close"
              onClick={onClose}
              aria-label="Close reader"
              title="Close reader (Esc)"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Modal Body: PDF Iframe */}
        <div className="modal-iframe-container">
          <iframe
            src={viewUrl}
            title={`${paper.subjectCode} ${paper.yearLabel} Question Paper`}
            className="modal-iframe"
          />
        </div>

        {/* Modal Fallback Bar for mobile devices without built-in iframe PDF renderers */}
        <div className="modal-fallback-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <FileText size={14} />
            <span>Mobile browser preview not loading?</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              Open in Browser Tab
            </a>
            <a
              href={downloadUrl}
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              Direct Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
