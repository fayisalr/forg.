"use client";
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Briefcase, Mail, CheckCircle, Clock } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'On Location' | 'Busy' | 'On Leave';
  email: string;
  projects: number;
  completedTasks: number;
}

export default function ManageStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "Arjun Dev", role: "Lead Video Editor", status: "Active", email: "arjun@forgstudio.com", projects: 3, completedTasks: 24 },
    { id: 2, name: "Neha Sen", role: "Fashion Photographer", status: "On Location", email: "neha@forgstudio.com", projects: 2, completedTasks: 18 },
    { id: 3, name: "Rohan Das", role: "Colorist & DIT", status: "Busy", email: "rohan@forgstudio.com", projects: 4, completedTasks: 32 },
    { id: 4, name: "Simran Kaur", role: "Sound Designer", status: "On Leave", email: "simran@forgstudio.com", projects: 1, completedTasks: 15 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Video Editor');
  const [status, setStatus] = useState<'Active' | 'On Location' | 'Busy' | 'On Leave'>('Active');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState(0);

  const handleOpenAddModal = () => {
    setName('');
    setRole('Video Editor');
    setStatus('Active');
    setEmail('');
    setProjects(0);
    setIsAddModalOpen(true);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: StaffMember = {
      id: Date.now(),
      name,
      role,
      status,
      email,
      projects: Number(projects) || 0,
      completedTasks: 0
    };
    setStaff([...staff, newMember]);
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (member: StaffMember) => {
    setCurrentMember(member);
    setName(member.name);
    setRole(member.role);
    setStatus(member.status);
    setEmail(member.email);
    setProjects(member.projects);
    setIsEditModalOpen(true);
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;
    setStaff(staff.map(m => m.id === currentMember.id ? {
      ...m,
      name,
      role,
      status,
      email,
      projects: Number(projects)
    } : m));
    setIsEditModalOpen(false);
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff(staff.filter(m => m.id !== id));
    }
  };

  const filteredStaff = staff.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const recentUpdates = [
    { name: "Arjun Dev", update: "Completed rough cut for Reebok Commercial", time: "45 mins ago" },
    { name: "Rohan Das", update: "Primary grading finalized for Adidas short film", time: "2 hours ago" },
    { name: "Neha Sen", update: "Uploaded raw portfolio files from BMW shoot", time: "5 hours ago" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Staff</h1>
          <p className="text-gray-400 text-sm mt-1">Control team profiles, roles, availability, and tasks.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Team</p>
          <p className="text-2xl font-bold text-white">{staff.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Active Now</p>
          <p className="text-2xl font-bold text-green-500">{staff.filter(s => s.status === 'Active').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">On Shoot</p>
          <p className="text-2xl font-bold text-blue-400">{staff.filter(s => s.status === 'On Location').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">On Leave</p>
          <p className="text-2xl font-bold text-gray-400">{staff.filter(s => s.status === 'On Leave').length}</p>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500 text-sm transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['All', 'Active', 'On Location', 'Busy', 'On Leave'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === filter 
                    ? 'bg-orange-500 text-black' 
                    : 'bg-black text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Workload</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No staff members found matching criteria.</td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {member.name}
                    </td>
                    <td className="p-4 text-gray-300">{member.role}</td>
                    <td className="p-4 text-gray-400 text-xs">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-500" /> {member.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                        {member.projects} Projects
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${
                        member.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                        member.status === 'On Location' ? 'bg-blue-500/10 text-blue-500' :
                        member.status === 'Busy' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(member)}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Activity Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Recent Work Updates</h2>
          <div className="space-y-4">
            {recentUpdates.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-orange-500 font-bold">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">"{item.update}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Quick Task Allocation</h2>
            <p className="text-xs text-gray-400 mb-6">Instantly assign a client task to staff members.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Select Staff</label>
                <select className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500">
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Audio Mixing for Commercial"
                  className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => alert("Task assigned successfully!")} 
            className="w-full bg-orange-500 text-black py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-6"
          >
            Assign Task
          </button>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Add Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Arjun Dev"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Role</label>
                <input 
                  type="text" 
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Video Editor"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@forgstudio.com"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Location">On Location</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Active Projects</label>
                  <input 
                    type="number" 
                    min={0}
                    value={projects}
                    onChange={(e) => setProjects(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Add Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Staff Member</h2>
            <form onSubmit={handleEditStaff} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Role</label>
                <input 
                  type="text" 
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Location">On Location</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Active Projects</label>
                  <input 
                    type="number" 
                    min={0}
                    value={projects}
                    onChange={(e) => setProjects(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
