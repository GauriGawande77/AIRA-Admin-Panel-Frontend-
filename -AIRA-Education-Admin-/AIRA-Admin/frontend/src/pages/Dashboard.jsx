import { useState, useEffect } from 'react';
import {
  Package,
  GraduationCap,
  Image,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { dashboardService, formatCurrency } from '../services/api';

function StatsCard({ label, value, icon: Icon, color, trend, trendValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    const duration = 1000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">{label}</span>
          <span className="stat-card-value">
            {typeof value === 'string' ? value : displayValue.toLocaleString()}
          </span>
        </div>
        <div className="stat-card-icon">
          <Icon size={22} />
        </div>
      </div>
      {trend && (
        <div className={`stat-card-trend ${trend}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ item }) {
  const iconMap = {
    course: <BookOpen size={16} />,
    product: <Package size={16} />,
    user: <Users size={16} />,
    gallery: <Image size={16} />,
    settings: <Activity size={16} />,
  };

  const colorMap = {
    course: 'var(--color-primary-light)',
    product: 'var(--color-accent-light)',
    user: 'var(--color-success)',
    gallery: '#fbbf24',
    settings: 'var(--color-info)',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--border-radius-md)',
        background: `${colorMap[item.type]}15`,
        color: colorMap[item.type],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {iconMap[item.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {item.action}
        </div>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.target}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
      }}>
        <Clock size={12} />
        {item.time}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Welcome back, Admin</h1>
          <p>Here's what's happening with your platform today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          label="Total Products"
          value={stats?.total_products || 0}
          icon={Package}
          color="purple"
          trend="up"
          trendValue="+12% this month"
        />
        <StatsCard
          label="Total Courses"
          value={stats?.total_courses || 0}
          icon={GraduationCap}
          color="teal"
          trend="up"
          trendValue="+8% this month"
        />
        <StatsCard
          label="Gallery Images"
          value={stats?.total_gallery || 0}
          icon={Image}
          color="blue"
          trend="up"
          trendValue="+5 new uploads"
        />
        <StatsCard
          label="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          color="amber"
          trend="up"
          trendValue="+24% this month"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Revenue Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Revenue Overview</h3>
            <span className="badge badge-success">+18.2%</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {formatCurrency(stats?.revenue || 0)}
              </span>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>this month</span>
            </div>
            {/* Mini bar chart visualization */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 120 }}>
              {[65, 45, 75, 55, 80, 60, 90, 70, 85, 50, 95, 78].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i === 11
                      ? 'var(--gradient-primary)'
                      : 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    minWidth: 0,
                  }}
                />
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
            }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Last 7 days
            </span>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {activity.map(item => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-6)',
        marginTop: 'var(--space-6)',
      }}>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Avg. Order Value</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{formatCurrency(67.50)}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-info-bg)',
              color: 'var(--color-info)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={22} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Active Students</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{(stats?.active_students || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(139, 92, 246, 0.12)',
              color: '#a78bfa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Completion Rate</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>87.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
