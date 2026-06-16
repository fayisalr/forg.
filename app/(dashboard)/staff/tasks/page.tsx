"use client";
import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Clock, AlertTriangle, Calendar, CheckCircle2, Trash2, X, Play, Check } from 'lucide-react';
import { getTasks, addTask, updateTaskStatus, deleteTask } from '@/app/actions';

interface Task {
  id: string | number;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  deadline: string;
  desc: string;
}

export default function StaffTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Nike India Campaign');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [deadline, setDeadline] = useState('');
  const [desc, setDesc] = useState('');

  const loadTasks = async () => {
    const dbTasks = await getTasks();
    if (dbTasks) {
      setTasks(dbTasks.map((t: any) => ({
        id: t.id,
        title: t.title || 'N/A',
        project: t.project_title || 'General',
        priority: (t.priority || 'Medium') as any,
        status: (t.status === 'in_progress' ? 'In Progress' : (t.status === 'completed' ? 'Completed' : 'Pending')) as any,
        deadline: t.due_date ? new Date(t.due_date).toISOString().split('T')[0] : '',
        desc: t.description || ''
      })));
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dbStatus = status === 'In Progress' ? 'in_progress' : (status === 'Completed' ? 'completed' : 'pending');
    const res = await addTask({
      title,
      description: desc,
      priority,
      status: dbStatus,
      due_date: deadline || new Date().toISOString().split('T')[0],
      project_id: null // optional, fallback to none
    });

    if (res.success) {
      await loadTasks();
      setIsAddModalOpen(false);
      // reset
      setTitle('');
      setPriority('Medium');
      setStatus('Pending');
      setDeadline('');
      setDesc('');
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    const t = tasks.find(item => item.id === id);
    if (!t) return;
    const nextStatusMap: Record<Task['status'], string> = {
      'Pending': 'in_progress',
      'In Progress': 'completed',
      'Completed': 'pending'
    };
    const res = await updateTaskStatus(String(id), nextStatusMap[t.status]);
    if (res.success) {
      await loadTasks();
    }
  };

  const handleMarkComplete = async (id: string | number) => {
    const res = await updateTaskStatus(String(id), 'completed');
    if (res.success) {
      await loadTasks();
    }
  };

  const handleStartProgress = async (id: string | number) => {
    const res = await updateTaskStatus(String(id), 'in_progress');
    if (res.success) {
      await loadTasks();
    }
  };

  const handleDeleteTask = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this personal task?")) {
      const res = await deleteTask(String(id));
      if (res.success) {
        await loadTasks();
      }
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'All') return true;
    return t.status === activeFilter;
  });

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'High': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusBadge = (s: Task['status']) => {
    switch (s) {
      case 'Completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'In Progress': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Pending': return 'text-gray-400 bg-neutral-800 border-white/5';
    }
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Management</h1>
          <p className="text-gray-400 text-sm mt-1">Review assigned client deliverables, track milestones, and log completions.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Task Card
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tasks Done</p>
            <h3 className="text-2xl font-bold text-white">{completedCount} <span className="text-gray-500 text-sm">/ {totalTasks}</span></h3>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 clip-half"></div>
            <span className="text-xs font-bold text-orange-500">{progressPercent}%</span>
          </div>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">In Progress</p>
          <h3 className="text-2xl font-bold text-orange-500">{tasks.filter(t => t.status === 'In Progress').length}</h3>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Pending Start</p>
          <h3 className="text-2xl font-bold text-gray-400">{tasks.filter(t => t.status === 'Pending').length}</h3>
        </div>
      </div>

      {/* Filter Menu */}
      <div className="flex border-b border-white/5 overflow-x-auto">
        {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-3 font-semibold text-sm tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
              activeFilter === filter ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {filter} ({filter === 'All' ? tasks.length : tasks.filter(t => t.status === filter).length})
          </button>
        ))}
      </div>

      {/* Tasks List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-neutral-900 border border-white/5 p-12 text-center text-gray-500 rounded-sm">
            No tasks found in this category.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-neutral-900 border rounded-sm p-6 flex flex-col justify-between transition-all ${
                task.status === 'Completed' ? 'border-white/5 opacity-60' : 'border-white/5 hover:border-orange-500/20'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">{task.project}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{task.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  {task.desc}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> Deadline: {task.deadline}
                </span>

                <div className="flex gap-2">
                  {task.status === 'Pending' && (
                    <button 
                      onClick={() => handleStartProgress(task.id)}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-black" /> Start
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button 
                      onClick={() => handleMarkComplete(task.id)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3 stroke-[3]" /> Complete
                    </button>
                  )}
                  {task.status === 'Completed' && (
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Finished
                    </span>
                  )}
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-red-500 rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create Personal Work Card</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Task Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Edit Scene 05 cut"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-bold">Project</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Deadline Date</label>
                  <input 
                    type="date" 
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Description Details</label>
                <textarea 
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Specify brief action steps..."
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Log Task Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
