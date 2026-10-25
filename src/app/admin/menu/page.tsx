'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MenuItemData, CategoryWithCount, DietaryType } from '@/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [formCategory, setFormCategory] = useState('');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formDietary, setFormDietary] = useState<DietaryType>('UNSPECIFIED');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch(`/api/admin/menu?categoryId=${selectedCategory}&q=${encodeURIComponent(searchQuery)}`),
        fetch('/api/admin/categories'),
      ]);

      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();

      if (itemsRes.ok) setItems(itemsData.items);
      if (catsRes.ok) setCategories(catsData.categories);
    } catch (err) {
      console.error('Failed to load menu admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormCategory(categories[0]?.id || '');
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormDietary('UNSPECIFIED');
    setFormAvailable(true);
    setFormFeatured(false);
    setFormNotes('');
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItemData) => {
    setEditingItem(item);
    setFormCategory(item.categoryId);
    setFormName(item.name);
    setFormDescription(item.description || '');
    setFormPrice(item.price !== null ? item.price.toString() : '');
    setFormDietary(item.dietaryType);
    setFormAvailable(item.isAvailable);
    setFormFeatured(item.isFeatured);
    setFormNotes(item.notes || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      categoryId: formCategory,
      name: formName,
      description: formDescription.trim() || null,
      price: formPrice.trim() !== '' ? parseFloat(formPrice) : null,
      dietaryType: formDietary,
      isAvailable: formAvailable,
      isFeatured: formFeatured,
      notes: formNotes.trim() || null,
      currency: 'INR',
    };

    try {
      const url = '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { id: editingItem.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item');

      setFeedback({ type: 'success', message: `Dish "${formName}" saved successfully` });
      setModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving item',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailable = async (item: MenuItemData) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          currency: item.currency,
          isAvailable: !item.isAvailable,
          isFeatured: item.isFeatured,
          dietaryType: item.dietaryType,
          notes: item.notes,
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !item.isAvailable } : i))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleToggleFeatured = async (item: MenuItemData) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          currency: item.currency,
          isAvailable: item.isAvailable,
          isFeatured: !item.isFeatured,
          dietaryType: item.dietaryType,
          notes: item.notes,
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isFeatured: !item.isFeatured } : i))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Item deleted successfully' });
        setDeleteId(null);
        fetchData();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error deleting item',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <UtensilsCrossed className="w-6 h-6 text-gold" />
            <span>Menu Dishes & Offerings</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Manage all 145+ dishes, update prices, toggle availability, and configure featured specials.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border border-red-800 text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card-dark border border-border-dark p-4">
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <label className="text-xs uppercase tracking-wider text-secondary-gray whitespace-nowrap">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-deep-black border border-border-dark px-3 py-1.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or ingredients..."
            className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-1.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading menu items...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 text-center space-y-2">
          <Filter className="w-8 h-8 text-secondary-gray mx-auto" />
          <p className="text-sm font-medium text-warm-ivory">No menu items match your search</p>
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
              <tr>
                <th className="py-3 px-4">Dish Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Dietary</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-deep-black/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-warm-ivory">{item.name}</div>
                    {item.notes && (
                      <div className="text-[11px] text-secondary-gray line-clamp-1 italic mt-0.5">
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-secondary-gray whitespace-nowrap">
                    {item.category?.name || 'General'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium">
                    {item.price !== null ? (
                      <span className="text-gold font-mono font-bold">₹{item.price}</span>
                    ) : (
                      <span className="text-secondary-gray/70 italic text-[11px]">Unset</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-secondary-gray">
                    {item.dietaryType}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`p-1.5 rounded-none border transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                          : 'bg-red-950/60 border-red-800 text-red-400'
                      }`}
                      title={item.isAvailable ? 'Available (Click to hide)' : 'Unavailable (Click to show)'}
                    >
                      {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`p-1.5 rounded-none border transition-colors ${
                        item.isFeatured
                          ? 'bg-gold/20 border-gold text-gold'
                          : 'bg-deep-black border-border-dark text-secondary-gray hover:text-warm-ivory'
                      }`}
                      title={item.isFeatured ? 'Featured (Click to unfeature)' : 'Standard (Click to feature)'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 bg-deep-black border border-border-dark text-warm-ivory hover:text-gold hover:border-gold/50"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 bg-deep-black border border-border-dark text-red-400 hover:border-red-700"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border-dark pb-3">
              <h3 className="font-serif text-lg font-bold text-warm-ivory">
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-secondary-gray hover:text-warm-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Category *
                </label>
                <select
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Paneer Tikka"
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                    Price (INR) <span className="text-secondary-gray text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Leave blank if unset"
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                    Dietary Classification
                  </label>
                  <select
                    value={formDietary}
                    onChange={(e) => setFormDietary(e.target.value as DietaryType)}
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  >
                    <option value="UNSPECIFIED">Unspecified / Neutral</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Description / Ingredients
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description for guests..."
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Internal / Source Notes
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Origin, brewing notes, clarification flags"
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
                  />
                  <span>Is Available</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border-dark">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-deep-black border border-border-dark text-secondary-gray hover:text-warm-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gold hover:bg-gold-light text-deep-black font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-base font-bold">Confirm Delete</h3>
            </div>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Are you sure you want to delete this menu dish? This action will permanently remove it from the catalog and cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-1.5 bg-deep-black border border-border-dark text-xs text-secondary-gray hover:text-warm-ivory"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
