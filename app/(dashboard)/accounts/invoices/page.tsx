"use client";
import Link from 'next/link';
import { Plus, Printer, Download, Eye } from 'lucide-react';

export default function InvoicesList() {
  const invoices = [
    { id: "INV-1044", client: "Adidas", date: "2024-05-16", amount: "₹5,200.00", status: "Draft" },
    { id: "INV-1043", client: "Vogue", date: "2024-05-12", amount: "₹8,500.00", status: "Sent" },
    { id: "INV-1042", client: "Nike", date: "2024-05-01", amount: "₹12,000.00", status: "Paid" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Invoices</h1>
        <Link href="/accounts/invoices/create" className="bg-orange-500 text-black px-4 py-2 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Link>
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Invoice #</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Issue Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="p-4 font-bold">{inv.id}</td>
                  <td className="p-4">{inv.client}</td>
                  <td className="p-4 text-gray-400">{inv.date}</td>
                  <td className="p-4">{inv.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-sm 
                      ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 
                        inv.status === 'Sent' ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-gray-500/10 text-gray-400'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-gray-400 hover:text-white" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-white" title="Download PDF"><Download className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-white" title="Print"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
