// Item categories accepted by the risk model (field `item_category`), shared by the browser (dropdown)
// and the server (the extraction prompt may only choose from this list).
//
// TODO(category list): the model's OpenAPI spec does not enumerate the accepted values, and the full list
// has not been provided yet. Only the value below has been confirmed against the live model (v1.1): it
// returned a comparison against 300 similar tenders. Add the remaining categories here, one entry each;
// nothing else needs to change.

export interface ItemCategory {
  /** Exact value sent to the model */
  value: string;
  label: { ar: string; en: string };
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  { value: 'Information Technology', label: { ar: 'تقنية المعلومات', en: 'Information Technology' } },
];

export const ITEM_CATEGORY_VALUES: string[] = ITEM_CATEGORIES.map((c) => c.value);
