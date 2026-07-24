import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { galleryService, formatFileSize } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const loadImages = async () => {
    try {
      const data = await galleryService.getAll();
      setImages(data);
    } catch (err) {
      addToast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadImages(); }, []);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      addToast('Please select image files only', 'error');
      return;
    }
    setUploading(true);
    try {
      await galleryService.upload(imageFiles);
      addToast(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} uploaded successfully`, 'success');
      loadImages();
    } catch (err) {
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await galleryService.delete(deleteModal.id);
      addToast('Image deleted successfully', 'success');
      setDeleteModal(null);
      loadImages();
    } catch (err) {
      addToast('Failed to delete image', 'error');
    } finally {
      setDeleting(false);
    }
  };

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
          <h1>Gallery</h1>
          <p>Manage your media library and image uploads</p>
        </div>
        <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Drop Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-zone-icon">
          <Upload size={24} />
        </div>
        <p className="upload-zone-text">
          {uploading ? 'Uploading...' : 'Drag & drop images here'}
        </p>
        <p className="upload-zone-hint">
          or click to browse • PNG, JPG, GIF up to 10MB
        </p>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ImageIcon size={28} />
          </div>
          <h3 className="empty-state-title">No images yet</h3>
          <p className="empty-state-desc">
            Upload your first image to get started with your media gallery.
          </p>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Upload Image
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map(img => (
            <div key={img.id} className="gallery-card" onClick={() => setLightbox(img)}>
              <img src={img.url} alt={img.original_name} loading="lazy" />
              <div className="gallery-card-overlay">
                <span className="gallery-card-name">{img.original_name}</span>
                <span className="gallery-card-size">{formatFileSize(img.size)}</span>
              </div>
              <div className="gallery-card-actions">
                <button
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    border: 'none',
                    width: 30,
                    height: 30,
                    padding: 0,
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={(e) => { e.stopPropagation(); setDeleteModal(img); }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <img className="lightbox-image" src={lightbox.url} alt={lightbox.original_name} />
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Image"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
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
            <span className="delete-confirm-name">"{deleteModal?.original_name}"</span>?
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
