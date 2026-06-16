"use client";
import { useState } from 'react';
import { Plus, Landmark, ArrowUpRight, ArrowDownRight, FileText, Search, Trash2, X, AlertCircle } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  entity: string;
  category: 'Project Revenue' | 'Equipment Rental' | 'Studio Rent' | 'Utilities' | 'Payroll' | 'Software Subscription' | 'Taxes';
  type: 'Income' | 'Expense';
  amount: number;
  status: 'Completed' | 'Pending';
}

export default function AccountsFinances() {
  const [txs, setTxs] = useState<Transaction[]>([
    { id: 1, date: "2026-06-15", desc: "Invoice #1043 Payment", entity: "Nike India", category: "Project Revenue", type: "Income", amount: 12000, status: "Completed" },
    { id: 2, date: "2026-06-14", desc: "Red V-Raptor Camera Hire", entity: "Adorama Rentals", category: "Equipment Rental", type: "Expense", amount: 1800, status: "Completed" },
    { id: 3, date: "2026-06-12", desc: "Invoice #1044 Partial Payment", entity: "Adidas Group", category: "Project Revenue", type: "Income", amount: 10000, status: "Completed" },
    { id: 4, date: "2026-06-10", desc: "Adobe Creative Cloud License", entity: "Adobe Systems", category: "Software Subscription", type: "Expense", amount: 250, status: "Completed" },
    { id: 5, date: "2026-06-08", desc: "Studio Electricity Bill", entity: "State Electricity Board", category: "Utilities", type: "Expense", amount: 480, status: "Completed" },
    { id: 6, date: "2026-06-05", desc: "Colorist Contract Work - Nike Reel", entity: "Rohan Das", category: "Payroll", type: "Expense", amount: 2000, status: "Completed" },
    { id: 7, date: "2026-06-01", desc: "Invoice #1042 Payment", entity: "Reebok Fitness", category: "Project Revenue", type: "Income", amount: 12800, status: "Completed" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [desc, setDesc] = useState('');
  const [entity, setEntity] = useState('');
  const [category, setCategory] = useState<Transaction['category']>('Project Revenue');
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'Completed' | 'Pending'>('Completed');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleLogTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !entity.trim() || !amount) return;

    const newTx: Transaction = {
      id: Date.now(),
      date,
      desc,
      entity,
      category,
      type,
      amount: parseFloat(amount) || 0,
      status
    };

    setTxs([newTx, ...txs]);
    setIsAddModalOpen(false);

    // reset
    setDesc('');
    setEntity('');
    setAmount('');
    setStatus('Completed');
    setCategory('Project Revenue');
    setType('Income');
  };

  const handleDeleteTx = (id: number) => {
    if (confirm("Are you sure you want to delete this transaction record?")) {
      setTxs(txs.filter(t => t.id !== id));
    }
  };

  const filteredTxs = txs.filter(t => {
    const matchesSearch = t.desc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Financial metrics
  const totalIncome = txs.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = txs.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMarginPercent = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Ledger</h1>
          <p className="text-gray-400 text-sm mt-1">Audit credit and debit transactions, log operating expenses, and generate reports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Log Transaction
          </button>
          <button 
            onClick={() => alert("Simulating PDF financial report generation...")}
            className="bg-neutral-800 text-white px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-neutral-700 transition-colors flex items-center gap-2 border border-white/10"
          >
            <FileText className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Finance analytics dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
          </div>
          <ArrowUpRight className="w-8 h-8 text-green-500/20" />
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-500">₹{totalExpense.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
          </div>
          <ArrowDownRight className="w-8 h-8 text-red-500/20" />
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Net Cash Flow</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-red-500'}`}>
              ₹{netProfit.toLocaleString(undefined, {minimumFractionDigits:2})}
            </p>
          </div>
          <Landmark className="w-8 h-8 text-orange-500/20" />
        </div>
        <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Net Profit Margin</p>
            <p className="text-2xl font-bold text-orange-500">{profitMarginPercent}%</p>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-orange-500/10 flex items-center justify-center">
            <div className="text-[10px] font-bold text-orange-500">ROI</div>
          </div>
        </div>
      </div>

      {/* Cash Flow Visual Bar Chart */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs text-gray-400">Cash Flow Proportions</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            <span>Income vs Expense Margin</span>
            <span>Ratio: {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}% expenses</span>
          </div>
          <div className="w-full bg-black h-4 rounded-sm overflow-hidden flex border border-white/5">
            <div className="bg-green-500 h-full transition-all" style={{ width: `${totalIncome > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 50}%` }} title="Income"></div>
            <div className="bg-red-500 h-full transition-all" style={{ width: `${totalIncome > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 50}%` }} title="Expenses"></div>
          </div>
          <div className="flex gap-4 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-green-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Credits (Income)</span>
            <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Debits (Expenses)</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table List */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search ledger..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-white/10 rounded-sm px-4 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
            <div className="flex gap-2">
              {['All', 'Income', 'Expense'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                    typeFilter === filter 
                      ? 'bg-orange-500 text-black border-orange-500 font-bold' 
                      : 'bg-black text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                <th className="p-4 font-semibold w-32">Date</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Entity (Client/Vendor)</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No transactions recorded.</td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs text-gray-400 font-medium">{tx.date}</td>
                    <td className="p-4 font-semibold text-gray-200">{tx.desc}</td>
                    <td className="p-4 text-gray-300">{tx.entity}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-neutral-800 text-[10px] font-bold text-gray-400 border border-white/5 rounded-sm">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`p-4 font-bold text-base ${tx.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
                        tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteTx(tx.id)}
                        className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-red-500 rounded transition-colors"
                        title="Remove transaction"
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

      {/* Log Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Log Finance Transaction</h2>
            
            <form onSubmit={handleLogTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Transaction Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Flow Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Income">Income (Credit)</option>
                    <option value="Expense">Expense (Debit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Camera Gear Rental, Office Rent"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Entity (Client/Vendor)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Nike, Adobe, Rohan"
                    value={entity}
                    onChange={(e) => setEntity(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold font-semibold">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Project Revenue">Project Revenue</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Studio Rent">Studio Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Software Subscription">Software Subscription</option>
                    <option value="Taxes">Taxes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Save Log Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
