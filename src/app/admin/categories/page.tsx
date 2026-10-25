'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { CategoryWithCount } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryWithCount | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formPublished, setFormPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteCat, setDeleteCat] = useState<CategoryWithCount | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormDisplayOrder(categories.length + 1);
    setFormPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormDisplayOrder(cat.displayOrder);
    setFormPublished(cat.isPublished);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCat) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formName,
      slug: formSlug,
      description: formDescription.trim() || null,
      displayOrder: Number(formDisplayOrder),
      isPublished: formPublished,
    };

    try {
      const url = '/api/admin/categories';
      const method = editingCat ? 'PUT' : 'POST';
      const body = editingCat ? { id: editingCat.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      setFeedback({ type: 'success', message: `Category "${formName}" saved` });
      setModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving category',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setFeedback({ type: 'success', message: 'Category deleted' });
      setDeleteCat(null);
      fetchCategories();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error deleting category',
      });
      setDeleteCat(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <FolderTree className="w-6 h-6 text-gold" />
            <span>Menu Categories</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Organize menu hierarchy, descriptions, display ordering, and visibility.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
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

      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading categories...
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Dishes Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-deep-black/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-gold font-bold">#{cat.displayOrder}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-warm-ivory">{cat.name}</div>
                    {cat.description && (
                      <div className="text-[11px] text-secondary-gray line-clamp-1 mt-0.5">
                        {cat.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary-gray">{cat.slug}</td>
                  <td className="py-3 px-4 font-medium text-warm-ivory">
                    {cat._count?.items ?? 0} dishes
                  </td>
                  <td className="py-3 px-4">
                    {cat.isPublished ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-secondary-gray bg-gray-900 px-2 py-0.5 border border-border-dark">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 bg-deep-black border border-border-dark text-warm-ivory hover:text-gold"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCat(cat)}
                      className="p-1.5 bg-deep-black border border-border-dark text-red-400 hover:border-red-700"
                      title="Delete Category"
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

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-md w-full space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border-dark pb-3">
              <h3 className="font-serif text-lg font-bold text-warm-ivory">
                {editingCat ? 'Edit Category' : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Artisanal Starters"
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. artisanal-starters"
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-medium">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short introductory note for this category..."
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
                  />
                  <span>Published on Public Website</span>
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
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteCat && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteCat(null)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-base font-bold">Delete Category</h3>
            </div>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Are you sure you want to delete category &ldquo;{deleteCat.name}&rdquo;? Categories containing active dishes cannot be deleted until those dishes are reassigned or removed.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteCat(null)}
                className="px-4 py-1.5 bg-deep-black border border-border-dark text-xs text-secondary-gray hover:text-warm-ivory"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteCat.id)}
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
