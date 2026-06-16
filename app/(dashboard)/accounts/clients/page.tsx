"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Building, Mail, Phone, IndianRupee, Landmark } from 'lucide-react';
import { getClients, addClient, updateClient, deleteClient } from '@/app/actions';

interface AccountClient {
  id: string | number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  gstIn: string;
  creditTerms: string;
  totalInvoiced: number;
  totalPaid: number;
  status: 'Fully Paid' | 'Partially Paid' | 'Overdue' | 'Unpaid';
}

export default function AccountsClients() {
  const [clients, setClients] = useState<AccountClient[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<AccountClient | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstIn, setGstIn] = useState('');
  const [creditTerms, setCreditTerms] = useState('Net 30');
  const [totalInvoiced, setTotalInvoiced] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [status, setStatus] = useState<AccountClient['status']>('Unpaid');

  // Load clients from database on mount
  const loadClients = async () => {
    const dbClients = await getClients();
    if (dbClients) {
      setClients(dbClients.map((c: any) => ({
        id: c.id,
        company: c.company || 'N/A',
        contactName: c.name || 'N/A',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        address: c.address || '',
        gstIn: c.gst_in || '',
        creditTerms: c.credit_terms || 'Net 30',
        totalInvoiced: parseFloat(c.total_invoiced || '0'),
        totalPaid: parseFloat(c.total_paid || '0'),
        status: (c.status || 'Unpaid') as any
      })));
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleOpenAddModal = () => {
    setCompany('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGstIn('');
    setCreditTerms('Net 30');
    setTotalInvoiced(0);
    setTotalPaid(0);
    setStatus('Unpaid');
    setIsAddModalOpen(true);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addClient({
      company,
      contactName,
      email,
      phone,
      address,
      gstIn,
      creditTerms,
      totalInvoiced: Number(totalInvoiced),
      totalPaid: Number(totalPaid),
      status
    });
    if (res.success) {
      await loadClients();
      setIsAddModalOpen(false);
    }
  };

  const handleOpenEditModal = (client: AccountClient) => {
    setCurrentClient(client);
    setCompany(client.company);
    setContactName(client.contactName);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setGstIn(client.gstIn);
    setCreditTerms(client.creditTerms);
    setTotalInvoiced(client.totalInvoiced);
    setTotalPaid(client.totalPaid);
    setStatus(client.status);
    setIsEditModalOpen(true);
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;
    const res = await updateClient(String(currentClient.id), {
      company,
      contactName,
      email,
      phone,
      address,
      gstIn,
      creditTerms,
      totalInvoiced: Number(totalInvoiced),
      totalPaid: Number(totalPaid),
      status
    });
    if (res.success) {
      await loadClients();
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClient = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this client account record?")) {
      const res = await deleteClient(String(id));
      if (res.success) {
        await loadClients();
      }
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Financial Stats
  const totalBilled = clients.reduce((sum, c) => sum + c.totalInvoiced, 0);
  const totalCollected = clients.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Accounts Database</h1>
          <p className="text-gray-400 text-sm mt-1">Manage client billing records, credit terms, GSTIN profiles, and outstanding balances.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Client Account
        </button>
      </div>

      {/* Financial stats summary card row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Receivables</p>
          <p className="text-2xl font-bold text-white">₹{totalBilled.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-green-500">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Outstanding Balance</p>
          <p className="text-2xl font-bold text-yellow-500">₹{totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Overdue Accounts</p>
          <p className="text-2xl font-bold text-red-500">{clients.filter(c => c.status === 'Overdue').length}</p>
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
            {['All', 'Fully Paid', 'Partially Paid', 'Overdue', 'Unpaid'].map((filter) => (
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
                <th className="p-4 font-semibold">Company / Tax Info</th>
                <th className="p-4 font-semibold">Contact Person</th>
                <th className="p-4 font-semibold">Invoiced</th>
                <th className="p-4 font-semibold">Paid</th>
                <th className="p-4 font-semibold">Balance Due</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No client records found.</td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const balance = client.totalInvoiced - client.totalPaid;
                  return (
                    <tr key={client.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold space-y-1">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-500" />
                          {client.company}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                          <Landmark className="w-3 h-3 text-gray-600" /> GSTIN: {client.gstIn || 'N/A'} | Credit: {client.creditTerms}
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5 text-xs text-gray-300">
                        <div className="font-medium">{client.contactName}</div>
                        <div className="text-[10px] text-gray-500">{client.email}</div>
                      </td>
                      <td className="p-4 font-bold text-gray-300">₹{client.totalInvoiced.toLocaleString()}</td>
                      <td className="p-4 font-bold text-green-500">₹{client.totalPaid.toLocaleString()}</td>
                      <td className={`p-4 font-bold ${balance > 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                        ₹{balance.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${
                          client.status === 'Fully Paid' ? 'bg-green-500/10 text-green-500' :
                          client.status === 'Partially Paid' ? 'bg-blue-500/10 text-blue-500' :
                          client.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                          'bg-yellow-500/10 text-yellow-500'
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create Client Billing Account</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@company.com"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-bold font-bold font-bold">GSTIN / Tax ID</label>
                  <input 
                    type="text" 
                    value={gstIn}
                    onChange={(e) => setGstIn(e.target.value)}
                    placeholder="e.g., 32EEEEE5555E5Z5"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Credit Terms</label>
                  <select 
                    value={creditTerms}
                    onChange={(e) => setCreditTerms(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Billing Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street details..."
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-semibold">Total Invoiced (₹)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={totalInvoiced}
                    onChange={(e) => setTotalInvoiced(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-semibold">Total Paid (₹)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={totalPaid}
                    onChange={(e) => setTotalPaid(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Account Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Client Billing Account</h2>
            <form onSubmit={handleEditClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-bold font-bold font-bold">GSTIN / Tax ID</label>
                  <input 
                    type="text" 
                    value={gstIn}
                    onChange={(e) => setGstIn(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Credit Terms</label>
                  <select 
                    value={creditTerms}
                    onChange={(e) => setCreditTerms(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Billing Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-semibold">Total Invoiced (₹)</label>
                  <input 
                    type="number" 
                    value={totalInvoiced}
                    onChange={(e) => setTotalInvoiced(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-semibold">Total Paid (₹)</label>
                  <input 
                    type="number" 
                    value={totalPaid}
                    onChange={(e) => setTotalPaid(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Account Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
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
