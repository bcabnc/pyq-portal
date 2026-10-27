'use client';
import React, { useState } from 'react';
import { 
  Eye, 
  ArrowDown, 
  DownloadCloud, 
  ChevronDown, 
  ChevronUp, 
  BookMarked, 
  GraduationCap
} from 'lucide-react';
import { PYQSubject, PYQPaper } from '@/lib/pyq-service';

interface SubjectCardProps {
  subject: PYQSubject;
  onPreviewPaper: (paper: PYQPaper) => void;
}

export default function SubjectCard({ subject, onPreviewPaper }: SubjectCardProps) {
  const [showCurriculum, setShowCurriculum] = useState(false);

  // Category badge class
  let badgeClass = 'badge-core';
  if (subject.category === 'Generic Elective') badgeClass = 'badge-ge';
  else if (subject.category === 'Skill Enhancement') badgeClass = 'badge-sec';
  else if (subject.category === 'Discipline Specific Elective') badgeClass = 'badge-elec';

  const downloadAllUrl = `/api/pyq/download-all?semester=${encodeURIComponent(subject.semesterName)}&subject=${encodeURIComponent(subject.folderName)}`;

  return (
    <article className="subject-card">
      <div className="card-top">
        <div className="card-tags">
          <span className={`badge ${badgeClass}`}>{subject.category}</span>
          <span className="badge badge-sem">{subject.semesterName}</span>
          {subject.insight.credits && (
            <span className="badge badge-sem">{subject.insight.credits} Credits</span>
          )}
        </div>
      </div>

      <h2 className="subject-title">
        <span className="subject-code-prefix">{subject.code}:</span>
        {subject.title}
      </h2>

      <p className="subject-summary">{subject.insight.summary}</p>

      {/* Curriculum Units & Exam Scheme Accordion */}
      <button
        type="button"
        className="insight-toggle-btn"
        onClick={() => setShowCurriculum(!showCurriculum)}
        aria-expanded={showCurriculum}
      >
        <GraduationCap size={15} strokeWidth={2.2} />
        <span>{showCurriculum ? 'Hide Curriculum & Exam Scheme' : 'Curriculum Units & Exam Scheme'}</span>
        {showCurriculum ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {showCurriculum && (
        <div className="insight-box">
          <div className="insight-heading">
            <BookMarked size={14} strokeWidth={2.2} />
            <span>Prescribed Curriculum Units</span>
          </div>
          <div className="insight-topics-list">
            {subject.insight.keyTopics.map((topic, i) => (
              <span key={i} className="topic-tag">{topic}</span>
            ))}
          </div>

          <div className="insight-heading" style={{ marginTop: '0.625rem' }}>
            <GraduationCap size={14} strokeWidth={2.2} />
            <span>Examination Evaluation Scheme</span>
          </div>
          <p className="insight-exam-tips">{subject.insight.examTips}</p>
        </div>
      )}

      {/* Papers Section */}
      <div className="card-papers-section">
        <div className="papers-section-title">
          <span>{subject.paperCount} Archived Question Papers</span>
          {subject.paperCount > 1 && (
            <a
              href={downloadAllUrl}
              className="download-all-link"
              title="Download all examination sets for this subject as a ZIP archive"
            >
              <DownloadCloud size={13} strokeWidth={2.2} />
              <span>Download Subject Archive (ZIP)</span>
            </a>
          )}
        </div>

        <div className="papers-list">
          {subject.papers.map((paper) => {
            const downloadUrl = `/api/pyq/download?path=${encodeURIComponent(paper.relativePath)}`;

            return (
              <div key={paper.id} className="paper-row-item">
                <div className="paper-meta">
                  <span className="paper-year-badge">{paper.yearLabel}</span>
                  <span className="paper-filesize">{paper.sizeFormatted}</span>
                </div>

                <div className="paper-actions">
                  <button
                    type="button"
                    className="btn-action-view"
                    onClick={() => onPreviewPaper(paper)}
                    title={`View ${paper.subjectCode} (${paper.yearLabel}) in browser`}
                  >
                    <Eye size={13} strokeWidth={2.2} />
                    <span>View</span>
                  </button>

                  <a
                    href={downloadUrl}
                    className="btn-action-download"
                    title={`Download ${paper.fileName}`}
                    aria-label={`Download ${paper.fileName}`}
                  >
                    <ArrowDown size={14} strokeWidth={2.2} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
