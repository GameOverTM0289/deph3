'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useProductsStore } from '@/lib/store/products';
import { collections } from '@/lib/data/products';
import { formatPrice, cn, generateId } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { Product } from '@/lib/types';

const emptyProduct: Omit<Product, 'id' | 'createdAt' | 'sold'> = {
  name: '', slug: '', description: '', price: 0, images: ['/images/products/yellow-simple-1.jpg'],
  category: 'bikinis', colors: [{ name: 'Default', hex: '#000000' }], sizes: ['S', 'M', 'L'],
  stock: 50, featured: false, active: true, material: '', care: [],
};

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductActive, toggleProductFeatured, updateStock } = useProductsStore();
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<typeof emptyProduct>(emptyProduct);
  const [search, setSearch] = useState('');

  useEffect(() => { setMounted(true); useProductsStore.persist.rehydrate(); }, []);
  if (!mounted) return <div className="flex items-center justify-center h-64"><div className="loader" /></div>;

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm(emptyProduct); setIsNew(true); setEditing(null); };
  const openEdit = (product: Product) => {
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      price: product.price, images: product.images, category: product.category,
      colors: product.colors, sizes: product.sizes, stock: product.stock,
      featured: product.featured, active: product.active, material: product.material || '',
      care: product.care || [],
    });
    setEditing(product);
    setIsNew(false);
  };

  const handleSave = () => {
    if (!form.name || !form.slug) return;
    if (isNew) {
      addProduct(form);
    } else if (editing) {
      updateProduct(editing.id, form);
    }
    setEditing(null);
    setIsNew(false);
    setForm(emptyProduct);
  };

  const closeModal = () => { setEditing(null); setIsNew(false); setForm(emptyProduct); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fade-up">
        <div>
          <h1 className="heading-2 mb-1">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} products</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Icons.plus className="w-4 h-4 mr-2" /> Add Product</button>
      </div>

      <div className="mb-6 fade-up delay-1">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field max-w-sm" />
      </div>

      <div className="card overflow-hidden fade-up delay-2">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-sand-100 flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="capitalize">{product.category.replace('-', ' ')}</td>
                  <td className="font-medium">{formatPrice(product.price)}</td>
                  <td>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border text-sm text-center"
                      min="0"
                    />
                  </td>
                  <td>{product.sold}</td>
                  <td>
                    <button onClick={() => toggleProductActive(product.id)} className={cn('badge', product.active ? 'badge-success' : 'badge-gray')}>
                      {product.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleProductFeatured(product.id)} className={cn('badge', product.featured ? 'badge-info' : 'badge-gray')}>
                      {product.featured ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-sand-100 transition-colors" title="Edit"><Icons.edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-50 text-red-600 transition-colors" title="Delete"><Icons.trash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {(editing || isNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-medium">{isNew ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-sand-100"><Icons.x className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase mb-1 block">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase mb-1 block">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field h-auto resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase mb-1 block">Price (€)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase mb-1 block">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase mb-1 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="select-field">
                    {collections.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1 block">Material</label>
                <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1 block">Sizes (comma separated)</label>
                <input type="text" value={form.sizes.join(', ')} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="input-field" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="btn-primary flex-1">{isNew ? 'Add Product' : 'Save Changes'}</button>
                <button onClick={closeModal} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
