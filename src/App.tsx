// App.tsx - Main application entry point
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import EntryScreen from "./pages/EntryScreen";
import HomeScreen from "./pages/HomeScreen";
import JobForm from "./pages/JobForm";
import { StaffForm, KitchenForm, CCGForm } from "./pages/BusinessForm";
import SuccessScreen from "./pages/SuccessScreen";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobSeekers from "./pages/admin/AdminJobSeekers";
import { AdminStaff, AdminKitchen, AdminCCG } from "./pages/admin/AdminDataTable";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* User Routes (Mobile First) */}
            <Route path="/" element={<EntryScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/apply/job" element={<JobForm />} />
            <Route path="/apply/staff" element={<StaffForm />} />
            <Route path="/apply/kitchen" element={<KitchenForm />} />
            <Route path="/apply/ccg" element={<CCGForm />} />
            <Route path="/success" element={<SuccessScreen />} />

            {/* Admin Routes (Desktop First) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="jobs" element={<AdminJobSeekers />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="kitchen" element={<AdminKitchen />} />
              <Route path="ccg" element={<AdminCCG />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
