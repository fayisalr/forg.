"use client";
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Phone, Mail, Building, IndianRupee } from 'lucide-react';

interface Client {
  id: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  projectsCount: number;
  totalBilled: string;
  status: 'Active' | 'Inactive';
}

export default function ManageClients() {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, company: "Nike India", contactName: "Rahul Sharma", email: "rahul@nike.com", phone: "+91 98765 43210", projectsCount: 4, totalBilled: "₹24,500.00", status: "Active" },
    { id: 2, company: "Adidas Group", contactName: "Priya Nair", email: "priya@adidas.com", phone: "+91 98765 43211", projectsCount: 3, totalBilled: "₹18,200.00", status: "Active" },
    { id: 3, company: "Puma Sports", contactName: "Kabir Singh", email: "kabir@puma.com", phone: "+91 98765 43212", projectsCount: 0, totalBilled: "₹0.00", status: "Inactive" },
    { id: 4, company: "Reebok Fitness", contactName: "Anya Malhotra", email: "anya@reebok.com", phone: "+91 98765 43213", projectsCount: 2, totalBilled: "₹12,800.00", status: "Active" },
    { id: 5, company: "Coca-Cola Co.", contactName: "Vikram Sen", email: "vikram@coca-cola.com", phone: "+91 98765 43214", projectsCount: 1, totalBilled: "₹9,500.00", status: "Active" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [totalBilled, setTotalBilled] = useState('₹0.00');

  const handleOpenAddModal = () => {
    setCompany('');
    setContactName('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setTotalBilled('₹0.00');
    setIsAddModalOpen(true);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Date.now(),
      company,
      contactName,
      email,
      phone,
      projectsCount: 0,
      totalBilled,
      status
    };
    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (client: Client) => {
    setCurrentClient(client);
    setCompany(client.company);
    setContactName(client.contactName);
    setEmail(client.email);
    setPhone(client.phone);
    setStatus(client.status);
    setTotalBilled(client.totalBilled);
    setIsEditModalOpen(true);
  };

  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;
    setClients(clients.map(c => c.id === currentClient.id ? {
      ...c,
      company,
      contactName,
      email,
      phone,
      status,
      totalBilled
    } : c));
    setIsEditModalOpen(false);
  };

  const handleDeleteClient = (id: number) => {
    if (confirm("Are you sure you want to delete this client? All history of this client will be removed from this view.")) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Clients</h1>
          <p className="text-gray-400 text-sm mt-1">Directory of studio clients, project metrics, and total contracts.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Client
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Clients</p>
          <p className="text-2xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Active Accounts</p>
          <p className="text-2xl font-bold text-green-500">{clients.filter(c => c.status === 'Active').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-400">{clients.filter(c => c.status === 'Inactive').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Value</p>
          <p className="text-2xl font-bold text-orange-500">
            ₹{clients.reduce((acc, curr) => acc + Number(curr.totalBilled.replace(/[^0-9.-]+/g,"")), 0).toLocaleString()}
          </p>
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
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500 text-sm transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['All', 'Active', 'Inactive'].map((filter) => (
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

        {/* Client Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Contact Person</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Projects</th>
                <th className="p-4 font-semibold">Billed Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No clients found matching criteria.</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-orange-500" />
                        {client.company}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{client.contactName}</td>
                    <td className="p-4 space-y-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-500" /> {client.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-500" /> {client.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-neutral-800 text-gray-300 rounded-sm text-xs font-semibold">
                        {client.projectsCount} Active
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-orange-500">{client.totalBilled}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${
                        client.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(client)}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
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

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Nike India"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Contact Person</label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g., Rahul Sharma"
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
                  placeholder="rahul@company.com"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
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
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Initial Contract Billed</label>
                  <input 
                    type="text" 
                    value={totalBilled}
                    onChange={(e) => setTotalBilled(e.target.value)}
                    placeholder="₹0.00"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Add Client
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Client Details</h2>
            <form onSubmit={handleEditClient} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Contact Person</label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
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
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Total Contracts Billed</label>
                  <input 
                    type="text" 
                    value={totalBilled}
                    onChange={(e) => setTotalBilled(e.target.value)}
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
