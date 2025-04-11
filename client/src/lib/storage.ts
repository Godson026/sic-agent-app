import localforage from "localforage";
import { Client, Payment } from "@shared/schema";
import { StorageKeys } from "@/types";
import { generateTempPolicyNumber } from "./utils";

// Initialize LocalForage instances
const clientsStorage = localforage.createInstance({
  name: "sikaplan",
  storeName: "clients"
});

const paymentsStorage = localforage.createInstance({
  name: "sikaplan",
  storeName: "payments"
});

const counterStorage = localforage.createInstance({
  name: "sikaplan",
  storeName: "counters"
});

// Client related functions
export async function getClients(): Promise<Record<string, Client>> {
  try {
    const clients = await clientsStorage.getItem<Record<string, Client>>(StorageKeys.CLIENTS);
    return clients || {};
  } catch (error) {
    console.error("Failed to get clients:", error);
    return {};
  }
}

export async function getClientByPolicyNumber(policyNumber: string): Promise<Client | null> {
  try {
    const clients = await getClients();
    return clients[policyNumber] || null;
  } catch (error) {
    console.error("Failed to get client by policy number:", error);
    return null;
  }
}

export async function saveClient(client: Omit<Client, "id" | "createdAt">): Promise<Client> {
  try {
    const clients = await getClients();
    
    // Create a full client object
    const newClient: Client = {
      ...client,
      id: Date.now(),
      createdAt: new Date()
    };
    
    // Add to clients object with policy number as key
    clients[client.policyNumber] = newClient;
    
    // Save to storage
    await clientsStorage.setItem(StorageKeys.CLIENTS, clients);
    
    return newClient;
  } catch (error) {
    console.error("Failed to save client:", error);
    throw error;
  }
}

// Payment related functions
export async function getPayments(): Promise<Payment[]> {
  try {
    const payments = await paymentsStorage.getItem<Payment[]>(StorageKeys.PAYMENTS);
    return payments || [];
  } catch (error) {
    console.error("Failed to get payments:", error);
    return [];
  }
}

export async function savePayment(payment: Omit<Payment, "id" | "synced">): Promise<Payment> {
  try {
    const payments = await getPayments();
    
    // Create a full payment object
    const newPayment: Payment = {
      ...payment,
      id: Date.now(),
      synced: false
    };
    
    // Add to payments array
    payments.push(newPayment);
    
    // Save to storage
    await paymentsStorage.setItem(StorageKeys.PAYMENTS, payments);
    
    return newPayment;
  } catch (error) {
    console.error("Failed to save payment:", error);
    throw error;
  }
}

// Counter for temporary policy numbers
export async function getNextTempCounter(): Promise<number> {
  try {
    const counter = await counterStorage.getItem<number>(StorageKeys.TEMP_COUNTER) || 0;
    const nextCounter = counter + 1;
    
    // Save the incremented counter
    await counterStorage.setItem(StorageKeys.TEMP_COUNTER, nextCounter);
    
    return nextCounter;
  } catch (error) {
    console.error("Failed to get next temporary counter:", error);
    return 1;
  }
}

export async function generateNextTempPolicyNumber(): Promise<string> {
  const counter = await getNextTempCounter();
  return generateTempPolicyNumber(counter);
}

// Mock data for initial testing
export async function loadMockClients() {
  try {
    const existingClients = await getClients();
    
    // Only load mock data if no clients exist
    if (Object.keys(existingClients).length === 0) {
      const mockClients: Record<string, Client> = {
        "SKP20250411002": {
          id: 1,
          fullName: "Kofi Mensah",
          age: 42,
          gender: "Male",
          occupation: "Taxi Driver",
          contactNumber: "0244123456",
          paymentFrequency: "Daily",
          premiumAmount: 500, // 5.00 GHS (stored in cents)
          policyNumber: "SKP20250411002",
          isTemporary: false,
          createdAt: new Date("2025-04-10T10:00:00")
        },
        "SKP20250411005": {
          id: 2,
          fullName: "Ama Serwaa",
          age: 35,
          gender: "Female",
          occupation: "Market Trader",
          contactNumber: "0201987654",
          paymentFrequency: "Weekly",
          premiumAmount: 1000, // 10.00 GHS
          policyNumber: "SKP20250411005",
          isTemporary: false,
          createdAt: new Date("2025-04-10T11:00:00")
        },
        "SKP20250411007": {
          id: 3,
          fullName: "John Addo",
          age: 28,
          gender: "Male", 
          occupation: "Mechanic",
          contactNumber: "0277889900",
          paymentFrequency: "Weekly",
          premiumAmount: 800, // 8.00 GHS
          policyNumber: "SKP20250411007",
          isTemporary: false,
          createdAt: new Date("2025-04-10T12:00:00")
        },
        "SKP20250411009": {
          id: 4,
          fullName: "Grace Ampofo",
          age: 30,
          gender: "Female",
          occupation: "Teacher",
          contactNumber: "0244567890",
          paymentFrequency: "Monthly",
          premiumAmount: 500, // 5.00 GHS
          policyNumber: "SKP20250411009",
          isTemporary: false,
          createdAt: new Date("2025-04-10T13:00:00")
        },
        "SKP20250411011": {
          id: 5,
          fullName: "Francis Boateng",
          age: 45,
          gender: "Male",
          occupation: "Farmer",
          contactNumber: "0201234567",
          paymentFrequency: "Monthly",
          premiumAmount: 700, // 7.00 GHS
          policyNumber: "SKP20250411011",
          isTemporary: false,
          createdAt: new Date("2025-04-10T14:00:00")
        }
      };
      
      await clientsStorage.setItem(StorageKeys.CLIENTS, mockClients);
    }
  } catch (error) {
    console.error("Failed to load mock clients:", error);
  }
}
