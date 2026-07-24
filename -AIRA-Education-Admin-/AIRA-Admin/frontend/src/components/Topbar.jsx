import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/courses': 'Courses',
  '/gallery': 'Gallery',
  '/settings': 'Settings',
};

export default function Topbar({ collapsed, onMobileToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU';

  return (
    <header className={`topbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="topbar-toggle" onClick={onMobileToggle} title="Toggle Menu">
          <Menu size={18} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>

        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="topbar-badge" />
        </button>

        <div className="topbar-avatar" title={user?.name || 'Admin'}>
          {initials}
        </div>
      </div>
    </header>
  );
}
