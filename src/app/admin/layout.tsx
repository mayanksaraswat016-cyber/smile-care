'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  UserRound,
  Stethoscope,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Smile,
  Settings,
  Clock,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Slots', href: '/admin/slots', icon: Clock },
  { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { name: 'Prescriptions', href: '/admin/prescriptions', icon: FileText },
  { name: 'Inventory', href: '/admin/inventory', icon: Stethoscope },
  { name: 'Dentists', href: '/admin/dentists', icon: UserRound },
  { name: 'Services', href: '/admin/services', icon: Stethoscope },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // If we are already on the login page, don't redirect
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      // Check for token-based authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Render children directly for login page to avoid showing sidebar/nav
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-700 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Smile size={24} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              SmileCare <span className="text-teal-400">Admin</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                    active
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-900/20'
                      : 'hover:bg-white/5 text-navy-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className={active ? 'text-white' : 'text-navy-300 group-hover:text-teal-400'}
                    />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  {active && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-red-500/10 text-navy-300 hover:text-red-400 transition-all font-semibold text-sm"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-navy-700">Admin Panel</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
