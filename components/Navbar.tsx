'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, FileQuestion, Shield } from 'lucide-react';

interface NavbarProps {
  totalPapers: number;
  totalSubjects: number;
  onRequestOpen: () => void;
}

export default function Navbar({ totalPapers, totalSubjects, onRequestOpen }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="brand-wrapper">
            <div className="brand-logo-icon">
              <BookOpen size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="brand-title">Department Examination Archive</div>
              <div className="brand-tagline">Choice Based Credit System (CBCS) Repository</div>
            </div>
          </Link>

          <div className="nav-actions">
            <button
              type="button"
              className="modal-btn"
              onClick={onRequestOpen}
              style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <FileQuestion size={15} strokeWidth={2} />
              <span>Request Paper</span>
            </button>

            <Link
              href="/admin"
              className="modal-btn"
              style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
              title="Department Examination Administrator Portal"
            >
              <Shield size={14} strokeWidth={2} />
              <span>Admin Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
