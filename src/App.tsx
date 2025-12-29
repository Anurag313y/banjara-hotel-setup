// App.tsx - Main application entry point
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isCloudConfigured } from "@/lib/cloudClient";

// Lazy-load pages so the app doesn't hard-crash while Cloud env is still syncing
const EntryScreen = lazy(() => import("./pages/EntryScreen"));
const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const JobForm = lazy(() => import("./pages/JobForm"));
const StaffForm = lazy(() => import("./pages/BusinessForm").then((m) => ({ default: m.StaffForm })));
const KitchenForm = lazy(() => import("./pages/BusinessForm").then((m) => ({ default: m.KitchenForm })));
const CCGForm = lazy(() => import("./pages/BusinessForm").then((m) => ({ default: m.CCGForm })));
const SuccessScreen = lazy(() => import("./pages/SuccessScreen"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminJobSeekers = lazy(() => import("./pages/admin/AdminJobSeekers"));
const AdminStaff = lazy(() => import("./pages/admin/AdminDataTable").then((m) => ({ default: m.AdminStaff })));
const AdminKitchen = lazy(() => import("./pages/admin/AdminDataTable").then((m) => ({ default: m.AdminKitchen })));
const AdminCCG = lazy(() => import("./pages/admin/AdminDataTable").then((m) => ({ default: m.AdminCCG })));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const BackendNotReady = () => (
  <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
    <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Backend still syncing</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Lovable Cloud is still provisioning environment settings. Please refresh in a few seconds.
      </p>
      <div className="mt-5 flex gap-3">
        <Button asChild variant="default">
          <Link to="/">Go to Welcome</Link>
        </Button>
        <Button asChild variant="outline">
          <a href={window.location.href}>Refresh</a>
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        If this persists, open the Backend tab and confirm Cloud is enabled.
      </p>
    </section>
  </main>
);

const App = () => {
  const hasCloudEnv = isCloudConfigured;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense
            fallback={
              <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading…</p>
              </main>
            }
          >
            <Routes>
              {/* User Routes (Mobile First) */}
              <Route path="/" element={<EntryScreen />} />
              <Route path="/home" element={hasCloudEnv ? <HomeScreen /> : <BackendNotReady />} />
              <Route path="/apply/job" element={hasCloudEnv ? <JobForm /> : <BackendNotReady />} />
              <Route path="/apply/staff" element={hasCloudEnv ? <StaffForm /> : <BackendNotReady />} />
              <Route path="/apply/kitchen" element={hasCloudEnv ? <KitchenForm /> : <BackendNotReady />} />
              <Route path="/apply/ccg" element={hasCloudEnv ? <CCGForm /> : <BackendNotReady />} />
              <Route path="/success" element={<SuccessScreen />} />

              {/* Admin Routes */}
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

