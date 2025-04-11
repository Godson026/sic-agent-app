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
      <h2 className="text-2xl font-bold mb-6 text-[#424242]">Make Payment</h2>
      
      {/* Policy Lookup Form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handlePolicyLookup}>
            <div className="mb-4">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <div className="flex">
                <Input
                  id="policyNumber"
                  value={lookupPolicyNumber}
                  onChange={(e) => setLookupPolicyNumber(e.target.value)}
                  className="input-field"
                  placeholder="Enter policy number"
                  required
                />
                <Button type="submit" className="ml-2">
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
              <h3 className="font-medium text-[#424242]">Client Information</h3>
              <p className="text-xl font-bold">{foundClient.fullName}</p>
              <p className="text-sm text-[#9e9e9e]">{foundClient.occupation}</p>
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
      <div className="mt-6">
        <h3 className="font-medium text-[#424242] mb-2">Recent Payments</h3>
        <Card>
          <CardContent className="pt-6">
            {todayPayments.length === 0 ? (
              <div className="text-center py-4 text-[#9e9e9e]">
                No payments made today
              </div>
            ) : (
              todayPayments.slice(0, 5).map((payment) => (
                <div 
                  key={payment.id} 
                  className="border-b last:border-b-0 pb-3 mb-3 last:mb-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{payment.clientName}</p>
                      <p className="text-xs text-[#9e9e9e]">{payment.policyNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(payment.amount / 100)}</p>
                      <p className="text-xs text-[#9e9e9e]">{formatTime(new Date(payment.timestamp))}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
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
                <p className="text-[#9e9e9e]">Client:</p>
                <p className="font-medium">{receipt.clientName}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-[#9e9e9e]">Policy No:</p>
                <p className="font-medium">{receipt.policyNumber}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-[#9e9e9e]">Amount:</p>
                <p className="font-medium">{formatCurrency(receipt.amount)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-[#9e9e9e]">Date & Time:</p>
                <p className="font-medium">{formatDate(receipt.timestamp)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#9e9e9e]">Payment Mode:</p>
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
