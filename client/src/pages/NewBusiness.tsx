import React from "react";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const NewBusiness: React.FC = () => {
  const { todayRegistrations, syncData, isOnline } = useAppContext();

  const handleSubmitAllToMainOffice = () => {
    if (!isOnline) {
      alert("You are currently offline. Please connect to the internet to submit data.");
      return;
    }
    
    syncData();
    alert("All new business submissions have been sent to the main office!");
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#424242]">New Business</h2>
        <span className="bg-primary text-white px-3 py-1 rounded-full">
          {todayRegistrations.length}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Info className="text-blue-500 mr-2 h-5 w-5" />
            <div>
              <p className="text-sm text-[#424242]">
                These registrations are saved locally. Submit them to the main office when you're online.
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mb-4"
          onClick={handleSubmitAllToMainOffice}
          disabled={!isOnline || todayRegistrations.length === 0}
        >
          <span className="flex items-center justify-center">
            <span className="material-icons mr-2">cloud_upload</span>
            Submit All to Main Office
          </span>
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {todayRegistrations.length === 0 ? (
            <div className="text-center py-4 text-[#9e9e9e]">
              No clients registered today
            </div>
          ) : (
            todayRegistrations.map((client) => (
              <div 
                key={client.id} 
                className="border-b last:border-b-0 pb-4 mb-4 last:mb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-lg">{client.fullName}</p>
                    <p className="text-sm text-[#9e9e9e]">{client.policyNumber}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-[#4CAF50]">
                      {formatCurrency(client.premiumAmount / 100)}
                    </p>
                    <p className="text-xs text-[#9e9e9e]">{client.paymentFrequency}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[#9e9e9e]">Age: <span className="text-[#424242]">{client.age}</span></p>
                  </div>
                  <div>
                    <p className="text-[#9e9e9e]">Gender: <span className="text-[#424242]">{client.gender}</span></p>
                  </div>
                  <div>
                    <p className="text-[#9e9e9e]">Occupation: <span className="text-[#424242]">{client.occupation}</span></p>
                  </div>
                  <div>
                    <p className="text-[#9e9e9e]">Phone: <span className="text-[#424242]">{client.contactNumber}</span></p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-primary mr-2 p-1">
                    <span className="material-icons text-sm">edit</span>
                  </button>
                  <button className="text-[#9e9e9e] p-1">
                    <span className="material-icons text-sm">more_vert</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBusiness;
