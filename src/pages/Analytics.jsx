import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { format } from 'date-fns';
import { BarChart3, Users, LogIn, RefreshCw, Download } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';

export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await base44.entities.AppEvent.list('-created_date', 500);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter);
  const totalOpens = events.filter(e => e.event_type === 'app_open').length;
  const totalLogins = events.filter(e => e.event_type === 'user_login').length;
  const uniqueUsers = new Set(events.filter(e => e.user_email).map(e => e.user_email)).size;

  const exportCSV = () => {
    const rows = [['Date', 'Event', 'User Name', 'User Email', 'Session ID']];
    filtered.forEach(e => {
      rows.push([
        format(new Date(e.created_date), 'yyyy-MM-dd HH:mm'),
        e.event_type,
        e.user_name || '-',
        e.user_email || '-',
        e.session_id || '-',
      ]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finova_analytics.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-space font-bold text-base text-foreground">App Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadEvents} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg px-3 py-1.5">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BarChart3, label: 'App Opens', value: totalOpens, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: LogIn, label: 'Logins', value: totalLogins, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Users, label: 'Unique Users', value: uniqueUsers, color: 'text-gold', bg: 'bg-yellow-500/10' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`glass-card rounded-2xl border border-border ${s.bg} p-4 text-center`}>
                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <p className={`text-2xl font-bold font-space ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {[['all', 'All Events'], ['app_open', 'App Opens'], ['user_login', 'Logins']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === val ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-muted-foreground text-xs">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-muted-foreground text-xs">No events recorded yet.</td></tr>
                ) : filtered.map((e, i) => (
                  <tr key={e.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(e.created_date), 'MMM d, yyyy · HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.event_type === 'user_login' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {e.event_type === 'user_login' ? 'Login' : 'App Open'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{e.user_name || <span className="text-muted-foreground">Guest</span>}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{e.user_email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}