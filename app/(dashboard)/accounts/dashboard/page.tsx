import { FileText, Receipt, TrendingDown, TrendingUp } from 'lucide-react';

export default function AccountsDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹124,500", icon: TrendingUp, color: "text-green-500" },
    { label: "Total Expenses", value: "₹32,100", icon: TrendingDown, color: "text-red-500" },
    { label: "Unpaid Invoices", value: "8", icon: Receipt, color: "text-orange-500" },
    { label: "Pending Quotes", value: "3", icon: FileText, color: "text-gray-400" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Accounts Dashboard</h1>
        <button className="bg-orange-500 text-black px-4 py-2 rounded-sm font-bold text-sm tracking-wider uppercase hover:bg-orange-400 transition-colors">
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Client/Vendor</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {[
                { date: "2024-05-15", desc: "Invoice #1042 Payment", client: "Nike", amount: "+₹12,000.00", status: "Completed" },
                { date: "2024-05-14", desc: "Studio Equipment Rental", client: "Adorama", amount: "-₹1,200.00", status: "Completed" },
                { date: "2024-05-12", desc: "Invoice #1043", client: "Vogue", amount: "+₹8,500.00", status: "Pending" },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="p-4 text-gray-400">{tx.date}</td>
                  <td className="p-4">{tx.desc}</td>
                  <td className="p-4">{tx.client}</td>
                  <td className={`p-4 font-bold ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{tx.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-sm ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {tx.status}
                    </span>
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
