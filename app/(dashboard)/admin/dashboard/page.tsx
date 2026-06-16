import { Users, FolderKanban, Receipt, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: "Active Projects", value: "12", icon: FolderKanban },
    { label: "Total Clients", value: "48", icon: Users },
    { label: "Pending Invoices", value: "₹14,500", icon: Receipt },
    { label: "Monthly Revenue", value: "₹42,000", icon: TrendingUp },
  ];

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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                <div>
                  <h4 className="text-white font-medium">Summer Campaign 2024</h4>
                  <p className="text-sm text-gray-400">Client: Nike</p>
                </div>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full">In Progress</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Staff Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-orange-500 font-bold">
                  S{i}
                </div>
                <div>
                  <h4 className="text-white text-sm">John Doe logged 8 hours</h4>
                  <p className="text-xs text-gray-400">"Completed color grading for Nike campaign"</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
