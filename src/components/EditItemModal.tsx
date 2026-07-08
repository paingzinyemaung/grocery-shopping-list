import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Tag, AlignLeft, X } from 'lucide-react';
import { GroceryItem, GroceryCategory, CATEGORIES, CATEGORY_STYLES } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  item: GroceryItem | null;
  onSave: (id: string, updatedData: { name: string; note?: string; category?: GroceryCategory }) => void;
  onClose: () => void;
  addToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function EditItemModal({
  isOpen,
  item,
  onSave,
  onClose,
  addToast,
}: EditItemModalProps) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<GroceryCategory | ''>('');

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state with selected item when modal opens
  useEffect(() => {
    if (item && isOpen) {
      setName(item.name);
      setNote(item.note || '');
      setCategory(item.category || '');

      // Focus first input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [item, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (!isOpen) return;
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener('keydown', handleTab);
      return () => window.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      addToast('Item name is required!', 'error');
      return;
    }

    onSave(item.id, {
      name: trimmedName,
      note: note.trim() ? note.trim() : undefined,
      category: category ? category : undefined,
    });

    addToast(`"${trimmedName}" updated!`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950"
            aria-hidden="true"
            id="edit-modal-backdrop"
          />

          {/* Dialog Body */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800 z-10"
            id="edit-item-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close edit dialog"
              id="close-edit-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="edit-modal-title"
                  className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
                >
                  Edit Grocery Item
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Update item details below
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" id="edit-grocery-form">
              {/* Name */}
              <div>
                <label
                  htmlFor="edit-item-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                >
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="edit-item-name"
                  placeholder="e.g., Bananas, Organic Milk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                  required
                  autoComplete="off"
                />
              </div>

              {/* Category selector */}
              <div>
                <label
                  htmlFor="edit-item-category"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" /> Category <span className="text-zinc-400">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    id="edit-item-category"
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

              {/* Note */}
              <div>
                <label
                  htmlFor="edit-item-note"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5"
                >
                  <AlignLeft className="w-3.5 h-3.5" /> Note <span className="text-zinc-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="edit-item-note"
                  placeholder="e.g., Packs of 3, organic"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                  autoComplete="off"
                />
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                  id="edit-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                  id="edit-save-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
