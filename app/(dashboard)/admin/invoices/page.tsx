"use client";
import { useState } from 'react';
import { Plus, Search, Eye, Download, Printer, Trash2, X, AlertCircle, CheckCircle, TrendingUp, IndianRupee, Clock, ArrowLeft, Save } from 'lucide-react';

interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
}

interface Invoice {
  id: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items?: InvoiceItem[];
  taxRate?: number;
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: "INV-1044", 
      client: "Adidas Group", 
      issueDate: "2026-06-12", 
      dueDate: "2026-07-12", 
      amount: "₹8,500.00", 
      status: "Pending",
      items: [
        { description: "Adidas Originals Fashion Shoot", qty: 1, rate: 5000 },
        { description: "Color Grading & LUT Setups", qty: 1, rate: 2000 },
        { description: "Sound Design & Foley SFX", qty: 1, rate: 1500 }
      ],
      taxRate: 0
    },
    { 
      id: "INV-1043", 
      client: "Nike India", 
      issueDate: "2026-06-05", 
      dueDate: "2026-07-05", 
      amount: "₹12,000.00", 
      status: "Paid",
      items: [
        { description: "Nike Run Commercial Assembly", qty: 1, rate: 10000 },
        { description: "Post Production Deliverables", qty: 1, rate: 2000 }
      ],
      taxRate: 0
    },
    { 
      id: "INV-1042", 
      client: "Reebok Fitness", 
      issueDate: "2026-05-20", 
      dueDate: "2026-06-20", 
      amount: "₹5,200.00", 
      status: "Overdue",
      items: [
        { description: "Reebok Z-Run Ad Assembly", qty: 1, rate: 5200 }
      ],
      taxRate: 0
    },
    { 
      id: "INV-1041", 
      client: "Coca-Cola Co.", 
      issueDate: "2026-05-18", 
      dueDate: "2026-06-18", 
      amount: "₹9,500.00", 
      status: "Paid",
      items: [
        { description: "Coke Refresh Campaign Shoot", qty: 1, rate: 9500 }
      ],
      taxRate: 0
    },
    { 
      id: "INV-1040", 
      client: "Puma Sports", 
      issueDate: "2026-04-10", 
      dueDate: "2026-05-10", 
      amount: "₹6,800.00", 
      status: "Paid",
      items: [
        { description: "Puma Track shoot visual rendering", qty: 1, rate: 6800 }
      ],
      taxRate: 0
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Navigation: 'list' | 'create'
  const [view, setView] = useState<'list' | 'create'>('list');

  // Quick add log modal (small modal)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickClient, setQuickClient] = useState('');
  const [quickIssueDate, setQuickIssueDate] = useState('');
  const [quickDueDate, setQuickDueDate] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickStatus, setQuickStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');

  // Manual bill creator state (full page editor)
  const [billClient, setBillClient] = useState('');
  const [billIssueDate, setBillIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [billDueDate, setBillDueDate] = useState('');
  const [billTaxRate, setBillTaxRate] = useState(0);
  const [billStatus, setBillStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [billItems, setBillItems] = useState<InvoiceItem[]>([
    { description: '', qty: 1, rate: 0 }
  ]);

  // View Invoice modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Add item to manual bill
  const addBillItem = () => {
    setBillItems([...billItems, { description: '', qty: 1, rate: 0 }]);
  };

  // Remove item from manual bill
  const removeBillItem = (index: number) => {
    if (billItems.length === 1) return;
    setBillItems(billItems.filter((_, idx) => idx !== index));
  };

  // Update item field in manual bill
  const updateBillItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...billItems];
    if (field === 'qty') {
      updated[index].qty = Math.max(0, parseInt(value) || 0);
    } else if (field === 'rate') {
      updated[index].rate = Math.max(0, parseFloat(value) || 0);
    } else {
      updated[index].description = value;
    }
    setBillItems(updated);
  };

  // Calculate bill totals
  const billSubtotal = billItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const billTaxAmount = (billSubtotal * billTaxRate) / 100;
  const billTotal = billSubtotal + billTaxAmount;

  // Handle Save Manual Bill
  const handleSaveManualBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billClient) {
      alert("Please specify a Client.");
      return;
    }
    if (billItems.some(item => !item.description.trim())) {
      alert("Please fill in descriptions for all items.");
      return;
    }

    const nextNum = invoices.length > 0 
      ? parseInt(invoices[0].id.split('-')[1]) + 1 
      : 1045;
    
    const newInvoice: Invoice = {
      id: `INV-${nextNum}`,
      client: billClient,
      issueDate: billIssueDate,
      dueDate: billDueDate || billIssueDate,
      amount: `₹${billTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: billStatus,
      items: billItems,
      taxRate: billTaxRate
    };

    setInvoices([newInvoice, ...invoices]);
    setView('list');
    
    // reset manual bill state
    setBillClient('');
    setBillIssueDate(new Date().toISOString().split('T')[0]);
    setBillDueDate('');
    setBillTaxRate(0);
    setBillStatus('Pending');
    setBillItems([{ description: '', qty: 1, rate: 0 }]);
  };

  // Handle Quick Add Invoice Modal
  const handleQuickCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = invoices.length > 0 
      ? parseInt(invoices[0].id.split('-')[1]) + 1 
      : 1045;
    
    const amt = parseFloat(quickAmount.replace(/[^0-9.-]+/g,"")) || 0;

    const newInvoice: Invoice = {
      id: `INV-${nextNum}`,
      client: quickClient,
      issueDate: quickIssueDate,
      dueDate: quickDueDate,
      amount: `₹${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: quickStatus,
      items: [
        { description: "Production / Creative Services Billed", qty: 1, rate: amt }
      ],
      taxRate: 0
    };

    setInvoices([newInvoice, ...invoices]);
    setIsAddModalOpen(false);
    
    // reset quick state
    setQuickClient('');
    setQuickIssueDate('');
    setQuickDueDate('');
    setQuickAmount('');
    setQuickStatus('Pending');
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Finance stats
  const totalBilled = invoices.reduce((acc, inv) => acc + parseFloat(inv.amount.replace(/[^0-9.-]+/g,"")), 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, inv) => acc + parseFloat(inv.amount.replace(/[^0-9.-]+/g,"")), 0);
  const totalPending = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((acc, inv) => acc + parseFloat(inv.amount.replace(/[^0-9.-]+/g,"")), 0);
  const totalOverdue = invoices
    .filter(inv => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + parseFloat(inv.amount.replace(/[^0-9.-]+/g,"")), 0);

  return (
    <div className="space-y-8">
      
      {/* 1. LIST VIEW */}
      {view === 'list' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Invoices Management</h1>
              <p className="text-gray-400 text-sm mt-1">Review invoice collections, trace accounts receivable, and update billing states.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('create')}
                className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Create Bill Manually
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-neutral-800 text-white px-5 py-2.5 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-neutral-700 transition-colors flex items-center gap-2 border border-white/10"
              >
                Quick Add Log
              </button>
            </div>
          </div>

          {/* Finance stats dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Billed</p>
                <p className="text-xl font-bold text-white">₹{totalBilled.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500/20" />
            </div>
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Collected Revenue</p>
                <p className="text-xl font-bold text-green-500">₹{totalPaid.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/20" />
            </div>
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Pending Amount</p>
                <p className="text-xl font-bold text-yellow-500">₹{totalPending.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500/20" />
            </div>
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Overdue Amount</p>
                <p className="text-xl font-bold text-red-500">₹{totalOverdue.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500/20" />
            </div>
          </div>

          {/* Invoice filtering and list table */}
          <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search invoice # or client..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {['All', 'Paid', 'Pending', 'Overdue'].map((filter) => (
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

            {/* Invoice table list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                    <th className="p-4 font-semibold">Invoice ID</th>
                    <th className="p-4 font-semibold">Client</th>
                    <th className="p-4 font-semibold">Issue Date</th>
                    <th className="p-4 font-semibold">Due Date</th>
                    <th className="p-4 font-semibold">Total Amount</th>
                    <th className="p-4 font-semibold">Payment Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">No invoices logged.</td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-gray-300">{inv.id}</td>
                        <td className="p-4 font-medium text-white">{inv.client}</td>
                        <td className="p-4 text-xs text-gray-400">{inv.issueDate}</td>
                        <td className="p-4 text-xs text-gray-400">{inv.dueDate}</td>
                        <td className="p-4 font-bold text-orange-500">{inv.amount}</td>
                        <td className="p-4">
                          <select
                            value={inv.status}
                            onChange={(e) => handleUpdateStatus(inv.id, e.target.value as any)}
                            className={`text-xs font-semibold px-2 py-1 bg-black rounded-sm border cursor-pointer ${
                              inv.status === 'Paid' ? 'border-green-500/20 text-green-500' :
                              inv.status === 'Pending' ? 'border-yellow-500/20 text-yellow-500' :
                              'border-red-500/20 text-red-500'
                            }`}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-3 text-gray-400">
                            <button 
                              onClick={() => setSelectedInvoice(inv)}
                              className="hover:text-white p-1" 
                              title="View Invoice Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => alert(`Downloading PDF for ${inv.id}`)}
                              className="hover:text-white p-1" 
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setTimeout(() => window.print(), 100);
                              }}
                              className="hover:text-white p-1" 
                              title="Print"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteInvoice(inv.id)}
                              className="hover:text-red-500 p-1 transition-colors" 
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
        </>
      )}

      {/* 2. CREATE MANUAL BILL VIEW */}
      {view === 'create' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-2 hover:bg-neutral-900 border border-white/10 rounded text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Bill Manually</h1>
              <p className="text-gray-400 text-sm mt-0.5">Generate a professional, fully-itemized billing document.</p>
            </div>
          </div>

          <form onSubmit={handleSaveManualBill} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Client Details */}
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-4 h-fit">
              <h3 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">Billing Details</h3>
              
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Client Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Nike India"
                  value={billClient}
                  onChange={(e) => setBillClient(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Issue Date</label>
                  <input 
                    type="date" 
                    required
                    value={billIssueDate}
                    onChange={(e) => setBillIssueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Due Date</label>
                  <input 
                    type="date" 
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Tax Rate (%)</label>
                  <input 
                    type="number" 
                    min={0}
                    max={100}
                    value={billTaxRate}
                    onChange={(e) => setBillTaxRate(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Status</label>
                  <select
                    value={billStatus}
                    onChange={(e) => setBillStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Columns: Items Editor */}
            <div className="lg:col-span-2 bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Line Items</h3>
                <button 
                  type="button"
                  onClick={addBillItem}
                  className="bg-black hover:bg-neutral-800 text-orange-500 border border-orange-500/20 px-3 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </button>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                {billItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-end bg-black/40 border border-white/5 p-3 rounded-sm relative group">
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Item Description</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g., Video Editing Services"
                        value={item.description}
                        onChange={(e) => updateBillItem(idx, 'description', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="w-20">
                      <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Qty</label>
                      <input 
                        type="number" 
                        min={1}
                        required
                        value={item.qty}
                        onChange={(e) => updateBillItem(idx, 'qty', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white text-center focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="w-32">
                      <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Rate (₹)</label>
                      <input 
                        type="number" 
                        min={0}
                        required
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => updateBillItem(idx, 'rate', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white text-right focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="w-24 text-right pr-2 pb-2.5 font-bold text-xs text-gray-300">
                      ₹{(item.qty * item.rate).toLocaleString(undefined, {minimumFractionDigits:2})}
                    </div>

                    <button
                      type="button"
                      disabled={billItems.length === 1}
                      onClick={() => removeBillItem(idx)}
                      className="text-gray-500 hover:text-red-500 p-2 disabled:opacity-30 disabled:hover:text-gray-500 pb-2"
                      title="Remove line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="border-t border-white/5 pt-4 flex flex-col items-end space-y-2">
                <div className="w-64 space-y-1.5 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white font-semibold">₹{billSubtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({billTaxRate}%):</span>
                    <span className="text-white font-semibold">₹{billTaxAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-sm text-orange-500 font-bold">
                    <span>Grand Total:</span>
                    <span>₹{billTotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setView('list')}
                  className="bg-black hover:bg-neutral-800 text-white border border-white/10 px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-400 text-black px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Invoice
                </button>
              </div>

            </div>
          </form>
        </div>
      )}

      {/* QUICK INVOICE LOGGER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Quick Invoice Logger</h2>
            <form onSubmit={handleQuickCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Client / Company Name</label>
                <input 
                  type="text" 
                  required
                  value={quickClient}
                  onChange={(e) => setQuickClient(e.target.value)}
                  placeholder="e.g., Nike India"
                  className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Issue Date</label>
                  <input 
                    type="date" 
                    required
                    value={quickIssueDate}
                    onChange={(e) => setQuickIssueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Due Date</label>
                  <input 
                    type="date" 
                    required
                    value={quickDueDate}
                    onChange={(e) => setQuickDueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Billed Amount (₹)</label>
                  <input 
                    type="text" 
                    required
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    placeholder="e.g., 5200.00"
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Initial Status</label>
                  <select 
                    value={quickStatus}
                    onChange={(e) => setQuickStatus(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors mt-4"
              >
                Log Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED VIEW INVOICE DOCUMENT MODAL (PRINTABLE) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white text-black rounded-sm w-full max-w-4xl p-8 sm:p-12 relative shadow-2xl print:shadow-none print:p-0 print:rounded-none">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="absolute right-4 top-4 flex gap-2 print:hidden">
              <button 
                onClick={() => window.print()}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="bg-neutral-200 hover:bg-neutral-300 text-black p-2 rounded-sm transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body */}
            <div>
              <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-widest mb-1 text-black">FORG<span className="text-orange-600">.</span></h2>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Studio 4A, Creative Hub<br />
                    Kochi, Kerala, India<br />
                    hello@forgstudio.com
                  </p>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-light text-gray-400 tracking-wider mb-2">INVOICE</h1>
                  <p className="font-bold text-sm">{selectedInvoice.id}</p>
                  <p className="text-gray-500 text-[11px] mt-1">Date Issued: {selectedInvoice.issueDate}</p>
                  <p className="text-gray-500 text-[11px]">Due Date: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-10">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                <p className="font-bold text-base text-black">{selectedInvoice.client}</p>
                <p className="text-gray-500 text-xs mt-1">Corporate Client Accounts</p>
              </div>

              {/* Items Table */}
              <table className="w-full text-left mb-8 border-collapse">
                <thead>
                  <tr className="border-b-2 border-black text-gray-500 text-xs uppercase font-bold">
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 text-right w-16">Qty</th>
                    <th className="py-2.5 text-right w-28">Rate</th>
                    <th className="py-2.5 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 text-black font-medium">{item.description}</td>
                        <td className="py-3 text-right text-gray-600">{item.qty}</td>
                        <td className="py-3 text-right text-gray-600">₹{item.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="py-3 text-right text-black font-semibold">₹{(item.qty * item.rate).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-black font-medium">Production / Creative Services Billed</td>
                      <td className="py-3 text-right text-gray-600">1</td>
                      <td className="py-3 text-right text-gray-600">{selectedInvoice.amount}</td>
                      <td className="py-3 text-right text-black font-semibold">{selectedInvoice.amount}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Calculations */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    {selectedInvoice.items ? (
                      <span className="font-semibold text-black">
                        ₹{selectedInvoice.items.reduce((s, i) => s + (i.qty * i.rate), 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                      </span>
                    ) : (
                      <span className="font-semibold text-black">{selectedInvoice.amount}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({selectedInvoice.taxRate || 0}%):</span>
                    <span className="font-semibold text-black">
                      {selectedInvoice.items ? (
                        `₹${((selectedInvoice.items.reduce((s, i) => s + (i.qty * i.rate), 0) * (selectedInvoice.taxRate || 0)) / 100).toLocaleString(undefined, {minimumFractionDigits:2})}`
                      ) : (
                        "₹0.00"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-3 text-base font-bold text-black">
                    <span>Total Due:</span>
                    <span>{selectedInvoice.amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-16 border-t border-gray-100 pt-8 text-[11px] text-gray-400">
                <p className="font-semibold text-gray-600 uppercase mb-1">Payment Instructions</p>
                <p>Please send payments to FORG Studio bank accounts within 30 days of the invoice issue date. Support email: accounts@forgstudio.com</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
