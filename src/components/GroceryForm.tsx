import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Tag, AlignLeft, RefreshCw } from 'lucide-react';
import { GroceryCategory, CATEGORIES, CATEGORY_STYLES } from '../types';

interface GroceryFormProps {
  onAddItem: (item: { name: string; note?: string; category?: GroceryCategory }) => void;
  addToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function GroceryForm({ onAddItem, addToast }: GroceryFormProps) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<GroceryCategory | ''>('');
  const [keepOpen, setKeepOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus the item name input on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      addToast('Item name is required!', 'error');
      return;
    }

    // Submit the item
    onAddItem({
      name: trimmedName,
      note: note.trim() ? note.trim() : undefined,
      category: category ? category : undefined,
    });

    // Success notification
    addToast(`"${trimmedName}" added successfully!`, 'success');

    // Reset fields
    setName('');
    setNote('');
    setCategory('');

    // Re-focus the input if user wants to add another immediately
    if (keepOpen || true) {
      nameInputRef.current?.focus();
    }
  };

  return (
    <section id="add-item" className="scroll-mt-24 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Add New Grocery Item
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="add-grocery-form">
        {/* Item Name Input */}
        <div>
          <label
            htmlFor="item-name"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
          >
            Item Name <span className="text-rose-500">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="item-name"
            placeholder="e.g., Organic Whole Milk, Bananas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
            required
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Input */}
          <div>
            <label
              htmlFor="item-category"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" /> Category <span className="text-zinc-400">(Optional)</span>
            </label>
            <div className="relative">
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GroceryCategory)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-zinc-900">-- Choose Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-zinc-900">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {category && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">Preview style:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
                    CATEGORY_STYLES[category].color
                  } ${CATEGORY_STYLES[category].textColor} ${
                    CATEGORY_STYLES[category].borderColor
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLES[category].dotColor}`} />
                  {category}
                </span>
              </div>
            )}
          </div>

          {/* Optional Note Input */}
          <div>
            <label
              htmlFor="item-note"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5"
            >
              <AlignLeft className="w-3.5 h-3.5" /> Note <span className="text-zinc-400">(Optional)</span>
            </label>
            <input
              type="text"
              id="item-note"
              placeholder="e.g., Get the 2% fat one, pack of 2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Keep open settings */}
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none py-1">
            <input
              type="checkbox"
              checked={keepOpen}
              onChange={(e) => setKeepOpen(e.target.checked)}
              className="sr-only peer"
              id="keep-open-checkbox"
            />
            <div className="relative w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-500" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Quick "Add Another" mode
            </span>
          </label>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            id="add-item-submit-btn"
          >
            <PlusCircle className="w-4 h-4" /> Add to List
          </button>
        </div>
      </form>
    </section>
  );
}
