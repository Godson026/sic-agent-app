import React, { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import sikaplanLogo from "@/assets/sikaplan-logo.svg";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOnline, syncData, loading, todayRegistrations, todayPayments } = useAppContext();

  const handleSync = () => {
    syncData();
  };

  // Calculate total amount collected today
  const totalAmount = todayPayments.reduce((sum, payment) => sum + payment.amount, 0) / 100;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f7f0]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-700 font-medium">Loading app...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f7f0] min-h-screen flex flex-col">
      {/* App Header */}
      <div className="bg-primary text-white shadow-md fixed top-0 w-full z-10">
        <div className="max-w-md mx-auto flex items-center justify-between p-3">
          <div className="flex items-center">
            <img src={sikaplanLogo} alt="SIKAPLAN Logo" className="h-8 mr-2" />
          </div>
          <div className="flex items-center">
            <span 
              className={`mr-2 text-xs ${!isOnline ? "syncing-status" : ""}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full mr-1 ${isOnline ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              {isOnline ? "Online Mode" : "Offline Mode"}
            </span>
            <button 
              onClick={handleSync}
              className="p-2 rounded-full hover:bg-green-700"
              title="Sync data"
            >
              <span className="material-icons text-sm">sync</span>
            </button>
            <button className="ml-2 bg-green-700 p-1 rounded-full" title="Agent profile">
              <span className="material-icons text-sm">person</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="mt-16 mx-auto max-w-md w-full px-4">
        <div className="mb-2 bg-white p-3 rounded-lg shadow-md text-center">
          <h2 className="text-gray-600 text-sm font-medium uppercase">AGENT DASHBOARD</h2>
          <p className="text-xs text-gray-500">Sales Representative</p>
          <p className="text-xs text-gray-400">Version 3.0</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg">
            <p className="text-xs font-medium">New Business</p>
            <p className="text-xl font-bold">{todayRegistrations.length}</p>
          </div>
          <div className="bg-purple-500 text-white p-3 rounded-lg">
            <p className="text-xs font-medium">Total Amount</p>
            <p className="text-xl font-bold">GHS {totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-orange-500 text-white p-3 rounded-lg">
            <p className="text-xs font-medium">Offline</p>
            <p className="text-xl font-bold">{!isOnline ? todayRegistrations.length : 0}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pb-20 px-4 max-w-md mx-auto w-full">
        {children}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
