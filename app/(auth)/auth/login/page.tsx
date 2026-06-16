"use client";
import { useState, useEffect } from 'react';
import { Camera, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

type PortalRole = 'staff' | 'admin' | 'accounts';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<PortalRole>('staff');
  const [email, setEmail] = useState('staff@forgstudio.com');
  const [password, setPassword] = useState('12345678');
  
  useEffect(() => {
    // Read the query parameters using standard browser APIs to avoid bailing out static generation
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role') as PortalRole;
    if (roleParam === 'admin' || roleParam === 'accounts' || roleParam === 'staff') {
      handleTabChange(roleParam);
    }
  }, []);

  const handleTabChange = (tab: PortalRole) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      setEmail('admin@forgstudio.com');
    } else if (tab === 'accounts') {
      setEmail('accounts@forgstudio.com');
    } else {
      setEmail('staff@forgstudio.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect based on selected active login portal tab
    if (activeTab === 'admin') {
      window.location.href = '/admin/dashboard';
    } else if (activeTab === 'accounts') {
      window.location.href = '/accounts/dashboard';
    } else {
      window.location.href = '/staff/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-white/5 rounded-sm p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <Camera className="w-10 h-10 text-orange-500" />
            <span className="text-3xl font-bold tracking-widest text-white">FORG<span className="text-orange-500">.</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Portal Access</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">Select your workspace role to sign in</p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('staff')}
            className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'staff' 
                ? 'border-orange-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'admin' 
                ? 'border-orange-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('accounts')}
            className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'accounts' 
                ? 'border-orange-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Accounts
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                placeholder="staff@forgstudio.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-500 text-black font-bold py-3.5 rounded-sm hover:bg-orange-400 transition-colors uppercase tracking-widest text-xs mt-4"
          >
            Sign In to {activeTab} Portal
          </button>
        </form>
      </div>
    </div>
  );
}
