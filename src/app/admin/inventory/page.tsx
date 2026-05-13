'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { Package, Plus, Search, AlertTriangle, X, ArrowUp, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminInventory() {
  const { data: inventory, isLoading } = useSWR('/api/inventory', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  const filtered = Array.isArray(inventory)
    ? inventory.filter(
        (item: any) =>
          (item?.item?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item?.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : [];

  const lowStockItems = Array.isArray(inventory)
    ? inventory.filter((item: any) => item.quantity <= item.threshold)
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const url = isEditing ? `/api/inventory?id=${editingItem.id}` : '/api/inventory';
    const method = isEditing ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isEditing ? 'Item updated' : 'Item added');
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingItem(null);
      mutate('/api/inventory');
    } else {
      const errorData = await res.json();
      toast.error('Error: ' + errorData.error);
    }
  };

  const updateQuantity = async (id: string, change: number) => {
    const item = Array.isArray(inventory) ? inventory.find((i: any) => i.id === id) : null;
    if (!item) return;
    const newQty = Math.max(0, item.quantity + change);
    const res = await fetch(`/api/inventory?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    if (res.ok) mutate('/api/inventory');
    else toast.error('Failed to update');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Item deleted');
      mutate('/api/inventory');
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setIsEditing(false);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-1">
            Inventory Management
          </h1>
          <p className="text-slate-500 text-sm">Track dental supplies and consumables.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-red-600" />
            <h3 className="font-bold text-red-700">Low Stock Alerts ({lowStockItems.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item: any) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"
              >
                {item.item}: {item.quantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-3xl shadow-card border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Item</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Quantity</th>
                <th className="px-8 py-5">Threshold</th>
                <th className="px-8 py-5">Unit Price</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item: any) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/30 transition-colors ${item.quantity <= item.threshold ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.quantity <= item.threshold ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}
                      >
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-navy-700">{item.item}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600">{item.category}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span
                        className={`font-bold ${item.quantity <= item.threshold ? 'text-red-600' : 'text-navy-700'}`}
                      >
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {item.threshold} {item.unit}
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-navy-700">
                    ₹{item.cost_per_unit}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-navy-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <form 
              key={editingItem?.id || 'new'}
              onSubmit={handleSubmit} 
              className="p-8 lg:p-10 space-y-4"
            >
              <h2 className="font-display text-2xl font-bold text-navy-700">
                {isEditing ? 'Edit Item' : 'Add Inventory Item'}
              </h2>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                  Item Name
                </label>
                <input
                  name="item"
                  required
                  defaultValue={editingItem?.item}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                  Category
                </label>
                <input
                  name="category"
                  required
                  defaultValue={editingItem?.category}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    required
                    defaultValue={editingItem?.quantity}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Unit
                  </label>
                  <input
                    name="unit"
                    placeholder="Box, Pairs, etc."
                    required
                    defaultValue={editingItem?.unit}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Threshold
                  </label>
                  <input
                    name="threshold"
                    type="number"
                    defaultValue={editingItem?.threshold || 5}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Cost Per Unit
                  </label>
                  <input
                    name="cost_per_unit"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingItem?.cost_per_unit}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:bg-white focus:border-teal-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20"
                >
                  {isEditing ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
