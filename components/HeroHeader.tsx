'use client';
import React from 'react';
import { FileText, Layers, Calendar, Building2 } from 'lucide-react';

interface HeroHeaderProps {
  stats: {
    totalPapers: number;
    totalSubjects: number;
    totalSemesters: number;
    activeSemesters: number;
    totalSizeFormatted: string;
  };
}

export default function HeroHeader({ stats }: HeroHeaderProps) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Building2 size={14} strokeWidth={2.2} />
        <span>Department of Computer Applications</span>
      </div>
      <h1 className="hero-heading">
        Undergraduate Semester <span className="text-accent">Examination Question Papers</span>
      </h1>
      <p className="hero-description">
        Official university repository of previous semester examination papers for BCA and B.Sc Computer Science under the Choice Based Credit System (CBCS). Filter by semester, review syllabus units, and download verified PDF documents.
      </p>

      <div className="metrics-strip">
        <div className="metric-card">
          <div className="metric-icon-wrap">
            <FileText size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="metric-val">{stats.totalPapers}</div>
            <div className="metric-lbl">Archived Papers</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Layers size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="metric-val">{stats.totalSubjects}</div>
            <div className="metric-lbl">CBCS Courses</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Calendar size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="metric-val">2021 to 2026</div>
            <div className="metric-lbl">Examination Sessions</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Building2 size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="metric-val">{stats.activeSemesters} of 6</div>
            <div className="metric-lbl">Active Semesters</div>
          </div>
        </div>
      </div>
    </section>
  );
}
