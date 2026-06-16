"use client";
import { useState, useEffect } from 'react';
import { FileText, Plus, Clock, BookOpen, Trash2, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { getDailyUpdates, addDailyUpdate, deleteDailyUpdate } from '@/app/actions';

interface WorkLog {
  id: string | number;
  date: string;
  project: string;
  hours: number;
  accomplishments: string;
  challenges: string;
}

export default function DailyUpdates() {
  const [logs, setLogs] = useState<WorkLog[]>([]);

  // Form states
  const [project, setProject] = useState('Nike India Campaign');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('8.0');
  const [accomplishments, setAccomplishments] = useState('');
  const [challenges, setChallenges] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const loadLogs = async () => {
    const dbUpdates = await getDailyUpdates();
    if (dbUpdates) {
      setLogs(dbUpdates.map((u: any) => ({
        id: u.id,
        date: u.date ? (u.date instanceof Date ? u.date.toISOString().split('T')[0] : String(u.date).split('T')[0]) : '',
        project: 'General Workspace', // default project name since updates doesn't store project relation directly
        hours: parseFloat(u.hours_worked || '0'),
        accomplishments: u.update_text || '',
        challenges: 'None' // placeholder / fallback
      })));
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accomplishments.trim()) return;

    const res = await addDailyUpdate(undefined, accomplishments, parseFloat(hours));
    if (res.success) {
      await loadLogs();
      setAccomplishments('');
      setChallenges('');
      setNotification("Daily work log submitted successfully to database!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteLog = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      const res = await deleteDailyUpdate(String(id));
      if (res.success) {
        await loadLogs();
      }
    }
  };

  // Calculations
  const totalHoursLogged = logs.reduce((acc, curr) => acc + curr.hours, 0);
  const totalSubmissions = logs.length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Work Updates</h1>
          <p className="text-gray-400 text-sm mt-1">Submit your daily studio achievements and log your workload hours.</p>
        </div>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-orange-500 text-black px-4 py-3 rounded-sm font-semibold text-sm shadow-lg z-50 flex items-center gap-2">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats and Submission Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Hours Logged</p>
              <h3 className="text-3xl font-bold text-white">{totalHoursLogged}h</h3>
            </div>
            <Clock className="w-8 h-8 text-orange-500/20" />
          </div>

          <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Submissions Count</p>
              <h3 className="text-3xl font-bold text-white">{totalSubmissions}</h3>
            </div>
            <FileText className="w-8 h-8 text-orange-500/20" />
          </div>

          <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
            <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Notice to Staff</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Updates should be submitted by the end of each working day. Submissions are synced directly to the Admin Dashboard for project progress reviews and payroll verification.
            </p>
          </div>
        </div>

        {/* Right Column: Logging Form */}
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Log Today's Work Accomplishments</h2>
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Log Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Associate Project</label>
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Nike India Campaign">Nike India Campaign</option>
                  <option value="Vogue Summer Shoot">Vogue Summer Shoot</option>
                  <option value="BMW M5 Cinematic Reel">BMW M5 Cinematic Reel</option>
                  <option value="Coca-Cola Commercial">Coca-Cola Commercial</option>
                  <option value="Reebok Z-Run Ad">Reebok Z-Run Ad</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Hours Worked</label>
                <input 
                  type="number" 
                  step="0.5" 
                  min={0.5} 
                  max={24}
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="8.0"
                  className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">What did you accomplish?</label>
              <textarea 
                rows={4} 
                required
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                placeholder="Describe specific tasks completed..."
                className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Challenges / Blockers Encountered (Optional)</label>
              <input 
                type="text"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="e.g., waiting on assets from colorist, hardware render delays..."
                className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button 
              type="submit"
              className="bg-orange-500 text-black px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
            >
              Submit Daily Update
            </button>
          </form>
        </div>

      </div>

      {/* Historical Submissions Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" /> Log Submission History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                <th className="p-4 font-semibold w-32">Date</th>
                <th className="p-4 font-semibold w-48">Project</th>
                <th className="p-4 font-semibold w-24">Hours</th>
                <th className="p-4 font-semibold">Accomplishments</th>
                <th className="p-4 font-semibold">Challenges / Blockers</th>
                <th className="p-4 font-semibold text-right w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No work updates logged yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-gray-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" /> {log.date}
                    </td>
                    <td className="p-4 font-medium text-orange-500">{log.project}</td>
                    <td className="p-4 font-bold">{log.hours} hrs</td>
                    <td className="p-4 text-gray-300 leading-relaxed text-xs">{log.accomplishments}</td>
                    <td className="p-4 text-xs text-gray-400">
                      {log.challenges !== 'None' ? (
                        <span className="flex items-start gap-1 text-yellow-500/80">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {log.challenges}
                        </span>
                      ) : (
                        <span className="text-gray-600">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-red-500 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
