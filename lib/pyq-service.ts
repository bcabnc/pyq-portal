import fs from 'fs';
import path from 'path';

export interface PYQPaper {
  id: string;
  fileName: string;
  relativePath: string;
  year: number;
  yearLabel: string;
  sizeBytes: number;
  sizeFormatted: string;
  subjectCode: string;
  subjectTitle: string;
  semesterName: string;
  semesterNumber: number;
  category: 'Core Course' | 'Generic Elective' | 'Skill Enhancement' | 'Discipline Specific Elective' | 'General';
}

export interface SubjectInsight {
  summary: string;
  keyTopics: string[];
  examTips: string;
  credits?: number;
}

export interface PYQSubject {
  id: string;
  folderName: string;
  code: string;
  title: string;
  category: 'Core Course' | 'Generic Elective' | 'Skill Enhancement' | 'Discipline Specific Elective' | 'General';
  semesterName: string;
  semesterNumber: number;
  paperCount: number;
  yearsAvailable: string[];
  papers: PYQPaper[];
  insight: SubjectInsight;
}

export interface PYQSemester {
  semesterName: string;
  semesterNumber: number;
  displayName: string;
  subjectCount: number;
  paperCount: number;
  subjects: PYQSubject[];
}

export interface PYQCatalog {
  stats: {
    totalPapers: number;
    totalSubjects: number;
    totalSemesters: number;
    activeSemesters: number;
    totalSizeBytes: number;
    totalSizeFormatted: string;
  };
  semesters: PYQSemester[];
  allSubjects: PYQSubject[];
}

