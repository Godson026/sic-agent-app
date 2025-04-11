import React from "react";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DailyStatement: React.FC = () => {
  const { todayPayments, syncData, isOnline } = useAppContext();
  
  // Calculate totals
  const totalClients = todayPayments.length;
  const totalAmount = todayPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const handleExport = () => {
    // In a real app, this would export the data to a file
    alert("Statement exported successfully!");
  };
  
  const handleSubmit = () => {
    if (!isOnline) {
      alert("You are currently offline. Please connect to the internet to submit data.");
      return;
    }
    
    syncData();
    alert("Payment statement has been submitted to the main office!");
  };

  return (
    <div className="page-container">
      <h2 className="text-2xl font-bold mb-6 text-[#424242]">Payment Statement</h2>
      
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary to-blue-700 text-white mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg mb-4">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm">Total Clients</p>
              <p className="text-2xl font-bold">{totalClients}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm">Amount Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount / 100)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction List Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-[#424242]">Transaction List</h3>
        <div>
          <Button 
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center"
            onClick={handleExport}
          >
            <span className="material-icons text-sm mr-1">file_download</span>
            Export
          </Button>
        </div>
      </div>
      
      {/* Transaction List */}
      <Card>
        <CardContent className="py-3">
          {todayPayments.length === 0 ? (
            <div className="text-center py-4 text-[#9e9e9e]">
              No transactions today
            </div>
          ) : (
            todayPayments.map((payment) => (
              <div 
                key={payment.id} 
                className="border-b last:border-b-0 py-3"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{payment.clientName}</p>
                    <p className="text-xs text-[#9e9e9e]">{payment.policyNumber}</p>
                    <p className="text-xs text-[#9e9e9e]">{formatTime(new Date(payment.timestamp))}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(payment.amount / 100)}</p>
                    <span className={`text-xs ${payment.paymentMode === 'Cash' ? 'bg-green-100 text-[#4CAF50]' : 'bg-blue-100 text-primary'} px-2 py-1 rounded`}>
                      {payment.paymentMode}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      {/* Submit Button */}
      <Button 
        className="w-full mt-6"
        onClick={handleSubmit}
        disabled={!isOnline || todayPayments.length === 0}
      >
        <span className="flex items-center justify-center">
          <span className="material-icons mr-2">cloud_upload</span>
          Submit to Main Office
        </span>
      </Button>
    </div>
  );
};

export default DailyStatement;
