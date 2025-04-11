import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User entity
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Clients entity
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  occupation: text("occupation").notNull(),
  contactNumber: text("contact_number").notNull(),
  paymentFrequency: text("payment_frequency").notNull(),
  premiumAmount: integer("premium_amount").notNull(),
  policyNumber: text("policy_number").notNull().unique(),
  tempPolicyNumber: text("temp_policy_number"),
  isTemporary: boolean("is_temporary").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Payments entity
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  policyNumber: text("policy_number").notNull(),
  clientName: text("client_name").notNull(),
  amount: integer("amount").notNull(),
  paymentMode: text("payment_mode").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  synced: boolean("synced").default(false).notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  synced: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Types for the frontend

export const clientRegistrationSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  age: z.coerce.number().min(18, { message: "Client must be at least 18 years old" }).max(99, { message: "Client must be at most 99 years old" }),
  gender: z.enum(["Male", "Female", "Other"], { message: "Please select a gender" }),
  occupation: z.string().min(2, { message: "Occupation must be at least 2 characters" }),
  contactNumber: z.string().min(10, { message: "Contact number must be at least 10 characters" }),
  paymentFrequency: z.enum(["Daily", "Weekly", "Monthly"], { message: "Please select a payment frequency" }),
  premiumAmount: z.coerce.number().min(0.01, { message: "Premium amount must be greater than 0" }),
});

export type ClientRegistration = z.infer<typeof clientRegistrationSchema>;

export const paymentSchema = z.object({
  policyNumber: z.string().min(3, { message: "Policy number is required" }),
  amount: z.coerce.number().min(0.01, { message: "Amount must be greater than 0" }),
  paymentMode: z.enum(["Cash", "MoMo"], { message: "Please select a payment mode" }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export type PaymentReceipt = {
  id: number;
  clientName: string;
  policyNumber: string;
  amount: number;
  paymentMode: string;
  timestamp: Date;
};
