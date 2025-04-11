import { users, type User, type InsertUser, Client, InsertClient, Payment, InsertPayment } from "@shared/schema";
import { generateTempPolicyNumber } from "../client/src/lib/utils";

// Modify the interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getAllClients(): Promise<Client[]>;
  getClientByPolicyNumber(policyNumber: string): Promise<Client | undefined>;
  createClient(client: Omit<InsertClient, "id" | "createdAt">): Promise<Client>;
  
  // Payment operations
  recordPayment(payment: Omit<InsertPayment, "id" | "synced">): Promise<Payment>;
  getAllPayments(): Promise<Payment[]>;
  getPaymentsByDate(date: string): Promise<Payment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<string, Client>;
  private payments: Payment[];
  private currentUserId: number;
  private currentClientId: number;
  private currentPaymentId: number;
  private tempPolicyNumberCounter: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.payments = [];
    this.currentUserId = 1;
    this.currentClientId = 1;
    this.currentPaymentId = 1;
    this.tempPolicyNumberCounter = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock clients
    const mockClients: Client[] = [
      {
        id: this.currentClientId++,
        fullName: "Kofi Mensah",
        age: 42,
        gender: "Male",
        occupation: "Taxi Driver",
        contactNumber: "0244123456",
        paymentFrequency: "Daily",
        premiumAmount: 500, // 5.00 GHS (stored in cents)
        policyNumber: "SKP20250411002",
        tempPolicyNumber: undefined,
        isTemporary: false,
        createdAt: new Date("2025-04-10T10:00:00")
      },
      {
        id: this.currentClientId++,
        fullName: "Ama Serwaa",
        age: 35,
        gender: "Female",
        occupation: "Market Trader",
        contactNumber: "0201987654",
        paymentFrequency: "Weekly",
        premiumAmount: 1000, // 10.00 GHS
        policyNumber: "SKP20250411005",
        tempPolicyNumber: undefined,
        isTemporary: false,
        createdAt: new Date("2025-04-10T11:00:00")
      },
      {
        id: this.currentClientId++,
        fullName: "John Addo",
        age: 28,
        gender: "Male", 
        occupation: "Mechanic",
        contactNumber: "0277889900",
        paymentFrequency: "Weekly",
        premiumAmount: 800, // 8.00 GHS
        policyNumber: "SKP20250411007",
        tempPolicyNumber: undefined,
        isTemporary: false,
        createdAt: new Date("2025-04-10T12:00:00")
      }
    ];
    
    // Add mock clients to the map
    mockClients.forEach(client => {
      this.clients.set(client.policyNumber, client);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Client operations
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClientByPolicyNumber(policyNumber: string): Promise<Client | undefined> {
    return this.clients.get(policyNumber);
  }
  
  async createClient(client: Omit<InsertClient, "id">): Promise<Client> {
    const id = this.currentClientId++;
    
    // If it's a temporary client and doesn't have a policy number, generate one
    if (!client.policyNumber) {
      client.policyNumber = generateTempPolicyNumber(this.tempPolicyNumberCounter++);
    }
    
    const newClient: Client = {
      ...client,
      id,
      createdAt: new Date()
    };
    
    this.clients.set(newClient.policyNumber, newClient);
    return newClient;
  }
  
  // Payment operations
  async recordPayment(payment: Omit<InsertPayment, "id" | "synced">): Promise<Payment> {
    const id = this.currentPaymentId++;
    
    const newPayment: Payment = {
      ...payment,
      id,
      synced: true
    };
    
    this.payments.push(newPayment);
    return newPayment;
  }
  
  async getAllPayments(): Promise<Payment[]> {
    return this.payments;
  }
  
  async getPaymentsByDate(dateStr: string): Promise<Payment[]> {
    const date = new Date(dateStr);
    
    return this.payments.filter(payment => {
      const paymentDate = new Date(payment.timestamp);
      return (
        paymentDate.getFullYear() === date.getFullYear() &&
        paymentDate.getMonth() === date.getMonth() &&
        paymentDate.getDate() === date.getDate()
      );
    });
  }
}

export const storage = new MemStorage();
