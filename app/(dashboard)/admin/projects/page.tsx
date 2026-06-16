"use client";
import { useState } from 'react';
import { Plus, CheckSquare, Clock, Calendar, Users, IndianRupee, Edit, Trash2, X, MoreVertical, CheckCircle2 } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Not Started' | 'In Production' | 'Color Grading' | 'Sound Design' | 'Review' | 'Completed';
  deadline: string;
  budget: string;
  assignedStaff: string[];
  tasks: Task[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Reebok Z-Run Campaign",
      client: "Reebok Fitness",
      status: "In Production",
      deadline: "2026-07-10",
      budget: "₹15,000",
      assignedStaff: ["Arjun Dev", "Neha Sen"],
      tasks: [
        { id: 1, text: "Concept & Storyboard", completed: true },
        { id: 2, text: "Product Shoot", completed: true },
        { id: 3, text: "Rough Cut Editing", completed: false },
        { id: 4, text: "Color Grading", completed: false },
        { id: 5, text: "Audio Mastering", completed: false }
      ]
    },
    {
      id: 2,
      name: "Adidas Originals Fashion Film",
      client: "Adidas Group",
      status: "Color Grading",
      deadline: "2026-06-30",
      budget: "₹22,000",
      assignedStaff: ["Rohan Das", "Simran Kaur"],
      tasks: [
        { id: 1, text: "Visual Moodboard", completed: true },
        { id: 2, text: "Studio Shoot", completed: true },
        { id: 3, text: "Primary Assembly Edit", completed: true },
        { id: 4, text: "Color Color Grading", completed: false },
        { id: 5, text: "Sound Effects & SFX", completed: false }
      ]
    },
    {
      id: 3,
      name: "BMW M5 Cinematic Reel",
      client: "Nike India", // Mocking client
      status: "Review",
      deadline: "2026-06-25",
      budget: "₹35,000",
      assignedStaff: ["Arjun Dev", "Rohan Das", "Neha Sen"],
      tasks: [
        { id: 1, text: "Locations Scouting", completed: true },
        { id: 2, text: "Cinematic Track Shoot", completed: true },
        { id: 3, text: "Sound Sync & SFX", completed: true },
        { id: 4, text: "4K Color Grade", completed: true },
        { id: 5, text: "Client V1 Review", completed: false }
      ]
    },
    {
      id: 4,
      name: "Coca-Cola Refresh Summer Commercial",
      client: "Coca-Cola Co.",
      status: "Not Started",
      deadline: "2026-08-15",
      budget: "₹18,500",
      assignedStaff: ["Neha Sen", "Simran Kaur"],
      tasks: [
        { id: 1, text: "Pre-production Scripting", completed: false },
        { id: 2, text: "Voiceover Casting", completed: false },
        { id: 3, text: "High Speed Camera Shoot", completed: false }
      ]
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals and form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [staffSelected, setStaffSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<Project['status']>('Not Started');
  const [rawTasks, setRawTasks] = useState('Storyboard\nFilming\nEditing');

  const staffOptions = ["Arjun Dev", "Neha Sen", "Rohan Das", "Simran Kaur"];

  const handleToggleTask = (projectId: number, taskId: number) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return p;
    }));
  };

  const handleUpdateStatus = (projectId: number, newStatus: Project['status']) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const taskList = rawTasks.split('\n')
      .filter(t => t.trim() !== '')
      .map((t, idx) => ({ id: idx + 1, text: t.trim(), completed: false }));

    const newProj: Project = {
      id: Date.now(),
      name: projectName,
      client: clientName,
      status,
      deadline,
      budget,
      assignedStaff: staffSelected,
      tasks: taskList
    };

    setProjects([...projects, newProj]);
    setIsAddModalOpen(false);

    // Reset fields
    setProjectName('');
    setClientName('');
    setDeadline('');
    setBudget('');
    setStaffSelected([]);
    setStatus('Not Started');
    setRawTasks('Storyboard\nFilming\nEditing');
  };

  const handleStaffSelectToggle = (name: string) => {
    if (staffSelected.includes(name)) {
      setStaffSelected(staffSelected.filter(s => s !== name));
    } else {
      setStaffSelected([...staffSelected, name]);
    }
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects Management</h1>
          <p className="text-gray-400 text-sm mt-1">Track schedules, assign media staff, edit project pipelines, and review task lists.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900 border border-white/5 p-4 rounded-sm">
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 bg-black border border-white/10 rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
        />

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Not Started', 'In Production', 'Color Grading', 'Sound Design', 'Review', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-orange-500 text-black font-bold' 
                  : 'bg-black text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-neutral-900 border border-white/5 p-12 text-center text-gray-500 rounded-sm">
            No projects found matching the criteria.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const progress = calculateProgress(project.tasks);
            return (
              <div key={project.id} className="bg-neutral-900 border border-white/5 rounded-sm p-6 flex flex-col justify-between hover:border-orange-500/20 transition-all">
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">{project.client}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{project.name}</h3>
                    </div>
                    <select
                      value={project.status}
                      onChange={(e) => handleUpdateStatus(project.id, e.target.value as any)}
                      className={`text-xs font-bold px-3 py-1.5 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer ${
                        project.status === 'Completed' ? 'border-green-500/30 text-green-400' :
                        project.status === 'Review' ? 'border-blue-500/30 text-blue-400' :
                        project.status === 'Not Started' ? 'border-gray-500/30 text-gray-400' :
                        'border-orange-500/30 text-orange-400'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Production">In Production</option>
                      <option value="Color Grading">Color Grading</option>
                      <option value="Sound Design">Sound Design</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Metas */}
                  <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-4 mb-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Deadline</span>
                      <span className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" /> {project.deadline}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Budget</span>
                      <span className="text-xs text-gray-300 flex items-center gap-1 mt-1 font-bold text-orange-500">
                        {project.budget}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Assigned Staff</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.assignedStaff.map((staff, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 bg-white/5 text-[9px] text-gray-400 rounded-sm font-semibold" title={staff}>
                            {staff.split(' ').map(n => n[0]).join('')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-semibold text-gray-400">
                      <span>Production Tasks Progress</span>
                      <span className="text-orange-500 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Checklist Pipeline</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => handleToggleTask(project.id, task.id)}
                          className="flex items-center gap-2 p-2 bg-black border border-white/5 hover:border-white/10 rounded-sm cursor-pointer select-none transition-colors"
                        >
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            onChange={() => {}} // Controlled via parent click
                            className="accent-orange-500 pointer-events-none"
                          />
                          <span className={`text-xs ${task.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-xs text-gray-500 hover:text-red-500 font-semibold tracking-wider uppercase transition-colors"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Reebok Z-Run"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Client</label>
                  <input 
                    type="text" 
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., Reebok India"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Deadline</label>
                  <input 
                    type="date" 
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Budget</label>
                  <input 
                    type="text" 
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., ₹15,000"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Current Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Production">In Production</option>
                    <option value="Color Grading">Color Grading</option>
                    <option value="Sound Design">Sound Design</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold font-bold">Assign Staff</label>
                <div className="flex flex-wrap gap-2">
                  {staffOptions.map((staff, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleStaffSelectToggle(staff)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-semibold border transition-all ${
                        staffSelected.includes(staff) 
                          ? 'bg-orange-500 text-black border-orange-500 font-bold' 
                          : 'bg-black text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {staff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Task Checklist Pipeline (One per line)</label>
                <textarea 
                  rows={4}
                  value={rawTasks}
                  onChange={(e) => setRawTasks(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="Storyboard&#10;Filming&#10;Editing"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
