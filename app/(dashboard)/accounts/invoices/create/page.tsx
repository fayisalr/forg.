"use client";
import { useState } from 'react';
import { Plus, Trash2, Printer, Download } from 'lucide-react';

export default function CreateInvoice() {
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  
  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-white">Create Invoice</h1>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="bg-neutral-800 text-white px-4 py-2 rounded-sm font-bold text-sm hover:bg-neutral-700 transition-colors flex items-center gap-2 border border-white/10">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="bg-orange-500 text-black px-4 py-2 rounded-sm font-bold text-sm hover:bg-orange-400 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white text-black p-12 rounded-sm shadow-xl min-h-[800px] print:m-0 print:shadow-none">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-4xl font-bold tracking-widest mb-2">FORG<span className="text-orange-600">.</span></h2>
            <p className="text-gray-500 text-sm">123 Media Avenue<br />New York, NY 10001<br />hello@forgstudio.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light text-gray-300 mb-2">INVOICE</h1>
            <p className="font-bold">INV-1045</p>
            <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <input type="text" placeholder="Client Name" className="block w-full border-b border-gray-200 py-1 focus:outline-none focus:border-orange-500 font-bold mb-2" />
            <textarea placeholder="Client Address" rows={2} className="block w-full border-b border-gray-200 py-1 focus:outline-none focus:border-orange-500 text-sm resize-none"></textarea>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Due</h3>
            <input type="date" className="border-b border-gray-200 py-1 focus:outline-none focus:border-orange-500 text-sm text-right" />
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-3 text-sm uppercase tracking-wider">Description</th>
              <th className="text-right py-3 text-sm uppercase tracking-wider w-24">Qty</th>
              <th className="text-right py-3 text-sm uppercase tracking-wider w-32">Rate</th>
              <th className="text-right py-3 text-sm uppercase tracking-wider w-32">Amount</th>
              <th className="w-10 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200 group">
                <td className="py-3">
                  <input type="text" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Service description" className="w-full focus:outline-none bg-transparent" />
                </td>
                <td className="py-3">
                  <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', parseFloat(e.target.value) || 0)} className="w-full focus:outline-none bg-transparent text-right" />
                </td>
                <td className="py-3">
                  <input type="number" value={item.price} onChange={e => updateItem(i, 'price', parseFloat(e.target.value) || 0)} className="w-full focus:outline-none bg-transparent text-right" />
                </td>
                <td className="py-3 text-right font-medium">
                  ₹{(item.qty * item.price).toFixed(2)}
                </td>
                <td className="text-right print:hidden">
                  <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-500 print:hidden mb-12">
          <Plus className="w-4 h-4" /> Add Item
        </button>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
              <span className="font-bold">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 text-sm text-gray-500">
              <span>Tax (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
