export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
};

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));
let backendUnavailable = API_CONFIG.USE_MOCK_API;
let idCounter = 100;
const generateId = () => ++idCounter;

let mockProducts = [
  { id: 1, name: 'Advanced Mathematics Workbook', description: 'Comprehensive workbook covering algebra, calculus, and statistics for university students.', price: 29.99, category: 'Books', status: 'active', image_url: '', created_at: '2026-06-15T10:00:00Z', updated_at: '2026-06-20T14:30:00Z' },
  { id: 2, name: 'Science Lab Equipment Kit', description: 'Complete lab kit with beakers, test tubes, and safety goggles for home experiments.', price: 89.99, category: 'Equipment', status: 'active', image_url: '', created_at: '2026-06-18T08:00:00Z', updated_at: '2026-06-22T11:00:00Z' },
  { id: 3, name: 'Digital Learning Tablet', description: 'Pre-loaded educational tablet with 500+ interactive lessons and parental controls.', price: 199.99, category: 'Electronics', status: 'active', image_url: '', created_at: '2026-06-20T12:00:00Z', updated_at: '2026-06-25T09:00:00Z' },
  { id: 4, name: 'English Grammar Guide', description: 'Step-by-step grammar guide for ESL learners with practice exercises.', price: 15.99, category: 'Books', status: 'inactive', image_url: '', created_at: '2026-06-10T07:00:00Z', updated_at: '2026-06-12T16:00:00Z' },
  { id: 5, name: 'Coding Starter Kit for Kids', description: 'Learn to code with this fun, hands-on kit featuring a programmable robot.', price: 59.99, category: 'Kits', status: 'active', image_url: '', created_at: '2026-06-22T15:00:00Z', updated_at: '2026-06-28T10:00:00Z' },
  { id: 6, name: 'History World Atlas', description: 'Beautifully illustrated atlas covering world history from ancient civilizations to modern era.', price: 34.99, category: 'Books', status: 'active', image_url: '', created_at: '2026-06-25T09:30:00Z', updated_at: '2026-06-30T11:00:00Z' },
];

let mockCourses = [
  { id: 1, title: 'Introduction to Machine Learning', description: 'Learn the fundamentals of ML including supervised and unsupervised learning algorithms.', instructor: 'Dr. Sarah Chen', duration: '12 weeks', price: 149.99, level: 'Intermediate', status: 'published', thumbnail_url: '', created_at: '2026-05-01T08:00:00Z', updated_at: '2026-06-15T14:00:00Z' },
  { id: 2, title: 'Web Development Bootcamp', description: 'Full-stack web development from HTML/CSS to React and Node.js with real-world projects.', instructor: 'Alex Rodriguez', duration: '16 weeks', price: 199.99, level: 'Beginner', status: 'published', thumbnail_url: '', created_at: '2026-05-10T10:00:00Z', updated_at: '2026-06-20T11:00:00Z' },
  { id: 3, title: 'Advanced Data Science with Python', description: 'Deep dive into pandas, NumPy, scikit-learn, and TensorFlow for data analysis and modeling.', instructor: 'Dr. James Park', duration: '10 weeks', price: 179.99, level: 'Advanced', status: 'published', thumbnail_url: '', created_at: '2026-05-15T09:00:00Z', updated_at: '2026-06-25T15:00:00Z' },
  { id: 4, title: 'UI/UX Design Masterclass', description: 'Master Figma, design systems, user research, and create stunning user experiences.', instructor: 'Maria Lopez', duration: '8 weeks', price: 129.99, level: 'Intermediate', status: 'draft', thumbnail_url: '', created_at: '2026-06-01T07:00:00Z', updated_at: '2026-06-28T10:00:00Z' },
  { id: 5, title: 'Digital Marketing Essentials', description: 'SEO, social media marketing, Google Ads, and email marketing strategies for businesses.', instructor: 'Tom Baker', duration: '6 weeks', price: 99.99, level: 'Beginner', status: 'published', thumbnail_url: '', created_at: '2026-06-05T11:00:00Z', updated_at: '2026-06-30T09:00:00Z' },
];

