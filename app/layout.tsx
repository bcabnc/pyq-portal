import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PYQ Portal | University Previous Year Question Papers & Syllabi',
  description: 'Clean, minimalist portal for university students to easily access, view in-browser, understand course syllabi, and download Previous Year Question (PYQ) papers across all semesters.',
  keywords: ['PYQ', 'Previous Year Questions', 'University Exams', 'Semester Papers', 'Exam Preparation', 'Question Papers PDF'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
