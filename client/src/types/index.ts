import { Client, Payment } from "@shared/schema";

export interface IAppContext {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  syncData: () => Promise<void>;
  todayRegistrations: Client[];
  todayPayments: Payment[];
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<Client>;
  addPayment: (payment: Omit<Payment, "id" | "synced">) => Promise<Payment>;
  clients: Record<string, Client>;
  payments: Payment[];
  loading: boolean;
}

export enum Tabs {
  PAYMENT = "payment",
  REGISTER = "register",
  BUSINESS = "business",
  STATEMENT = "statement"
}

export enum StorageKeys {
  CLIENTS = "sikaplan-clients",
  PAYMENTS = "sikaplan-payments",
  TEMP_COUNTER = "sikaplan-temp-counter"
}
