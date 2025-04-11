import React, { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { Loader2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOnline, syncData, loading } = useAppContext();

  const handleSync = () => {
    syncData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-neutral-darker font-medium">Loading app...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col">
      {/* App Header */}
      <div className="bg-primary text-white shadow-md fixed top-0 w-full z-10">
        <div className="max-w-md mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">SIKAPLAN</h1>
            <p className="text-xs text-blue-100">Sales App</p>
          </div>
          <div className="flex items-center">
            <span 
              className={`mr-2 text-xs ${!isOnline ? "syncing-status" : ""}`}
            >
              <span className="bg-green-500 inline-block h-2 w-2 rounded-full mr-1"></span>
              {isOnline ? "Online Mode" : "Offline Mode"}
            </span>
            <button 
              onClick={handleSync}
              className="p-2 rounded-full hover:bg-blue-700"
            >
              <span className="material-icons text-sm">sync</span>
            </button>
            <button className="ml-2 bg-blue-700 p-1 rounded-full">
              <span className="material-icons text-sm">person</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-20 pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
