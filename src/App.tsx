import { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Moon,
  Search,
  Filter,
  Trash2,
  ListTodo,
  ShoppingBag,
  ArrowUpDown,
  Compass,
  Plus,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import {
  GroceryItem,
  GroceryCategory,
  FilterOption,
  SortOption,
  Theme,
  ToastMessage,
  CATEGORIES,
  CATEGORY_STYLES,
} from './types';

import Dashboard from './components/Dashboard';
import GroceryForm from './components/GroceryForm';
import GroceryItemCard from './components/GroceryItemCard';
import EditItemModal from './components/EditItemModal';
import ConfirmationModal from './components/ConfirmationModal';
import ToastContainer from './components/ToastContainer';

export default function App() {
  // ----------------------------------------------------
  // States & Local Storage Initialization
  // ----------------------------------------------------
  const [items, setItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('grocery_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored grocery items', e);
      }
    }
    // Default initial items for an elegant starting look if empty
    return [
      {
        id: '1',
        name: 'Organic Honeycrisp Apples',
        note: 'Get a bag of 5 or 6 medium-sized',
        category: 'Fruits',
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: '2',
        name: 'Whole Milk 2%',
        note: 'Check the expiry date!',
        category: 'Dairy',
        completed: true,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: '3',
        name: 'Sourdough Bread',
        note: 'Freshly baked if possible',
        category: 'Bakery',
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('grocery_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search & Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [activeSort, setActiveSort] = useState<SortOption>('Newest');
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory | 'All'>('All');

  // Edit Modal states
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Confirmation Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type: 'danger' | 'warning' | 'info';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    action: () => {},
  });

  // Track active navigation section based on scroll
  const [activeNavSection, setActiveNavSection] = useState<'dashboard' | 'add-item' | 'list'>('list');

  // ----------------------------------------------------
  // Syncing with Local Storage & Theme Application
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem('grocery_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('grocery_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle active section highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      const dashboardEl = document.getElementById('dashboard');
      const addFormEl = document.getElementById('add-item');
      const listEl = document.getElementById('grocery-list-container');

      if (!dashboardEl || !addFormEl || !listEl) return;

      const scrollPos = window.scrollY + 120;

      if (scrollPos < addFormEl.offsetTop) {
        setActiveNavSection('dashboard');
      } else if (scrollPos >= addFormEl.offsetTop && scrollPos < listEl.offsetTop) {
        setActiveNavSection('add-item');
      } else {
        setActiveNavSection('list');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ----------------------------------------------------
  // Toast Notification Trigger Helper
  // ----------------------------------------------------
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ----------------------------------------------------
  // Grocery List Operations
  // ----------------------------------------------------
  const handleAddItem = (newItem: { name: string; note?: string; category?: GroceryCategory }) => {
    const item: GroceryItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newItem.name,
      note: newItem.note,
      category: newItem.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [item, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          addToast(
            `"${item.name}" marked as ${nextState ? 'purchased' : 'active'}`,
            nextState ? 'info' : 'success'
          );
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const handleSaveEdit = (
    id: string,
    updatedData: { name: string; note?: string; category?: GroceryCategory }
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: updatedData.name,
            note: updatedData.note,
            category: updatedData.category,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (itemToDelete: GroceryItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemToDelete.name}" from your grocery list? This action cannot be undone.`,
      confirmLabel: 'Delete Item',
      cancelLabel: 'Keep It',
      type: 'danger',
      action: () => {
        setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        addToast(`"${itemToDelete.name}" was deleted.`, 'error');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearPurchased = () => {
    const purchasedCount = items.filter((item) => item.completed).length;
    if (purchasedCount === 0) {
      addToast('No purchased items to clear!', 'warning');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Clear Purchased Items',
      message: `Are you sure you want to remove all ${purchasedCount} purchased items? This will permanently clear them from the list.`,
      confirmLabel: 'Clear All',
      cancelLabel: 'Keep Items',
      type: 'danger',
      action: () => {
        setItems((prev) => prev.filter((item) => !item.completed));
        addToast(`Cleared ${purchasedCount} purchased items.`, 'success');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // ----------------------------------------------------
  // Search, Filter, & Sort Computation
  // ----------------------------------------------------
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // 1. Text Search Filter (Case insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.note?.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (activeFilter === 'Active') {
      result = result.filter((item) => !item.completed);
    } else if (activeFilter === 'Purchased') {
      result = result.filter((item) => item.completed);
    }

    // 3. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (activeSort === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (activeSort === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (activeSort === 'Alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [items, searchQuery, activeFilter, selectedCategory, activeSort]);

  // Remaining Items Count for Header Display
  const remainingCount = useMemo(() => {
    return items.filter((item) => !item.completed).length;
  }, [items]);

  // Scroll to helper
  const scrollToSection = (id: string, section: 'dashboard' | 'add-item' | 'list') => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveNavSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        isOpen={isEditOpen}
        item={editingItem}
        onSave={handleSaveEdit}
        onClose={() => {
          setIsEditOpen(false);
          setEditingItem(null);
        }}
        addToast={addToast}
      />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <ShoppingBag className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
                Grocery List
              </h1>
              {/* Display remaining count */}
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                {remainingCount === 0 ? (
                  <span className="text-emerald-500 dark:text-emerald-400">All purchased! 🎉</span>
                ) : (
                  <span>
                    {remainingCount} {remainingCount === 1 ? 'item' : 'items'} remaining
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              id="theme-toggle-btn"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Sticky Sub-navigation */}
        <div className="bg-white/60 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-around sm:justify-start gap-4 sm:gap-6 py-2.5">
            <button
              onClick={() => scrollToSection('dashboard', 'dashboard')}
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-lg transition-all cursor-pointer ${
                activeNavSection === 'dashboard'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              id="nav-dashboard-btn"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => scrollToSection('add-item', 'add-item')}
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-lg transition-all cursor-pointer ${
                activeNavSection === 'add-item'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              id="nav-add-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
            <button
              onClick={() => scrollToSection('grocery-list-container', 'list')}
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-lg transition-all cursor-pointer ${
                activeNavSection === 'list'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              id="nav-list-btn"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>My List</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8" id="main-content">
        {/* DASHBOARD MODULE */}
        <Dashboard items={items} />

        {/* ADD ITEM MODULE */}
        <GroceryForm onAddItem={handleAddItem} addToast={addToast} />

        {/* LIST SECTION CONTAINER */}
        <div
          id="grocery-list-container"
          className="scroll-mt-36 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6"
        >
          {/* Header of List Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                <ListTodo className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Shopping List
              </h3>
            </div>

            {/* Clear Purchased button */}
            <button
              onClick={handleClearPurchased}
              disabled={items.filter((item) => item.completed).length === 0}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/15 dark:hover:bg-rose-950/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:disabled:bg-zinc-900/10 px-3 py-2 rounded-xl border border-rose-100/30 dark:border-rose-950/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              id="clear-purchased-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Purchased</span>
            </button>
          </div>

          {/* SEARCH, SORT, FILTER TOOLBAR */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input (7 cols) */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search item name or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  id="search-input"
                />
              </div>

              {/* Status Filter Dropdown (3 cols) */}
              <div className="md:col-span-3 relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterOption)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  id="filter-select"
                >
                  <option value="All">All Items</option>
                  <option value="Active">Active (Unpurchased)</option>
                  <option value="Purchased">Purchased</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Sort Dropdown (3 cols) */}
              <div className="md:col-span-3 relative">
                <ArrowUpDown className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as SortOption)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  id="sort-select"
                >
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="Alphabetical">Alphabetical (A-Z)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* QUICK CATEGORY FILTER PILLS */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mr-1 select-none">
                Category:
              </span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
                id="cat-filter-all"
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                const count = items.filter((item) => item.category === cat).length;
                const isSelected = selectedCategory === cat;
                const style = CATEGORY_STYLES[cat];

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${style.color} ${style.textColor} ${style.borderColor} shadow-sm ring-2 ring-emerald-500/10`
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                    id={`cat-filter-${cat.replace(/\s+/g, '-')}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                    <span>{cat}</span>
                    {count > 0 && (
                      <span className="opacity-70 text-[10px] bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-bold">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ITEM LIST GRID & EMPTY STATE */}
          <div className="space-y-3 min-h-[200px]" id="grocery-item-cards-list">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedItems.length > 0 ? (
                filteredAndSortedItems.map((item) => (
                  <GroceryItemCard
                    key={item.id}
                    item={item}
                    onToggleComplete={handleToggleComplete}
                    onStartEdit={(it) => {
                      setEditingItem(it);
                      setIsEditOpen(true);
                    }}
                    onStartDelete={handleDeleteItem}
                  />
                ))
              ) : (
                /* EMPTY STATE CARD */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center"
                  id="empty-state-container"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4 shadow-inner">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                    {items.length === 0
                      ? 'Your list is completely empty'
                      : 'No items match your filters'}
                  </h4>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mt-1 leading-normal">
                    {items.length === 0
                      ? 'Add items like organic vegetables, dairy, or pantry staples at the top to start organizing your grocery runs.'
                      : 'Try resetting the search terms, switching filters, or selecting a different category to view more products.'}
                  </p>

                  {(searchQuery || activeFilter !== 'All' || selectedCategory !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('All');
                        setSelectedCategory('All');
                        addToast('Filters reset!', 'info');
                      }}
                      className="mt-4 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      id="reset-filters-btn"
                    >
                      Reset Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 mt-16 py-8 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <p>© 2026 Grocery Shopping List. Simple. Fast. Private.</p>
          <p className="mt-1">All data persists securely in your local browser storage.</p>
        </div>
      </footer>
    </div>
  );
}
