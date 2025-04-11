import { users, type User, type InsertUser, clients, type Client, type InsertClient, payments, type Payment, type InsertPayment } from "@shared/schema";
import { generateTempPolicyNumber } from "../client/src/lib/utils";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

// Keep the interface the same
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

// Replace MemStorage with DatabaseStorage
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Client operations
  async getAllClients(): Promise<Client[]> {
    return db.select().from(clients);
  }
  
  async getClientByPolicyNumber(policyNumber: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.policyNumber, policyNumber));
    return client || undefined;
  }
  
  async createClient(client: Omit<InsertClient, "id">): Promise<Client> {
    // Insert the client and return the newly created client
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    
    return newClient;
  }
  
  // Payment operations
  async recordPayment(payment: Omit<InsertPayment, "id" | "synced">): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values({
        ...payment,
        synced: true // Mark as synced by default in DB
      })
      .returning();
    
    return newPayment;
  }
  
  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments);
  }
  
  async getPaymentsByDate(dateStr: string): Promise<Payment[]> {
    const date = new Date(dateStr);
    
    // Use date formatting functions appropriate for PostgreSQL
    return db
      .select()
      .from(payments)
      .where(
        sql`DATE(${payments.timestamp}) = ${date.toISOString().split('T')[0]}`
      );
  }
  
  // Initialize with test data for development if needed
  async seedTestData() {
    // Check if we already have clients
    const existingClients = await db.select().from(clients);
    
    if (existingClients.length === 0) {
      console.log('Seeding test data...');
      const testClients = [
        {
          fullName: "Kofi Mensah",
          age: 42,
          gender: "Male",
          occupation: "Taxi Driver",
          contactNumber: "0244123456",
          paymentFrequency: "Daily",
          premiumAmount: 500, // 5.00 GHS (stored in cents)
          policyNumber: "SKP20250411002",
          isTemporary: false,
        },
        {
          fullName: "Ama Serwaa",
          age: 35,
          gender: "Female",
          occupation: "Market Trader",
          contactNumber: "0201987654",
          paymentFrequency: "Weekly",
          premiumAmount: 1000, // 10.00 GHS
          policyNumber: "SKP20250411005",
          isTemporary: false,
        },
        {
          fullName: "John Addo",
          age: 28,
          gender: "Male", 
          occupation: "Mechanic",
          contactNumber: "0277889900",
          paymentFrequency: "Weekly",
          premiumAmount: 800, // 8.00 GHS
          policyNumber: "SKP20250411007",
          isTemporary: false,
        }
      ];
      
      for (const client of testClients) {
        await db.insert(clients).values(client);
      }
    }
  }
}

// Create and export a single instance
export const storage = new DatabaseStorage();

// Call seedTestData once when the server starts
storage.seedTestData().catch(err => console.error('Failed to seed test data:', err));
