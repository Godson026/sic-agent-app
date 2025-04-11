import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Client, Payment } from "@shared/schema";
import { IAppContext, Tabs } from "@/types";
import { 
  getClients, 
  getPayments, 
  saveClient, 
  savePayment, 
  loadMockClients,
  generateNextTempPolicyNumber
} from "@/lib/storage";
import { isSameDay } from "@/lib/utils";

// Create context with default values
const AppContext = createContext<IAppContext>({
  isOnline: false,
  setIsOnline: () => {},
  activeTab: Tabs.PAYMENT,
  setActiveTab: () => {},
  syncData: async () => {},
  todayRegistrations: [],
  todayPayments: [],
  addClient: async () => ({} as Client),
  addPayment: async () => ({} as Payment),
  clients: {},
  payments: [],
  loading: true
});

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeTab, setActiveTab] = useState<string>(Tabs.PAYMENT);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Load mock client data for testing
        await loadMockClients();
        
        // Load clients and payments from local storage
        const storedClients = await getClients();
        const storedPayments = await getPayments();
        
        setClients(storedClients);
        setPayments(storedPayments);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Filter today's registrations and payments
  const today = new Date();
  const todayRegistrations = Object.values(clients).filter(
    client => client.isTemporary && isSameDay(new Date(client.createdAt), today)
  );
  
  const todayPayments = payments.filter(
    payment => isSameDay(new Date(payment.timestamp), today)
  );

  // Add a new client
  const addClient = async (clientData: Omit<Client, "id" | "createdAt">) => {
    // Generate a temporary policy number if not provided
    if (!clientData.policyNumber) {
      clientData.policyNumber = await generateNextTempPolicyNumber();
    }
    
    const newClient = await saveClient(clientData);
    setClients(prev => ({
      ...prev,
      [newClient.policyNumber]: newClient
    }));
    
    return newClient;
  };

  // Add a new payment
  const addPayment = async (paymentData: Omit<Payment, "id" | "synced">) => {
    const newPayment = await savePayment(paymentData);
    setPayments(prev => [...prev, newPayment]);
    
    return newPayment;
  };

  // Sync data with the server when online
  const syncData = async () => {
    if (!isOnline) return;
    
    try {
      // This would typically send data to your server
      console.log("Syncing data with server...");
      
      // For now, we'll just mark all payments as synced
      const updatedPayments = payments.map(payment => ({
        ...payment,
        synced: true
      }));
      
      setPayments(updatedPayments);
    } catch (error) {
      console.error("Failed to sync data:", error);
    }
  };

  const value: IAppContext = {
    isOnline,
    setIsOnline,
    activeTab,
    setActiveTab,
    syncData,
    todayRegistrations,
    todayPayments,
    addClient,
    addPayment,
    clients,
    payments,
    loading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
