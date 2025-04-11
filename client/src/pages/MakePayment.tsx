import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormData, PaymentReceipt } from "@shared/schema";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import ConfirmationModal from "@/components/ConfirmationModal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MakePayment: React.FC = () => {
  const { clients, addPayment, todayPayments } = useAppContext();
  const [lookupPolicyNumber, setLookupPolicyNumber] = useState<string>("");
  const [foundClient, setFoundClient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  // Form for policy lookup
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      policyNumber: "",
      amount: 0,
      paymentMode: undefined,
    },
  });

  // Handle policy lookup
  const handlePolicyLookup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!lookupPolicyNumber) return;

    const client = clients[lookupPolicyNumber];
    if (client) {
      setFoundClient(client);
      paymentForm.setValue("policyNumber", lookupPolicyNumber);
    } else {
      setFoundClient(null);
      alert("No client found with this policy number.");
    }
  };

  // Handle payment submission
  const onSubmitPayment = async (data: PaymentFormData) => {
    if (!foundClient) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert amount to cents for storage
      const amountInCents = Math.round(data.amount * 100);
      
      // Create payment record
      const payment = await addPayment({
        policyNumber: data.policyNumber,
        clientName: foundClient.fullName,
        amount: amountInCents,
        paymentMode: data.paymentMode,
        timestamp: new Date(),
      });
      
      // Create receipt for modal
      setReceipt({
        id: payment.id,
        clientName: foundClient.fullName,
        policyNumber: data.policyNumber,
        amount: amountInCents / 100, // Convert back to GHS for display
        paymentMode: data.paymentMode,
        timestamp: new Date(payment.timestamp),
      });
      
      // Show receipt modal
      setShowReceiptModal(true);
      
      // Reset form and state
      paymentForm.reset();
      setFoundClient(null);
      setLookupPolicyNumber("");
    } catch (error) {
      console.error("Failed to process payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close receipt modal
  const handleCloseReceipt = () => {
    setShowReceiptModal(false);
    setReceipt(null);
  };

  return (
    <div className="page-container">
      <div className="summary-card">
        <div>
          <h2 className="text-lg font-bold text-gray-700">Make Payment</h2>
          <p className="text-xs text-gray-500">Record premium payments</p>
        </div>
        <div className="summary-card-icon">
          <span className="material-icons">payments</span>
        </div>
      </div>
      
      {/* Policy Lookup Form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handlePolicyLookup}>
            <div className="mb-4">
              <Label htmlFor="policyNumber" className="text-sm font-medium text-gray-700 mb-1 block">Policy Number</Label>
              <div className="flex">
                <Input
                  id="policyNumber"
                  value={lookupPolicyNumber}
                  onChange={(e) => setLookupPolicyNumber(e.target.value)}
                  className="input-field"
                  placeholder="Enter policy number"
                  required
                />
                <Button type="submit" className="ml-2 bg-primary hover:bg-green-700">
                  <span className="material-icons">search</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Client Information */}
      {foundClient && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="border-b pb-3 mb-3">
              <div className="flex items-center mb-2">
                <span className="material-icons text-primary mr-2">person</span>
                <h3 className="font-medium text-gray-700">Client Information</h3>
              </div>
              <p className="text-xl font-bold">{foundClient.fullName}</p>
              <p className="text-sm text-gray-500">{foundClient.occupation}</p>
            </div>
            
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)}>
                <FormField
                  control={paymentForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Payment Amount (GHS)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          min="0"
                          className="input-field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={paymentForm.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Payment Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="MoMo">Mobile Money (MoMo)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#4CAF50] hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  <span className="material-icons mr-2">check_circle</span>
                  Confirm Payment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Payments */}
      <div className="summary-card mb-3">
        <div>
          <h3 className="font-medium text-gray-700">Recent Payments</h3>
          <p className="text-xs text-gray-500">Last 5 transactions</p>
        </div>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
          {todayPayments.length}
        </span>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {todayPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="material-icons text-4xl text-gray-300 mb-2">receipt_long</span>
              <p>No payments made today</p>
            </div>
          ) : (
            todayPayments.slice(0, 5).map((payment) => (
              <div 
                key={payment.id} 
                className="border-b last:border-b-0 py-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-start">
                    <span className="material-icons text-primary mr-2 mt-1">receipt</span>
                    <div>
                      <p className="font-medium">{payment.clientName}</p>
                      <p className="text-xs text-gray-500">{payment.policyNumber}</p>
                      <p className="text-xs text-gray-400">{formatTime(new Date(payment.timestamp))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(payment.amount / 100)}</p>
                    <span className={`text-xs ${payment.paymentMode === 'Cash' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} px-2 py-1 rounded-full`}>
                      {payment.paymentMode}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      {/* Receipt Modal */}
      {receipt && (
        <ConfirmationModal
          isOpen={showReceiptModal}
          onClose={handleCloseReceipt}
          title="Payment Successful!"
          description="Receipt has been generated"
          content={
            <>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Client:</p>
                <p className="font-medium">{receipt.clientName}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Policy No:</p>
                <p className="font-medium">{receipt.policyNumber}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Amount:</p>
                <p className="font-medium">{formatCurrency(receipt.amount)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Date & Time:</p>
                <p className="font-medium">{formatDate(receipt.timestamp)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Payment Mode:</p>
                <p className="font-medium">{receipt.paymentMode}</p>
              </div>
            </>
          }
          primaryAction={{
            label: "Done",
            onClick: handleCloseReceipt,
          }}
          secondaryAction={{
            label: "Print",
            onClick: () => {
              // This would connect to a printer in a real application
              console.log("Print receipt:", receipt);
            },
          }}
        />
      )}
    </div>
  );
};

export default MakePayment;