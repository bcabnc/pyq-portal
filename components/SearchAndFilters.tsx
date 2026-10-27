'use client';
import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  resultCount: number;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Courses' },
  { id: 'Core Course', label: 'Core Courses (CC)' },
  { id: 'Generic Elective', label: 'Generic Electives (GE)' },
  { id: 'Skill Enhancement', label: 'Skill (SEC)' },
  { id: 'Discipline Specific Elective', label: 'Discipline Electives (DSE)' },
];

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  resultCount,
}: SearchAndFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to quickly focus the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="search-icon-left">
          <Search size={18} strokeWidth={2.2} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by subject name, course code (e.g. CC-11, Python), or year..."
          className="search-input"
          aria-label="Search previous year question papers"
        />
        <div className="search-action-right">
          {searchQuery ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          ) : (
            <span className="search-kbd-hint">/</span >
          )}
        </div>
      </div>

      <div className="filter-chips-row" role="region" aria-label="Course Category Filters">
        <span className="filter-label">Filter:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