// Subject Syllabus & Exam Insights database for students to "samajh paayein"
export const SUBJECT_INSIGHTS: Record<string, SubjectInsight> = {
  'CC-5': {
    summary: 'Focuses on Python fundamentals, object-oriented concepts, data structures (lists, tuples, dicts), file handling, exception handling, and standard libraries.',
    keyTopics: ['Variables, Loops & Functions', 'OOP (Classes, Inheritance, Polymorphism)', 'File I/O & Exception Handling', 'Modules & Packages', 'List Comprehensions & Lambdas'],
    examTips: 'Past papers consistently test code snippet tracing, OOP implementation questions, and file parsing algorithms. Practice writing complete syntactically correct functions.',
    credits: 4
  },
  'CC-6': {
    summary: 'Explores operating system architecture, CPU scheduling algorithms, process synchronization, deadlocks, memory management, and file systems.',
    keyTopics: ['Process Management & IPC', 'CPU Scheduling (FCFS, SJF, Round Robin)', 'Deadlock Handling & Banker\'s Algorithm', 'Paging, Segmentation & Virtual Memory', 'Disk Scheduling (SSTF, SCAN)'],
    examTips: 'Numerical questions on CPU Scheduling, Banker’s Algorithm, and Page Replacement algorithms (FIFO, LRU, Optimal) appear in almost every examination.',
    credits: 4
  },
  'CC-7': {
    summary: 'System Analysis and Design principles, SDLC models, requirement engineering, DFDs, ER diagrams, testing methodologies, and project management.',
    keyTopics: ['SDLC Models (Waterfall, Spiral, Agile)', 'DFD Level 0, 1, 2 & Decision Tables', 'System Feasibility & Cost-Benefit Analysis', 'Input/Output Design & Validation', 'Software Testing & Maintenance'],
    examTips: 'Drawing clean Level 0/1 DFDs and structured ER diagrams carries significant marks. Prepare standard case studies for real-world system design.',
    credits: 4
  },
  'GE-3': {
    summary: 'Foundational probability, descriptive statistics, distributions (Binomial, Poisson, Normal), correlation, regression, and sampling theory.',
    keyTopics: ['Measures of Central Tendency & Dispersion', 'Probability & Bayes Theorem', 'Probability Distributions', 'Linear Correlation & Regression Lines', 'Hypothesis Testing Basics'],
    examTips: 'Step-by-step mathematical working is essential. Write formulas clearly before calculating numeric answers.',
    credits: 4
  },
  'SEC-1': {
    summary: 'Legal framework and constitutional provisions for environmental protection, national and international environmental conventions and case laws.',
    keyTopics: ['Environment Protection Act 1986', 'Water & Air Pollution Acts', 'Wildlife Protection & Forest Conservation', 'National Green Tribunal (NGT) Powers', 'Public Interest Litigation (PIL) in Environment'],
    examTips: 'Cite relevant constitutional articles (Article 21, 48A, 51A(g)) and landmark Supreme Court decisions to score top marks in subjective questions.',
    credits: 2
  },
  'CC-8': {
    summary: 'Computer networking architectures, OSI vs TCP/IP models, data link protocols, IP addressing/subnetting, routing algorithms, and transport layer protocols.',
    keyTopics: ['OSI 7-Layer Model & Functions', 'Framing, Error Detection (CRC, Checksum)', 'Subnetting, CIDR & IPv4 vs IPv6', 'Routing Algorithms (Dijkstra, Distance Vector)', 'TCP vs UDP, Flow & Congestion Control'],
    examTips: 'Subnet calculation problems and comparative questions (TCP vs UDP, OSI vs TCP/IP) are frequent and high-scoring.',
    credits: 4
  },
  'CC-9': {
    summary: '.NET Framework architecture, VB.NET programming constructs, Windows Forms GUI creation, event-driven programming, and ADO.NET database connectivity.',
    keyTopics: ['Common Language Runtime (CLR) & CTS', 'Windows Forms & Common Controls', 'Event-Driven Programming & Menus', 'Error Handling with Try-Catch', 'ADO.NET (Connection, Command, DataReader, DataSet)'],
    examTips: 'Questions often ask for complete code of a Windows Form application with database CRUD operations using ADO.NET.',
    credits: 4
  },
  'CC-10': {
    summary: 'Relational database concepts, normalization (1NF to BCNF), relational algebra, SQL querying, PL/SQL blocks, triggers, cursors, and transaction ACID properties.',
    keyTopics: ['Entity-Relationship Data Modeling', 'Functional Dependency & Normalization', 'Advanced SQL Queries & Joins', 'PL/SQL (Procedures, Functions, Triggers, Cursors)', 'Concurrency Control & Recovery Techniques'],
    examTips: 'Expect questions requiring SQL queries with GROUP BY/HAVING/subqueries, and PL/SQL code for cursor management or audit triggers.',
    credits: 4
  },
  'GE-4': {
    summary: 'Applied statistical methods, index numbers, time series analysis, analysis of variance (ANOVA), and statistical quality control.',
    keyTopics: ['Time Series Components & Trend Fitting', 'Index Numbers (Laspeyres, Paasche, Fisher)', 'Chi-Square Test & Contingency Tables', 'One-way and Two-way ANOVA', 'Statistical Quality Control (Control Charts)'],
    examTips: 'Verify test statistics with appropriate degrees of freedom and clearly state null/alternative hypotheses in testing questions.',
    credits: 4
  },
  'SEC-2': {
    summary: 'Technological, environmental, and managerial aspects of solid waste, recycling, composting, landfill engineering, and municipal regulations.',
    keyTopics: ['Solid Waste Classification & Characteristics', 'Collection & Transfer Station Systems', 'Composting & Biomethanation Techniques', 'Sanitary Landfill Design & Leachate Management', 'Solid Waste Management Rules & Circular Economy'],
    examTips: 'Flowcharts representing the lifecycle of municipal solid waste management and waste-to-energy technologies are frequently requested.',
    credits: 2
  },
  'CC-11': {
    summary: 'Core data structures implementation, linear structures (Arrays, Linked Lists, Stacks, Queues) and non-linear structures (Trees, BST, AVL, Graphs), and algorithmic analysis.',
    keyTopics: ['Stack Applications (Infix to Postfix, Recursion)', 'Linked Lists (Singly, Doubly, Circular)', 'Binary Trees & Binary Search Tree (BST)', 'Graph Traversals (BFS, DFS, Spanning Trees)', 'Sorting Algorithms & Asymptotic Notations'],
    examTips: 'Draw memory diagrams for pointers during tree rotations and linked list operations. Expect full algorithm writing and complexity derivations.',
    credits: 4
  },
  'CC-12': {
    summary: 'Big Data paradigms, 5 V\'s, Hadoop distributed architecture, HDFS, MapReduce execution model, NoSQL databases, and Apache Spark ecosystem.',
    keyTopics: ['Characteristics of Big Data (5 V\'s)', 'Hadoop Distributed File System (HDFS) Architecture', 'MapReduce Programming Model & Word Count', 'NoSQL Database Types (Key-Value, Document, Column, Graph)', 'Hive, Pig & Apache Spark Basics'],
    examTips: 'Diagrams of HDFS (NameNode/DataNode) and MapReduce execution flowcharts are heavily tested.',
    credits: 4
  },
  'DSE-1': {
    summary: 'Optimization models, Linear Programming Problems (LPP), Simplex method, duality, transportation problems, assignment problems, and game theory.',
    keyTopics: ['LPP Formulation & Graphical Method', 'Simplex Method & Big-M Method', 'Transportation Problems (VAM, MODI Method)', 'Hungarian Assignment Method', 'Two-Person Zero-Sum Games & Minimax'],
    examTips: 'Show full tabular calculations for Simplex and Transportation iterations without skipping intermediate matrices.',
    credits: 4
  },
  'DSE-2': {
    summary: 'Cybersecurity principles, classical and modern cryptography (DES, AES, RSA), digital signatures, network security protocols (SSL/TLS, IPsec), and firewalls.',
    keyTopics: ['Security Goals (CIA Triad) & Threat Models', 'Symmetric Encryption (DES, AES)', 'Asymmetric Cryptography (RSA Algorithm)', 'Hash Functions (SHA) & Digital Signatures', 'Firewalls, IDS/IPS & Malicious Software'],
    examTips: 'Numerical execution of RSA key generation and encryption/decryption with small prime numbers is a standard exam question.',
    credits: 4
  },
  'CC-13': {
    summary: 'Modern web architectures, semantic HTML5, CSS3 responsive layouts, client-side JavaScript DOM manipulation, AJAX, and server-side scripting.',
    keyTopics: ['Semantic HTML & CSS Responsive Grid/Flexbox', 'JavaScript ES6+, DOM Events & Fetch API', 'Client-Server HTTP Request Lifecycle', 'Form Validation & Web Security (XSS, CSRF)', 'Backend Basics & RESTful APIs'],
    examTips: 'Code questions usually ask for interactive HTML+CSS+JS components, like dynamic client-side forms or AJAX data tables.',
    credits: 4
  },
  'CC-14': {
    summary: 'Android operating system architecture, Android Studio toolchain, Activity lifecycle, Intents, UI Layouts, SQLite database, and background services.',
    keyTopics: ['Android OS Architecture & Dalvik/ART', 'Activity Lifecycle & Intent Mechanisms', 'XML UI Design (Constraint, Linear, Relative)', 'SQLite Database / Room & Content Providers', 'Broadcast Receivers & Background Services'],
    examTips: 'Draw the complete Activity lifecycle state diagram and write clean Java/Kotlin code for Intent data passing and SQLite open helpers.',
    credits: 4
  },
  'DSE-3': {
    summary: 'Data mining concepts, data preprocessing, association rule mining (Apriori), classification algorithms (Decision Trees, Naive Bayes), and clustering (K-Means).',
    keyTopics: ['KDD Process & Data Cleaning/Transformation', 'Association Rules & Apriori Algorithm', 'Classification (Decision Tree, Naive Bayes)', 'Clustering (K-Means & Hierarchical)', 'Evaluation Metrics (Precision, Recall, ROC Curve)'],
    examTips: 'Calculate support, confidence, and lift for Apriori iterations, and run step-by-step K-Means calculations on given sample 2D datasets.',
    credits: 4
  }
};

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function parseCourseCode(folderName: string): { code: string; title: string; category: PYQSubject['category'] } {
  const trimmed = folderName.trim();
  const match = trimmed.match(/^([A-Z]+-\d+)\s*(.*)$/i);
  if (match) {
    const code = match[1].toUpperCase();
    const title = match[2].trim() || code;
    let category: PYQSubject['category'] = 'General';
    if (code.startsWith('CC-')) category = 'Core Course';
    else if (code.startsWith('GE-')) category = 'Generic Elective';
    else if (code.startsWith('SEC-')) category = 'Skill Enhancement';
    else if (code.startsWith('DSE-')) category = 'Discipline Specific Elective';
    return { code, title, category };
  }
  return { code: trimmed, title: trimmed, category: 'General' };
}

