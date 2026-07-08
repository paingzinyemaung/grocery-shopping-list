import { Check, Edit2, Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { GroceryItem, CATEGORY_STYLES } from '../types';

interface GroceryItemCardProps {
  key?: string;
  item: GroceryItem;
  onToggleComplete: (id: string) => void;
  onStartEdit: (item: GroceryItem) => void;
  onStartDelete: (item: GroceryItem) => void;
}

export default function GroceryItemCard({
  item,
  onToggleComplete,
  onStartEdit,
  onStartDelete,
}: GroceryItemCardProps) {
  const dateFormatted = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const catStyle = item.category ? CATEGORY_STYLES[item.category] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        item.completed
          ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800/40 opacity-60'
          : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md'
      }`}
      id={`item-card-${item.id}`}
    >
      {/* Left section: Checkbox, Text Details */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox Button */}
        <button
          onClick={() => onToggleComplete(item.id)}
          className={`mt-0.5 w-6 h-6 flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
            item.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-transparent'
          }`}
          id={`toggle-btn-${item.id}`}
          aria-label={item.completed ? 'Mark as active' : 'Mark as purchased'}
        >
          {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Name and notes */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4
              className={`text-base font-semibold text-zinc-900 dark:text-zinc-50 break-words leading-snug cursor-pointer select-none ${
                item.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
              }`}
              onClick={() => onToggleComplete(item.id)}
            >
              {item.name}
            </h4>

            {/* Category Badge */}
            {catStyle && (
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${catStyle.color} ${catStyle.textColor} ${catStyle.borderColor}`}
              >
                <span className={`w-1 h-1 rounded-full ${catStyle.dotColor}`} />
                {item.category}
              </span>
            )}
          </div>

          {/* Optional Note */}
          {item.note && (
            <p
              className={`text-sm text-zinc-500 dark:text-zinc-400 break-words leading-normal ${
                item.completed ? 'line-through opacity-80' : ''
              }`}
            >
              {item.note}
            </p>
          )}

          {/* Created Date */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Added {dateFormatted}</span>
            </div>
            {item.addedBy && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400 font-semibold">
                  {item.addedBy.split('@')[0].charAt(0).toUpperCase() + item.addedBy.split('@')[0].slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2 sm:self-center self-end flex-shrink-0">
        {/* Edit Button */}
        <button
          onClick={() => onStartEdit(item)}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          title="Edit item"
          id={`edit-btn-${item.id}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onStartDelete(item)}
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          title="Delete item"
          id={`delete-btn-${item.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
