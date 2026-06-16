"use client";
import { useState } from 'react';
import { Plus, CheckSquare, Clock, AlertTriangle, Calendar, CheckCircle2, Trash2, X, Play, Check } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  deadline: string;
  desc: string;
}

export default function StaffTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Color grade Scene 04", project: "Nike India Campaign", priority: "High", status: "In Progress", deadline: "2026-06-20", desc: "Correct exposure offsets and match color profile across multi-camera shoots." },
    { id: 2, title: "Export final 4K masters", project: "Nike India Campaign", priority: "High", status: "Pending", deadline: "2026-06-24", desc: "Render final deliverables in ProRes 422 HQ format with stereo sound syncing." },
    { id: 3, title: "Retouch portrait batch", project: "Vogue Summer Shoot", priority: "Medium", status: "Pending", deadline: "2026-06-25", desc: "Perform skin retouching, background cleaning, and contrast adjustments for 15 shots." },
    { id: 4, title: "Audio Mix down & Mastering", project: "Reebok Z-Run Ad", priority: "High", status: "Completed", deadline: "2026-06-12", desc: "Sync voiceover files, clean frequency noise, and master final background track output." },
    { id: 5, title: "Storyboard Draft V2", project: "Coca-Cola Commercial", priority: "Low", status: "Pending", deadline: "2026-07-02", desc: "Incorporate client revisions to scene 3 and draw additional keyframes." }
  ]);

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Nike India Campaign');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [deadline, setDeadline] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now(),
      title,
      project,
      priority,
      status,
      deadline: deadline || new Date().toISOString().split('T')[0],
      desc
    };
    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);

    // reset
    setTitle('');
    setPriority('Medium');
    setStatus('Pending');
    setDeadline('');
    setDesc('');
  };

  const handleToggleStatus = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatusMap: Record<Task['status'], Task['status']> = {
          'Pending': 'In Progress',
          'In Progress': 'Completed',
          'Completed': 'Pending'
        };
        return { ...t, status: nextStatusMap[t.status] };
      }
      return t;
    }));
  };

  const handleMarkComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  const handleStartProgress = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'In Progress' } : t));
  };

  const handleDeleteTask = (id: number) => {
    if (confirm("Are you sure you want to delete this personal task?")) {
      setTasks(tasks.filter(t => t.id !== id));
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
