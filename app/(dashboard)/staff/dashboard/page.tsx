import { CheckSquare, Clock, FileUp } from 'lucide-react';

export default function StaffDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Staff Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <CheckSquare className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">5</h3>
          <p className="text-gray-400 text-sm">Tasks Pending</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">32h</h3>
          <p className="text-gray-400 text-sm">Logged This Week</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <FileUp className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">12</h3>
          <p className="text-gray-400 text-sm">Files Uploaded Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">My Tasks</h2>
          <div className="space-y-4">
            {[
              { title: "Color grade Scene 04", project: "Nike Campaign", status: "In Progress" },
              { title: "Export final 4K masters", project: "Nike Campaign", status: "Pending" },
              { title: "Retouch portrait batch", project: "Vogue Editorial", status: "Pending" },
            ].map((task, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 bg-black border-white/20 text-orange-500 focus:ring-orange-500" />
                  <div>
                    <h4 className="text-white font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-400">{task.project}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-sm ${task.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-gray-400'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Log Daily Update</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Hours Worked</label>
              <input type="number" step="0.5" className="w-full bg-black border border-white/10 rounded-sm px-4 py-2 text-white focus:border-orange-500 outline-none" placeholder="8.0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">What did you accomplish?</label>
              <textarea rows={4} className="w-full bg-black border border-white/10 rounded-sm px-4 py-2 text-white focus:border-orange-500 outline-none" placeholder="I finished..."></textarea>
            </div>
            <button className="w-full bg-orange-500 text-black font-bold py-3 rounded-sm hover:bg-orange-400 transition-colors text-sm uppercase tracking-wider">
              Submit Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
