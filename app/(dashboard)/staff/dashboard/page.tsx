"use client";
import { useState, useEffect } from 'react';
import { CheckSquare, Clock, FileUp, Check, Play, CheckCircle2 } from 'lucide-react';
import { getTasks, addDailyUpdate, updateTaskStatus } from '@/app/actions';

interface Task {
  id: string | number;
  title: string;
  project: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export default function StaffDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hours, setHours] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [weeklyHours, setWeeklyHours] = useState(0);

  const loadData = async () => {
    setLoading(true);
    const dbTasks = await getTasks();
    if (dbTasks) {
      setTasks(dbTasks.slice(0, 4).map((t: any) => ({
        id: t.id,
        title: t.title || 'N/A',
        project: t.project_title || 'General',
        status: (t.status === 'in_progress' ? 'In Progress' : (t.status === 'completed' ? 'Completed' : 'Pending')) as any
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || !accomplishment.trim()) return;

    const res = await addDailyUpdate(undefined, accomplishment, parseFloat(hours));
    if (res.success) {
      triggerNotification("Daily update logged successfully in database!");
      setHours('');
      setAccomplishment('');
      // Update local weekly hours summary
      setWeeklyHours(prev => prev + parseFloat(hours));
    } else {
      triggerNotification("Error logging update: " + res.error);
    }
  };

  const handleStartProgress = async (id: string | number) => {
    const res = await updateTaskStatus(String(id), 'in_progress');
    if (res.success) {
      await loadData();
    }
  };

  const handleMarkComplete = async (id: string | number) => {
    const res = await updateTaskStatus(String(id), 'completed');
    if (res.success) {
      await loadData();
    }
  };

  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Staff Dashboard</h1>
      
      {notification && (
        <div className="bg-orange-500 text-black px-4 py-3 rounded-sm font-semibold text-sm mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <CheckSquare className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{pendingTasksCount}</h3>
          <p className="text-gray-400 text-sm">Tasks Pending</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{32 + weeklyHours}h</h3>
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
          <h2 className="text-xl font-bold text-white mb-6 font-bold uppercase tracking-wider text-sm text-orange-500">My Deliverables</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-xs">Loading tasks from database...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500 text-xs">No tasks currently assigned.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border border-white/20 rounded-sm"></div>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-white font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                      <p className="text-xs text-gray-400">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {task.status === 'Pending' && (
                      <button 
                        onClick={() => handleStartProgress(task.id)}
                        className="px-2 py-1 bg-orange-500 hover:bg-orange-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-black" /> Start
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button 
                        onClick={() => handleMarkComplete(task.id)}
                        className="px-2 py-1 bg-green-500 hover:bg-green-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Finish
                      </button>
                    )}
                    {task.status === 'Completed' && (
                      <span className="text-[10px] font-semibold text-green-500">Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6 font-bold uppercase tracking-wider text-sm text-orange-500">Log Daily Update</h2>
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Hours Worked</label>
              <input 
                type="number" 
                step="0.5" 
                min={0}
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-2 text-white focus:border-orange-500 outline-none" 
                placeholder="8.0" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">What did you accomplish?</label>
              <textarea 
                rows={4} 
                required
                value={accomplishment}
                onChange={(e) => setAccomplishment(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-2 text-white focus:border-orange-500 outline-none" 
                placeholder="Completed editing for Campaign Reel..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-orange-500 text-black font-bold py-3 rounded-sm hover:bg-orange-400 transition-colors text-sm uppercase tracking-wider"
            >
              Submit Update to DB
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
