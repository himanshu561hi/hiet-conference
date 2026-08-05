import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileCheck, Search, Bell } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <span className="font-bold text-lg text-emerald-400">Admin Portal</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center space-x-3 px-3 py-2 text-white bg-emerald-600 rounded-md">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md cursor-pointer">
            <Users className="h-5 w-5" />
            <span className="font-medium">Teams</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md cursor-pointer">
            <FileCheck className="h-5 w-5" />
            <span className="font-medium">Registrations</span>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="h-8 w-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
