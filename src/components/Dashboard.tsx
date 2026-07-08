import { ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { GroceryItem } from '../types';

interface DashboardProps {
  items: GroceryItem[];
}

export default function Dashboard({ items }: DashboardProps) {
  const total = items.length;
  const purchased = items.filter((item) => item.completed).length;
  const remaining = total - purchased;
  const completionPercentage = total > 0 ? Math.round((purchased / total) * 100) : 0;

  return (
    <section id="dashboard" className="scroll-mt-24">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Items */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          id="stat-total-card"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8" />
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Total Items
            </p>
            <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              {total}
            </h4>
          </div>
        </motion.div>

        {/* Remaining Items */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          id="stat-remaining-card"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8" />
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Remaining
            </p>
            <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              {remaining}
            </h4>
          </div>
        </motion.div>

        {/* Purchased Items */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          id="stat-purchased-card"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8" />
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Purchased
            </p>
            <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              {purchased}
            </h4>
          </div>
        </motion.div>
      </div>

      {/* Completion Progress Bar */}
      {total > 0 && (
        <div className="mt-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Shopping progress
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}% complete
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
