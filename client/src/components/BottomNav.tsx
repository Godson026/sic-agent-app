import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Tabs } from "@/types";

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAppContext();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-[#e0e0e0] z-10">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          <button 
            className={`nav-item ${activeTab === Tabs.PAYMENT ? "active" : "text-[#9e9e9e]"}`}
            onClick={() => handleTabChange(Tabs.PAYMENT)}
          >
            <span className="material-icons">payments</span>
            <span className="text-xs">Payment</span>
          </button>
          <button 
            className={`nav-item ${activeTab === Tabs.REGISTER ? "active" : "text-[#9e9e9e]"}`}
            onClick={() => handleTabChange(Tabs.REGISTER)}
          >
            <span className="material-icons">person_add</span>
            <span className="text-xs">Register</span>
          </button>
          <button 
            className={`nav-item ${activeTab === Tabs.BUSINESS ? "active" : "text-[#9e9e9e]"}`}
            onClick={() => handleTabChange(Tabs.BUSINESS)}
          >
            <span className="material-icons">people</span>
            <span className="text-xs">New Business</span>
          </button>
          <button 
            className={`nav-item ${activeTab === Tabs.STATEMENT ? "active" : "text-[#9e9e9e]"}`}
            onClick={() => handleTabChange(Tabs.STATEMENT)}
          >
            <span className="material-icons">receipt_long</span>
            <span className="text-xs">Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
