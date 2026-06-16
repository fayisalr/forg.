"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, LayoutDashboard, Users, FolderKanban, CheckSquare, FileText, Receipt, FileUp, Settings, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  
  let links: any[] = [];
  let portalName = "";

  if (pathname.startsWith('/admin')) {
    portalName = "Admin Portal";
    links = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Manage Staff', href: '/admin/staff', icon: Users },
      { name: 'Manage Clients', href: '/admin/clients', icon: Users },
      { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { name: 'Manage Invoices', href: '/admin/invoices', icon: Receipt },
      { name: 'Website Content', href: '/admin/content', icon: Settings },
    ];
  } else if (pathname.startsWith('/accounts')) {
    portalName = "Accounts Portal";
    links = [
      { name: 'Dashboard', href: '/accounts/dashboard', icon: LayoutDashboard },
      { name: 'Clients', href: '/accounts/clients', icon: Users },
      { name: 'Finances', href: '/accounts/finances', icon: FileText },
      { name: 'Invoices', href: '/accounts/invoices', icon: Receipt },
    ];
  } else if (pathname.startsWith('/staff')) {
    portalName = "Staff Portal";
    links = [
      { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
      { name: 'Tasks', href: '/staff/tasks', icon: CheckSquare },
      { name: 'Daily Updates', href: '/staff/updates', icon: FileText },
      { name: 'File Uploads', href: '/staff/uploads', icon: FileUp },
    ];
  }

  return (
    <aside className="w-64 bg-neutral-900 border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex flex-col items-start">
          <Link href="/" onClick={onClose} className="flex items-center gap-2 mb-2 group">
            <Camera className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold tracking-widest text-white">FORG<span className="text-orange-500">.</span></span>
          </Link>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{portalName}</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-sm"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={onClose}
              className={twMerge(clsx(
                "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors",
                isActive ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              ))}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link href="/auth/login" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
