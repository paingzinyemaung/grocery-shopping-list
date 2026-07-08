export interface GroceryItem {
  id: string;
  name: string;
  note?: string;
  category?: GroceryCategory;
  completed: boolean;
  createdAt: string; // ISO String
}

export type GroceryCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Meat'
  | 'Bakery'
  | 'Frozen'
  | 'Drinks'
  | 'Snacks'
  | 'Household'
  | 'Personal Care'
  | 'Other';

export const CATEGORIES: GroceryCategory[] = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat',
  'Bakery',
  'Frozen',
  'Drinks',
  'Snacks',
  'Household',
  'Personal Care',
  'Other',
];

export interface CategoryStyle {
  name: GroceryCategory;
  color: string; // Tailwind bg-class for badges
  textColor: string; // Tailwind text-class for badges
  borderColor: string; // Tailwind border class
  dotColor: string; // Dot indicator color class
}

export const CATEGORY_STYLES: Record<GroceryCategory, CategoryStyle> = {
  Vegetables: {
    name: 'Vegetables',
    color: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-900/50',
    dotColor: 'bg-emerald-500',
  },
  Fruits: {
    name: 'Fruits',
    color: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-900/50',
    dotColor: 'bg-amber-500',
  },
  Dairy: {
    name: 'Dairy',
    color: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-900/50',
    dotColor: 'bg-sky-500',
  },
  Meat: {
    name: 'Meat',
    color: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-900/50',
    dotColor: 'bg-rose-500',
  },
  Bakery: {
    name: 'Bakery',
    color: 'bg-yellow-50 dark:bg-yellow-950/40',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-900/50',
    dotColor: 'bg-yellow-500',
  },
  Frozen: {
    name: 'Frozen',
    color: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-900/50',
    dotColor: 'bg-indigo-500',
  },
  Drinks: {
    name: 'Drinks',
    color: 'bg-purple-50 dark:bg-purple-950/40',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
    dotColor: 'bg-purple-500',
  },
  Snacks: {
    name: 'Snacks',
    color: 'bg-pink-50 dark:bg-pink-950/40',
    textColor: 'text-pink-700 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-900/50',
    dotColor: 'bg-pink-500',
  },
  Household: {
    name: 'Household',
    color: 'bg-slate-100 dark:bg-slate-800/60',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-500',
  },
  'Personal Care': {
    name: 'Personal Care',
    color: 'bg-teal-50 dark:bg-teal-950/40',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-900/50',
    dotColor: 'bg-teal-500',
  },
  Other: {
    name: 'Other',
    color: 'bg-zinc-100 dark:bg-zinc-800/60',
    textColor: 'text-zinc-700 dark:text-zinc-300',
    borderColor: 'border-zinc-200 dark:border-zinc-700',
    dotColor: 'bg-zinc-500',
  },
};

export type FilterOption = 'All' | 'Active' | 'Purchased';

export type SortOption = 'Newest' | 'Oldest' | 'Alphabetical';

export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}
