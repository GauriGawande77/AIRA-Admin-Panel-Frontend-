import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { settingsService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getAll();
        setSettings(data);
      } catch (err) {
        addToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(settings);
      addToast('Settings saved successfully', 'success');
    } catch (err) {
      addToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
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
          <h1>Settings</h1>
          <p>Configure your platform preferences and options</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">General</h3>
            <p className="settings-section-desc">Basic platform configuration</p>
          </div>
          <div className="settings-section-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="setting-site-name">Site Name</label>
                <input
                  id="setting-site-name"
                  className="form-input"
                  value={settings.site_name}
                  onChange={e => handleChange('site_name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setting-contact-email">Contact Email</label>
                <input
                  id="setting-contact-email"
                  type="email"
                  className="form-input"
                  value={settings.contact_email}
                  onChange={e => handleChange('contact_email', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="setting-site-desc">Site Description</label>
              <textarea
                id="setting-site-desc"
                className="form-textarea"
                value={settings.site_description}
                onChange={e => handleChange('site_description', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="setting-phone">Support Phone</label>
                <input
                  id="setting-phone"
                  className="form-input"
                  value={settings.support_phone}
                  onChange={e => handleChange('support_phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setting-timezone">Timezone</label>
                <select
                  id="setting-timezone"
                  className="form-select"
                  value={settings.timezone}
                  onChange={e => handleChange('timezone', e.target.value)}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Commerce</h3>
            <p className="settings-section-desc">Payment and pricing configuration</p>
          </div>
          <div className="settings-section-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="setting-currency">Default Currency</label>
                <select
                  id="setting-currency"
                  className="form-select"
                  value={settings.default_currency}
                  onChange={e => handleChange('default_currency', e.target.value)}
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setting-upload-size">Max Upload Size (MB)</label>
                <input
                  id="setting-upload-size"
                  type="number"
                  min="1"
                  max="100"
                  className="form-input"
                  value={settings.max_upload_size}
                  onChange={e => handleChange('max_upload_size', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Feature Toggles</h3>
            <p className="settings-section-desc">Enable or disable platform features</p>
          </div>
          <div className="settings-section-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', background: 'var(--color-bg-surface)', borderRadius: 'var(--border-radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                    User Registration
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Allow new users to create accounts on the platform
                  </div>
                </div>
                <label className="form-toggle">
                  <input
                    type="checkbox"
                    checked={settings.enable_registration}
                    onChange={e => handleChange('enable_registration', e.target.checked)}
                  />
                  <span className="form-toggle-track">
                    <span className="form-toggle-thumb" />
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', background: settings.maintenance_mode ? 'var(--color-warning-bg)' : 'var(--color-bg-surface)', borderRadius: 'var(--border-radius-md)', border: settings.maintenance_mode ? '1px solid rgba(245, 158, 11, 0.3)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                    Maintenance Mode
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    When enabled, the public site shows a maintenance page
                  </div>
                </div>
                <label className="form-toggle">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={e => handleChange('maintenance_mode', e.target.checked)}
                  />
                  <span className="form-toggle-track">
                    <span className="form-toggle-thumb" />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Appearance</h3>
            <p className="settings-section-desc">Customize the look and feel of your platform</p>
          </div>
          <div className="settings-section-body">
            <div className="form-group">
              <label className="form-label" htmlFor="setting-primary-color">Primary Brand Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input
                  id="setting-primary-color"
                  type="color"
                  value={settings.primary_color}
                  onChange={e => handleChange('primary_color', e.target.value)}
                  style={{
                    width: 48,
                    height: 40,
                    padding: 2,
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'var(--color-bg-surface)',
                    cursor: 'pointer',
                  }}
                />
                <input
                  className="form-input"
                  value={settings.primary_color}
                  onChange={e => handleChange('primary_color', e.target.value)}
                  style={{ maxWidth: 140 }}
                />
                <div style={{
                  width: 80,
                  height: 40,
                  borderRadius: 'var(--border-radius-sm)',
                  background: settings.primary_color,
                  border: '1px solid var(--color-border)',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
