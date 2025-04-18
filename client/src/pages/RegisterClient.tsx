import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientRegistrationSchema, ClientRegistration } from "@shared/schema";
import { useAppContext } from "@/context/AppContext";
import { generateTempPolicyNumber, formatCurrency } from "@/lib/utils";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterClient: React.FC = () => {
  const { addClient, todayRegistrations } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<any>(null);

  // Form for client registration
  const registrationForm = useForm<ClientRegistration>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      gender: undefined,
      occupation: "",
      contactNumber: "",
      paymentFrequency: undefined,
      premiumAmount: undefined,
    },
  });

  // Handle client registration
  const onSubmitRegistration = async (data: ClientRegistration) => {
    setIsSubmitting(true);
    
    try {
      // Convert premium amount to cents for storage
      const premiumInCents = Math.round(data.premiumAmount * 100);
      
      // Create new client with temporary policy number
      const client = await addClient({
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        occupation: data.occupation,
        contactNumber: data.contactNumber,
        paymentFrequency: data.paymentFrequency,
        premiumAmount: premiumInCents,
        policyNumber: "", // This will be generated by the addClient function
        tempPolicyNumber: "", // This will be the same as policy number
        isTemporary: true,
        createdAt: new Date(),
      });
      
      // Set client for success modal
      setNewClient({
        ...client,
        premiumAmount: premiumInCents / 100, // Convert back to GHS for display
      });
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to register client:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close success modal and optionally reset form
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setNewClient(null);
  };

  // Close modal and reset form for registering another client
  const handleRegisterAnother = () => {
    setShowSuccessModal(false);
    setNewClient(null);
    registrationForm.reset();
  };

  return (
    <div className="page-container">
      <h2 className="text-2xl font-bold mb-6 text-[#424242]">Register New Client</h2>
      
      {/* Client Registration Form */}
      <Card>
        <CardContent className="pt-6">
          <Form {...registrationForm}>
            <form onSubmit={registrationForm.handleSubmit(onSubmitRegistration)}>
              <FormField
                control={registrationForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter client's full name"
                        className="input-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={registrationForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Age"
                          type="number"
                          min="18"
                          max="99"
                          className="input-field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registrationForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={registrationForm.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter occupation"
                        className="input-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        className="input-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={registrationForm.control}
                  name="paymentFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registrationForm.control}
                  name="premiumAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium (GHS)</FormLabel>
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
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                Register Client
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Today's Registrations */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-[#424242]">Today's Registrations</h3>
          <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
            {todayRegistrations.length}
          </span>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {todayRegistrations.length === 0 ? (
              <div className="text-center py-4 text-[#9e9e9e]">
                No clients registered today
              </div>
            ) : (
              todayRegistrations.map((client) => (
                <div 
                  key={client.id} 
                  className="border-b last:border-b-0 pb-3 mb-3 last:mb-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{client.fullName}</p>
                      <p className="text-xs text-[#9e9e9e]">{client.policyNumber}</p>
                    </div>
                    <div className="flex">
                      <button className="text-primary mr-2">
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <p className="font-bold">{formatCurrency(client.premiumAmount / 100)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Registration Success Modal */}
      {newClient && (
        <ConfirmationModal
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
          title="Registration Successful!"
          description="Client has been registered"
          content={
            <>
              <div className="flex justify-between mb-2">
                <p className="text-[#9e9e9e]">Name:</p>
                <p className="font-medium">{newClient.fullName}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-[#9e9e9e]">Temp Policy No:</p>
                <p className="font-medium">{newClient.policyNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#9e9e9e]">Premium Amount:</p>
                <p className="font-medium">
                  {formatCurrency(newClient.premiumAmount)} ({newClient.paymentFrequency})
                </p>
              </div>
            </>
          }
          primaryAction={{
            label: "Done",
            onClick: handleCloseModal,
          }}
          secondaryAction={{
            label: "Register Another",
            onClick: handleRegisterAnother,
          }}
        />
      )}
    </div>
  );
};

export default RegisterClient;
