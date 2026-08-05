import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-bold text-lg text-secondary">Member Portal</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center space-x-3 px-3 py-2 text-primary bg-emerald-50 rounded-md">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
            <Users className="h-5 w-5" />
            <span className="font-medium">My Team</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Paper Submission</span>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2 text-error hover:bg-red-50 rounded-md cursor-pointer">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              JD
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

export default DashboardLayout;
