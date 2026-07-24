import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, AlertTriangle, Upload, FileText, Video, Image, Link, StickyNote, Trash2, PlayCircle, X, File, Paperclip } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { coursesService, formatCurrency, formatDate, formatFileSize } from '../services/api';
import { useToast } from '../context/ToastContext';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const emptyForm = {
  title: '',
  description: '',
  instructor: '',
  duration: '',
  price: '',
  level: 'Beginner',
  status: 'draft',
};

/* ── Type icon helper ─────────────────────────────────────────────── */
function MaterialIcon({ type, size = 16 }) {
  const map = {
    pdf: <FileText size={size} style={{ color: '#ef4444' }} />,
    document: <File size={size} style={{ color: '#3b82f6' }} />,
    video: <Video size={size} style={{ color: '#8b5cf6' }} />,
    youtube: <PlayCircle size={size} style={{ color: '#ff0000' }} />,
    image: <Image size={size} style={{ color: '#10b981' }} />,
    note: <StickyNote size={size} style={{ color: '#f59e0b' }} />,
  };
  return map[type] || <Paperclip size={size} />;
}

/* ── Tab button component ─────────────────────────────────────────── */
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', border: 'none', cursor: 'pointer',
        borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
        background: 'none', fontWeight: active ? 600 : 400,
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-sm)', transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  /* ── Upload state ───────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'content'
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const loadCourses = async () => {
    try {
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  /* ── Load materials when editing a course and switching to content tab ── */
  const loadMaterials = useCallback(async (courseId) => {
    if (!courseId) return;
    setMaterialsLoading(true);
    try {
      const data = await coursesService.getMaterials(courseId);
      setMaterials(data || []);
    } catch {
      setMaterials([]);
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'content' && editingCourse?.id) {
      loadMaterials(editingCourse.id);
    }
  }, [activeTab, editingCourse, loadMaterials]);

  /* ── Thumbnail preview ──────────────────────────────── */
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFile]);

  const openCreate = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setActiveTab('details');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setMaterials([]);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      price: String(course.price),
      level: course.level,
      status: course.status,
    });
    setActiveTab('details');
    setThumbnailFile(null);
    setThumbnailPreview(course.thumbnail_url || '');
    setMaterials(course.materials || []);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      addToast('Course title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      let savedCourse;
      if (editingCourse) {
        savedCourse = await coursesService.update(editingCourse.id, form);
        addToast('Course updated successfully', 'success');
      } else {
        savedCourse = await coursesService.create(form);
        addToast('Course created successfully', 'success');
      }

      // Upload thumbnail if selected
      const courseId = savedCourse?.id || editingCourse?.id;
      if (thumbnailFile && courseId) {
        try {
          await coursesService.uploadThumbnail(courseId, thumbnailFile);
          addToast('Thumbnail uploaded', 'success');
        } catch {
          addToast('Thumbnail upload failed', 'error');
        }
      }

      setModalOpen(false);
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Failed to save course', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setSaving(true);
    try {
      await coursesService.delete(deleteModal.id);
      addToast('Course deleted successfully', 'success');
      setDeleteModal(null);
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── File uploads ───────────────────────────────────── */
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files?.length) handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (!editingCourse?.id) {
      addToast('Save the course first, then add materials', 'error');
      return;
    }
    setUploading(true);
    try {
      const result = await coursesService.uploadMaterials(editingCourse.id, files);
      setMaterials(prev => [...(result || []), ...prev]);
      addToast(`${result?.length || 0} file(s) uploaded`, 'success');
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddYoutube = async () => {
    if (!youtubeUrl.trim()) { addToast('Enter a YouTube URL', 'error'); return; }
    if (!editingCourse?.id) { addToast('Save the course first', 'error'); return; }
    setUploading(true);
    try {
      const result = await coursesService.addYoutubeUrl(editingCourse.id, youtubeUrl.trim(), youtubeTitle.trim());
      setMaterials(prev => [...(result || []), ...prev]);
      setYoutubeUrl('');
      setYoutubeTitle('');
      addToast('YouTube link added', 'success');
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Failed to add link', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteTitle.trim() && !noteContent.trim()) { addToast('Enter a note title or content', 'error'); return; }
    if (!editingCourse?.id) { addToast('Save the course first', 'error'); return; }
    setUploading(true);
    try {
      const result = await coursesService.addNote(editingCourse.id, noteTitle.trim(), noteContent.trim());
      setMaterials(prev => [...(result || []), ...prev]);
      setNoteTitle('');
      setNoteContent('');
      addToast('Note added', 'success');
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Failed to add note', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!editingCourse?.id) return;
    try {
      await coursesService.deleteMaterial(editingCourse.id, materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      addToast('Material deleted', 'success');
      loadCourses();
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  /* ── Table columns ──────────────────────────────────── */
  const columns = [
    {
      key: 'title',
      label: 'Course Title',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.thumbnail_url ? (
            <img
              src={row.thumbnail_url}
              alt=""
              style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image size={18} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{val}</span>
        </div>
      ),
    },
    { key: 'instructor', label: 'Instructor' },
    {
      key: 'materials_count',
      label: 'Materials',
      render: (val) => (
        <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Paperclip size={12} /> {val || 0}
        </span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (val) => {
        const levelColors = { Beginner: 'badge-success', Intermediate: 'badge-info', Advanced: 'badge-warning' };
        return <span className={`badge ${levelColors[val] || 'badge-primary'}`}>{val}</span>;
      },
    },
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
      render: (val) => {
        const statusColors = { published: 'badge-success', draft: 'badge-warning', archived: 'badge-danger' };
        return <span className={`badge ${statusColors[val] || 'badge-primary'}`}>{val}</span>;
      },
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
          <h1>Courses</h1>
          <p>Manage your educational courses and programs</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        onEdit={openEdit}
        onDelete={(row) => setDeleteModal(row)}
        searchPlaceholder="Search courses..."
      />

      {/* ═══ Create / Edit Modal ═══ */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        size="xl"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </>
        }
      >
        {/* ── Tabs ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 16, gap: 4 }}>
          <TabBtn active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<FileText size={14} />} label="Details" />
          {editingCourse && (
            <TabBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Upload size={14} />} label={`Content & Materials (${materials.length})`} />
          )}
        </div>

        {/* ═══ DETAILS TAB ═══ */}
        {activeTab === 'details' && (
          <>
            {/* Thumbnail upload area */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Course Thumbnail</label>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: 12, borderRadius: 8,
                  border: '1px dashed var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                {thumbnailPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={thumbnailPreview} alt="Thumbnail" style={{ width: 80, height: 60, borderRadius: 6, objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => { setThumbnailFile(null); setThumbnailPreview(''); }}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--color-danger)', border: 'none',
                        color: '#fff', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: 0,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div style={{ width: 80, height: 60, borderRadius: 6, background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={24} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: 'var(--font-size-xs)', padding: '4px 12px' }}
                    onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = e => { if (e.target.files[0]) setThumbnailFile(e.target.files[0]); }; inp.click(); }}
                  >
                    <Upload size={12} /> Choose Image
                  </button>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    PNG, JPG, WebP — max 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="course-title">Course Title *</label>
              <input id="course-title" className="form-input" placeholder="Enter course title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="course-desc">Description</label>
              <textarea id="course-desc" className="form-textarea" placeholder="Enter course description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="course-instructor">Instructor</label>
                <input id="course-instructor" className="form-input" placeholder="Instructor name" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="course-duration">Duration</label>
                <input id="course-duration" className="form-input" placeholder="e.g., 8 weeks" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="course-price">Price (USD)</label>
                <input id="course-price" type="number" step="0.01" min="0" className="form-input" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="course-level">Level</label>
                <select id="course-level" className="form-select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="course-status">Status</label>
              <select id="course-status" className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {!editingCourse && (
              <p style={{ marginTop: 12, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                💡 Save the course first, then switch to the "Content & Materials" tab to upload PDFs, videos, and more.
              </p>
            )}
          </>
        )}

        {/* ═══ CONTENT & MATERIALS TAB ═══ */}
        {activeTab === 'content' && editingCourse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Drag & Drop Upload Zone ─────────────────── */}
            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Upload size={14} /> Upload Files
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: 24, borderRadius: 10,
                  border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: dragOver ? 'rgba(99,102,241,0.06)' : 'var(--color-bg-secondary)',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Upload size={28} style={{ color: dragOver ? 'var(--color-primary)' : 'var(--color-text-muted)', marginBottom: 6 }} />
                <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  {uploading ? 'Uploading…' : 'Drag & drop files here, or click to browse'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  PDF, DOCX, PPT, MP4, MOV, AVI, PNG, JPG, TXT — up to 100 MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.mp4,.mov,.avi,.webm,.png,.jpg,.jpeg,.gif,.webp"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.length) handleFileUpload(e.target.files); e.target.value = ''; }}
                />
              </div>
            </div>

            {/* ── YouTube URL ─────────────────────────────── */}
            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <PlayCircle size={14} style={{ color: '#ff0000' }} /> Add YouTube Video
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" placeholder="YouTube URL" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ flex: 2 }} />
                <input className="form-input" placeholder="Title (optional)" value={youtubeTitle} onChange={e => setYoutubeTitle(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-primary" style={{ padding: '0 16px', whiteSpace: 'nowrap' }} onClick={handleAddYoutube} disabled={uploading}>
                  <Link size={14} /> Add
                </button>
              </div>
            </div>

            {/* ── Notes ───────────────────────────────────── */}
            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <StickyNote size={14} style={{ color: '#f59e0b' }} /> Add Note
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="form-input" placeholder="Note title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
                <textarea className="form-textarea" placeholder="Write your note content here…" rows={3} value={noteContent} onChange={e => setNoteContent(e.target.value)} />
                <div>
                  <button className="btn btn-secondary" onClick={handleAddNote} disabled={uploading} style={{ fontSize: 'var(--font-size-sm)' }}>
                    <StickyNote size={14} /> Add Note
                  </button>
                </div>
              </div>
            </div>

            {/* ── Materials List ───────────────────────────── */}
            <div>
              <label className="form-label" style={{ marginBottom: 8 }}>
                Uploaded Materials ({materials.length})
              </label>

              {materialsLoading ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--color-text-muted)' }}>Loading materials…</div>
              ) : materials.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: 24, borderRadius: 8,
                  background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)',
                }}>
                  <Paperclip size={24} style={{ marginBottom: 4 }} />
                  <p style={{ margin: 0 }}>No materials uploaded yet</p>
                </div>
              ) : (
                <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  {materials.map((mat, idx) => (
                    <div
                      key={mat.id || idx}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px',
                        borderBottom: idx < materials.length - 1 ? '1px solid var(--color-border)' : 'none',
                        background: idx % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <MaterialIcon type={mat.material_type} size={18} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mat.title}
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{mat.material_type}</span>
                          {mat.file_size_bytes > 0 && <span>{formatFileSize(mat.file_size_bytes)}</span>}
                          {mat.created_at && <span>{formatDate(mat.created_at)}</span>}
                        </div>
                      </div>
                      {mat.material_type === 'youtube' && mat.url && (
                        <a href={mat.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>
                          Open ↗
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(mat.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: 4, color: 'var(--color-text-muted)',
                          borderRadius: 4, transition: 'color 0.15s',
                        }}
                        title="Delete material"
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ═══ Delete Confirmation Modal ═══ */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Course"
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
            <span className="delete-confirm-name">"{deleteModal?.title}"</span>?
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            This action cannot be undone. All associated materials will also be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}
