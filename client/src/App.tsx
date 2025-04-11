import { useEffect } from "react";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Tabs } from "@/types";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import MakePayment from "@/pages/MakePayment";
import RegisterClient from "@/pages/RegisterClient";
import NewBusiness from "@/pages/NewBusiness";
import DailyStatement from "@/pages/DailyStatement";

function AppContent() {
  const { activeTab } = useAppContext();
  
  return (
    <Layout>
      {activeTab === Tabs.PAYMENT && <MakePayment />}
      {activeTab === Tabs.REGISTER && <RegisterClient />}
      {activeTab === Tabs.BUSINESS && <NewBusiness />}
      {activeTab === Tabs.STATEMENT && <DailyStatement />}
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppContent />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
