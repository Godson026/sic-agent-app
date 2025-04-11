import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `GHS ${amount.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy, h:mm a");
}

export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

export function generateTempPolicyNumber(counter: number): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  
  // Format: TEMP + YYYYMMDD + sequential counter (padded to 3 digits)
  return `TEMP${year}${month}${day}${String(counter).padStart(3, "0")}`;
}

export function getToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
