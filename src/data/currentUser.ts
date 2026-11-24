// The signed-in demo user (Dr. Fahad). Kept in its own small module so the landing page can use it
// without bundling the full demo dataset; demo.ts re-exports it and builds PEOPLE.fahad from it.
export const CURRENT_USER = {
  name: { ar: 'د. فهد الهذلي', en: 'Dr. Fahad Al-Hudhali' },
  initials: { ar: 'ف.هـ', en: 'F.H' },
  firstName: { ar: 'د. فهد', en: 'Dr. Fahad' },
  role: { ar: 'مراقب عام تنفيذي', en: 'Executive Chief Auditor' },
  department: { ar: 'أمانة الرقابة والحوكمة', en: 'Oversight & Governance Secretariat' },
} as const;
