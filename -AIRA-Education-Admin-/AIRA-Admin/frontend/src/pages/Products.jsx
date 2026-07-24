import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Upload, Image as ImageIcon, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { productsService, formatCurrency, formatDate } from '../services/api';
import { useToast } from '../context/ToastContext';

const categories = ['Books', 'Equipment', 'Electronics', 'Kits', 'Software', 'Other'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Books',
  status: 'active',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { addToast } = useToast();

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      status: product.status,
    });
    setImageFile(null);
    setImagePreview(product.image_url || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      addToast('Name and price are required', 'error');
      return;
    }
    setSaving(true);
    try {
      let savedProduct;
      if (editingProduct) {
        savedProduct = await productsService.update(editingProduct.id, form);
        addToast('Product updated successfully', 'success');
      } else {
        savedProduct = await productsService.create(form);
        addToast('Product created successfully', 'success');
      }

      if (imageFile && savedProduct?.id) {
        await productsService.uploadImage(savedProduct.id, imageFile);
      }

      setModalOpen(false);
      loadProducts();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setSaving(true);
    try {
      await productsService.delete(deleteModal.id);
      addToast('Product deleted successfully', 'success');
      setDeleteModal(null);
      loadProducts();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {row.image_url ? (
            <img src={row.image_url} alt={val} style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={16} color="var(--color-text-muted)" />
            </div>
          )}
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{val}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (val) => <span className="badge badge-primary">{val}</span> },
    {
      key: 'price',
      label: 'Price',
      render: (val) => (
        <span style={{ fontWeight: 600, color: 'var(--color-accent-light)' }}>
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`badge ${val === 'active' ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (val) => formatDate(val),
    },
  ];

  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Products</h1>
          <p>Manage your educational products and resources</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        onEdit={openEdit}
        onDelete={(row) => setDeleteModal(row)}
        searchPlaceholder="Search products..."
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </>
        }
      >
        {/* Image Upload Area */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Product Image</label>
          <div style={{
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center',
            position: 'relative',
            backgroundColor: 'var(--color-bg-secondary)',
            transition: 'border-color 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px'
          }}>
            {imagePreview ? (
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxHeight: '160px', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
                />
                <button
                  className="btn-icon"
                  style={{
                    position: 'absolute', top: -10, right: '50%', marginRight: -80,
                    backgroundColor: 'var(--color-bg-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    color: 'var(--color-danger)'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={32} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-2)' }} />
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: '0 0 var(--space-2) 0' }}>
                  Drag & drop an image here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer'
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="product-name">Product Name *</label>
          <input
            id="product-name"
            className="form-input"
            placeholder="Enter product name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="product-desc">Description</label>
          <textarea
            id="product-desc"
            className="form-textarea"
            placeholder="Enter product description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="product-price">Price (USD) *</label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="0.00"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="product-category">Category</label>
            <select
              id="product-category"
              className="form-select"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="product-status">Status</label>
          <select
            id="product-status"
            className="form-select"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <div className="delete-confirm">
          <div className="delete-confirm-icon">
            <AlertTriangle size={24} />
          </div>
          <p className="delete-confirm-text">
            Are you sure you want to delete{' '}
            <span className="delete-confirm-name">"{deleteModal?.name}"</span>?
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