function parsePaperYear(fileName: string): { year: number; yearLabel: string } {
  const cleanName = fileName.replace(/\.pdf$/i, '').trim();
  // Check for patterns like "CC-8 2025(1)", "2025(1)", "2024", "CC-11 2023"
  const setMatch = cleanName.match(/(20\d\d)\s*\(([0-9]+)\)/);
  if (setMatch) {
    const year = parseInt(setMatch[1], 10);
    return { year, yearLabel: `${year} (Set ${setMatch[2]})` };
  }

  const yearMatch = cleanName.match(/(20\d\d)/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return { year, yearLabel: `${year}` };
  }

  return { year: 0, yearLabel: 'Reference Paper' };
}

export function getPYQRootDir(): string {
  // Checks environment or defaults to workspace 'Previous Year Question'
  return path.resolve(process.cwd(), 'Previous Year Question');
}

export function getCatalog(): PYQCatalog {
  const rootDir = getPYQRootDir();
  const semesters: PYQSemester[] = [];
  const allSubjects: PYQSubject[] = [];

  const semOrder = [
    { dir: 'Semester 1st', num: 1, display: 'Semester 1' },
    { dir: 'Semester 2nd', num: 2, display: 'Semester 2' },
    { dir: 'Semester 3rd', num: 3, display: 'Semester 3' },
    { dir: 'Semester 4th', num: 4, display: 'Semester 4' },
    { dir: 'Semester 5th', num: 5, display: 'Semester 5' },
    { dir: 'Semester 6th', num: 6, display: 'Semester 6' },
  ];

  let totalPapers = 0;
  let totalSizeBytes = 0;

  for (const sem of semOrder) {
    const semPath = path.join(rootDir, sem.dir);
    const semesterSubjects: PYQSubject[] = [];

    if (fs.existsSync(semPath)) {
      const subjectFolders = fs.readdirSync(semPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subFolder of subjectFolders) {
        const subPath = path.join(semPath, subFolder);
        const { code, title, category } = parseCourseCode(subFolder);

        const files = fs.readdirSync(subPath, { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.toLowerCase().endsWith('.pdf'))
          .map(dirent => dirent.name);

        const papers: PYQPaper[] = [];

        for (const file of files) {
          const filePath = path.join(subPath, file);
          const stat = fs.statSync(filePath);
          const { year, yearLabel } = parsePaperYear(file);

          const relativePath = `${sem.dir}/${subFolder}/${file}`;
          const id = Buffer.from(relativePath).toString('base64url');

          totalPapers++;
          totalSizeBytes += stat.size;

          papers.push({
            id,
            fileName: file,
            relativePath,
            year,
            yearLabel,
            sizeBytes: stat.size,
            sizeFormatted: formatBytes(stat.size),
            subjectCode: code,
            subjectTitle: title,
            semesterName: sem.dir,
            semesterNumber: sem.num,
            category,
          });
        }

        // Sort papers by year descending (latest first)
        papers.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return a.fileName.localeCompare(b.fileName);
        });

        const yearsAvailable = Array.from(new Set(papers.map(p => p.yearLabel)));
        const subjectId = `${sem.num}-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        const insight = SUBJECT_INSIGHTS[code] || {
          summary: `Comprehensive examination preparation materials for ${title}.`,
          keyTopics: ['Core Theory & Principles', 'Standard Problem Solving', 'Past Examination Trends'],
          examTips: 'Review past year question trends to focus on frequently repeated conceptual and analytical questions.',
          credits: 4,
        };

        const subjectObj: PYQSubject = {
          id: subjectId,
          folderName: subFolder,
          code,
          title,
          category,
          semesterName: sem.dir,
          semesterNumber: sem.num,
          paperCount: papers.length,
          yearsAvailable,
          papers,
          insight,
        };

        semesterSubjects.push(subjectObj);
        allSubjects.push(subjectObj);
      }
    }

    // Sort subjects by code (CC, GE, SEC, DSE)
    semesterSubjects.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

    const semPaperCount = semesterSubjects.reduce((acc, sub) => acc + sub.paperCount, 0);

    semesters.push({
      semesterName: sem.dir,
      semesterNumber: sem.num,
      displayName: sem.display,
      subjectCount: semesterSubjects.length,
      paperCount: semPaperCount,
      subjects: semesterSubjects,
    });
  }

  const activeSemesters = semesters.filter(s => s.paperCount > 0).length;

  return {
    stats: {
      totalPapers,
      totalSubjects: allSubjects.length,
      totalSemesters: semesters.length,
      activeSemesters,
      totalSizeBytes,
      totalSizeFormatted: formatBytes(totalSizeBytes),
    },
    semesters,
    allSubjects,
  };
}

export function findPaperByPath(relPath: string): { fullPath: string; fileName: string } | null {
  const rootDir = getPYQRootDir();
  // Normalize and prevent path traversal
  const safePath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(rootDir, safePath);

  if (!fullPath.startsWith(rootDir)) {
    return null;
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return {
      fullPath,
      fileName: path.basename(fullPath),
    };
  }

  return null;
}
