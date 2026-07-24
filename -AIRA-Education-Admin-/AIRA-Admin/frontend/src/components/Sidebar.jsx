import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  GraduationCap,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { section: 'Main' },
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Management' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/courses', icon: GraduationCap, label: 'Courses' },
  { path: '/gallery', icon: Image, label: 'Gallery' },
  { section: 'System' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle }) {
  const { logout, user } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">A</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">AIRA Admin</span>
          <span className="sidebar-brand-tagline">Education Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={`section-${index}`} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-link-icon">
                <Icon size={20} />
              </span>
              <span className="sidebar-link-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </div>
        )}
        <button
          className="sidebar-link"
          onClick={onToggle}
          style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'var(--font-family)' }}
        >
          <span className="sidebar-link-icon">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </span>
          <span className="sidebar-link-text">Collapse</span>
        </button>
        <button
          className="sidebar-link"
          onClick={logout}
          style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'var(--font-family)', color: 'var(--color-danger)' }}
        >
          <span className="sidebar-link-icon">
            <LogOut size={20} />
          </span>
          <span className="sidebar-link-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}
