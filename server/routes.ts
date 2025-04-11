import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for future server-side functionality
  
  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });
  
  // Get client by policy number
  app.get("/api/clients/:policyNumber", async (req, res) => {
    try {
      const client = await storage.getClientByPolicyNumber(req.params.policyNumber);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });
  
  // Create a new client
  app.post("/api/clients", async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });
  
  // Record a payment
  app.post("/api/payments", async (req, res) => {
    try {
      const payment = await storage.recordPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error recording payment:", error);
      res.status(500).json({ message: "Failed to record payment" });
    }
  });
  
  // Get all payments
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  
  // Get payments by date
  app.get("/api/payments/date/:date", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByDate(req.params.date);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  
  // Sync data from client
  app.post("/api/sync", async (req, res) => {
    try {
      const { clients, payments } = req.body;
      
      // Process clients
      if (clients && clients.length > 0) {
        for (const client of clients) {
          await storage.createClient(client);
        }
      }
      
      // Process payments
      if (payments && payments.length > 0) {
        for (const payment of payments) {
          await storage.recordPayment(payment);
        }
      }
      
      res.status(200).json({ message: "Data synchronized successfully" });
    } catch (error) {
      console.error("Error syncing data:", error);
      res.status(500).json({ message: "Failed to sync data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