let mockGallery = [
  { id: 1, filename: 'campus_aerial.jpg', original_name: 'Campus Aerial View', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=400&fit=crop', size: 2400000, uploaded_at: '2026-06-10T08:00:00Z' },
  { id: 2, filename: 'library.jpg', original_name: 'University Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=400&fit=crop', size: 1800000, uploaded_at: '2026-06-12T10:00:00Z' },
  { id: 3, filename: 'lab_session.jpg', original_name: 'Science Lab Session', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop', size: 3200000, uploaded_at: '2026-06-15T14:00:00Z' },
  { id: 4, filename: 'classroom.jpg', original_name: 'Modern Classroom', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=400&fit=crop', size: 2100000, uploaded_at: '2026-06-18T09:00:00Z' },
  { id: 5, filename: 'students_collab.jpg', original_name: 'Student Collaboration', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop', size: 2600000, uploaded_at: '2026-06-20T16:00:00Z' },
  { id: 6, filename: 'graduation.jpg', original_name: 'Graduation Day', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&h=400&fit=crop', size: 1900000, uploaded_at: '2026-06-22T11:00:00Z' },
];

let mockSettings = {
  site_name: 'AIRA Education Platform',
  site_description: 'Empowering learners with world-class education',
  contact_email: 'admin@aira-edu.com',
  support_phone: '+1 (555) 123-4567',
  maintenance_mode: false,
  enable_registration: true,
  max_upload_size: '10',
  default_currency: 'USD',
  timezone: 'America/New_York',
  primary_color: '#6366f1',
};

async function request(path, options = {}) {
  if (backendUnavailable) throw new Error('Mock API enabled');

  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('aira_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && !path.includes('/auth/login')) {
      localStorage.removeItem('aira_token');
      localStorage.removeItem('aira_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    throw new Error(payload?.message || `Request failed with ${response.status}`);
  }
  return normalizeAssets(payload);
}

async function backendOrMock(backendCall, mockCall) {
  if (!backendUnavailable) {
    try {
      return await backendCall();
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      backendUnavailable = true;
    }
  }
  await delay();
  return mockCall();
}

function isNetworkError(error) {
  return error instanceof TypeError || error.message === 'Failed to fetch' || error.message === 'Mock API enabled';
}

function normalizeAssets(payload) {
  const base = API_CONFIG.BASE_URL.replace(/\/api$/, '');
  const normalizeItem = item => {
    if (item?.url?.startsWith('/uploads/')) return { ...item, url: `${base}${item.url}` };
    return item;
  };
  return Array.isArray(payload) ? payload.map(normalizeItem) : normalizeItem(payload);
}

export const authService = {
  async login(email, password) {
    return backendOrMock(
      () => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
      () => {
        if ((email === 'admin@platform.com' || email === 'admin@aira.com') && password === 'admin123') {
          return { user: { id: 1, name: 'Admin User', email, role: 'admin' }, token: `mock-jwt-token-${Date.now()}` };
        }
        throw new Error('Invalid email or password');
      }
    );
  },
  async getCurrentUser() {
    return backendOrMock(
      () => request('/auth/me'),
      () => ({ id: 1, name: 'Admin User', email: 'admin@aira.com', role: 'admin' })
    );
  },
  logout() {
    localStorage.removeItem('aira_token');
    localStorage.removeItem('aira_user');
  },
};

export const dashboardService = {
  async getStats() {
    return backendOrMock(
      () => request('/dashboard/stats'),
      () => ({ total_products: mockProducts.length, total_courses: mockCourses.length, total_gallery: mockGallery.length, total_users: 1247, revenue: 45890, active_students: 892 })
    );
  },
  async getRecentActivity() {
    return backendOrMock(
      () => request('/dashboard/activity'),
      () => [
        { id: 1, action: 'New course published', target: 'Introduction to Machine Learning', time: '2 hours ago', type: 'course' },
        { id: 2, action: 'Product updated', target: 'Science Lab Equipment Kit', time: '4 hours ago', type: 'product' },
        { id: 3, action: 'New user registered', target: 'john.doe@example.com', time: '6 hours ago', type: 'user' },
        { id: 4, action: 'Image uploaded', target: 'campus_aerial.jpg', time: '1 day ago', type: 'gallery' },
      ]
    );
  },
};

const _productsCrud = crudService('/products', () => mockProducts, value => { mockProducts = value; }, 'Product not found', 'active');
export const productsService = {
  ..._productsCrud,
  async uploadImage(productId, file) {
    const fd = new FormData();
    fd.append('image', file);
    return backendOrMock(
      () => request(`/products/${productId}/image`, { method: 'POST', body: fd }),
      () => ({ image_url: URL.createObjectURL(file) })
    );
  }
};

// coursesService — CRUD + upload helpers
const _coursesCrud = crudService('/courses', () => mockCourses, value => { mockCourses = value; }, 'Course not found', 'draft');
export const coursesService = {
  ..._coursesCrud,

  /** Upload / replace the course thumbnail (multipart) */
  async uploadThumbnail(courseId, file) {
    const fd = new FormData();
    fd.append('thumbnail', file);
    return backendOrMock(
      () => request(`/courses/${courseId}/thumbnail`, { method: 'POST', body: fd }),
      () => ({ thumbnail_url: URL.createObjectURL(file) })
    );
  },

  /** Get all materials attached to a course */
  async getMaterials(courseId) {
    return backendOrMock(
      () => request(`/courses/${courseId}/materials`),
      () => []
    );
  },

  /** Upload one or more files as course materials (multipart) */
  async uploadMaterials(courseId, files) {
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    return backendOrMock(
      () => request(`/courses/${courseId}/materials`, { method: 'POST', body: fd }),
      () => Array.from(files).map(f => ({
        id: ++idCounter, course_id: courseId,
        material_type: 'document', title: f.name,
        url: URL.createObjectURL(f), file_size_bytes: f.size,
        mime_type: f.type, sort_order: 0, created_at: new Date().toISOString(),
      }))
    );
  },

  /** Add a YouTube URL as a material */
  async addYoutubeUrl(courseId, url, title) {
    return backendOrMock(
      () => request(`/courses/${courseId}/materials`, {
        method: 'POST', body: JSON.stringify({ type: 'youtube', url, title }),
      }),
      () => [{
        id: ++idCounter, course_id: courseId,
        material_type: 'youtube', title: title || 'YouTube Video',
        url, file_size_bytes: 0, mime_type: '', sort_order: 0,
        created_at: new Date().toISOString(),
      }]
    );
  },

  /** Add a text note as a material */
  async addNote(courseId, title, content) {
    return backendOrMock(
      () => request(`/courses/${courseId}/materials`, {
        method: 'POST', body: JSON.stringify({ type: 'note', title, content }),
      }),
      () => [{
        id: ++idCounter, course_id: courseId,
        material_type: 'note', title: title || 'Untitled Note',
        url: '', file_size_bytes: content.length, mime_type: 'text/markdown',
        sort_order: 0, created_at: new Date().toISOString(),
      }]
    );
  },

  /** Delete a single material */
  async deleteMaterial(courseId, materialId) {
    return backendOrMock(
      () => request(`/courses/${courseId}/materials/${materialId}`, { method: 'DELETE' }),
      () => ({ success: true })
    );
  },
};

function crudService(path, getItems, setItems, notFoundMessage, defaultStatus) {
  return {
    async getAll() {
      return backendOrMock(() => request(path), () => [...getItems()]);
    },
    async getById(id) {
      return backendOrMock(
        () => request(`${path}/${id}`),
        () => {
          const item = getItems().find(row => row.id === id);
          if (!item) throw new Error(notFoundMessage);
          return { ...item };
        }
      );
    },
    async create(data) {
      return backendOrMock(
        () => request(path, { method: 'POST', body: JSON.stringify(data) }),
        () => {
          const item = { id: generateId(), ...data, price: parseFloat(data.price) || 0, status: data.status || defaultStatus, image_url: '', thumbnail_url: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          setItems([item, ...getItems()]);
          return { ...item };
        }
      );
    },
    async update(id, data) {
      return backendOrMock(
        () => request(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        () => {
          const items = getItems();
          const index = items.findIndex(row => row.id === id);
          if (index === -1) throw new Error(notFoundMessage);
          const updated = { ...items[index], ...data, price: parseFloat(data.price) || items[index].price, updated_at: new Date().toISOString() };
          setItems(items.map(row => row.id === id ? updated : row));
          return { ...updated };
        }
      );
    },
    async delete(id) {
      return backendOrMock(
        () => request(`${path}/${id}`, { method: 'DELETE' }),
        () => {
          const items = getItems();
          if (!items.some(row => row.id === id)) throw new Error(notFoundMessage);
          setItems(items.filter(row => row.id !== id));
          return { success: true };
        }
      );
    },
  };
}

export const galleryService = {
  async getAll() {
    return backendOrMock(() => request('/gallery'), () => [...mockGallery]);
  },
  async upload(files) {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    return backendOrMock(
      () => request('/gallery/upload', { method: 'POST', body: formData }),
      () => {
        const uploaded = Array.from(files).map(file => ({
          id: generateId(),
          filename: file.name,
          original_name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
          url: URL.createObjectURL(file),
          size: file.size,
          uploaded_at: new Date().toISOString(),
        }));
        mockGallery = [...uploaded, ...mockGallery];
        return uploaded;
      }
    );
  },
  async delete(id) {
    return backendOrMock(
      () => request(`/gallery/${id}`, { method: 'DELETE' }),
      () => {
        mockGallery = mockGallery.filter(image => image.id !== id);
        return { success: true };
      }
    );
  },
};

export const settingsService = {
  async getAll() {
    return backendOrMock(() => request('/settings'), () => ({ ...mockSettings }));
  },
  async update(data) {
    return backendOrMock(
      () => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
      () => {
        mockSettings = { ...mockSettings, ...data };
        return { ...mockSettings };
      }
    );
  },
};

export const formatCurrency = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDate = dateString => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
