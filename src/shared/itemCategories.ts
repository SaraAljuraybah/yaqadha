// Suggested values for the tender form's "item category" field (shown as type-ahead suggestions).
// The risk model accepts item_category as free text, so the field is not limited to this list, and the
// PDF extraction keeps the category exactly as written in the file.
//
// Only "Information Technology" has been confirmed against the live model (v1.1): it returned a comparison
// against 300 similar tenders. Add further suggestions here, one entry each; nothing else needs to change.

export interface ItemCategory {
  /** Exact value sent to the model when the suggestion is picked */
  value: string;
  label: { ar: string; en: string };
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  { value: 'Information Technology', label: { ar: 'تقنية المعلومات', en: 'Information Technology' } },
];
