"use client";
import { useState, useEffect } from 'react';
import { Users, FolderKanban, Receipt, TrendingUp } from 'lucide-react';
import { getAdminDashboardStats } from '@/app/actions';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([
    { label: "Active Projects", value: "0", icon: FolderKanban },
    { label: "Total Clients", value: "0", icon: Users },
    { label: "Pending Invoices", value: "₹0", icon: Receipt },
    { label: "Monthly Revenue", value: "₹0", icon: TrendingUp },
  ]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [staffActivity, setStaffActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getAdminDashboardStats();
      if (data) {
        setStats([
          { label: "Active Projects", value: data.stats[0].value, icon: FolderKanban },
          { label: "Total Clients", value: data.stats[1].value, icon: Users },
          { label: "Pending Invoices", value: data.stats[2].value, icon: Receipt },
          { label: "Monthly Revenue", value: data.stats[3].value, icon: TrendingUp },
        ]);
        setRecentProjects(data.recentProjects || []);
        setStaffActivity(data.staffActivity || []);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Recent Projects</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-gray-500">Loading projects...</p>
            ) : recentProjects.length === 0 ? (
              <p className="text-xs text-gray-500">No projects recorded yet.</p>
            ) : (
              recentProjects.map((proj, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                  <div>
                    <h4 className="text-white font-medium">{proj.title}</h4>
                    <p className="text-sm text-gray-400">Client: {proj.client_company || 'Internal'}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full uppercase">
                    {proj.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Staff Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-gray-500">Loading activity...</p>
            ) : staffActivity.length === 0 ? (
              <p className="text-xs text-gray-500">No recent activity logged.</p>
            ) : (
              staffActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-orange-500 font-bold uppercase">
                    {act.staff_name ? act.staff_name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <h4 className="text-white text-sm">{act.staff_name} logged {act.hours_worked} hours</h4>
                    <p className="text-xs text-gray-400">"{act.update_text}"</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto font-mono">
                    {act.date ? new Date(act.date).toLocaleDateString() : 'Today'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
