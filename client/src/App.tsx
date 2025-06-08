import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/appointments" component={() => <Dashboard />} />
      <ProtectedRoute path="/prescriptions" component={() => <Dashboard />} />
      <ProtectedRoute path="/lab-reports" component={() => <Dashboard />} />
      <ProtectedRoute path="/upload" component={() => <Dashboard />} />
      <ProtectedRoute path="/profile" component={() => <Dashboard />} />
      <ProtectedRoute path="/patients" component={() => <Dashboard />} />
      <ProtectedRoute path="/lab-requests" component={() => <Dashboard />} />
      <ProtectedRoute path="/doctors" component={() => <Dashboard />} />
      <ProtectedRoute path="/tokens" component={() => <Dashboard />} />
      <ProtectedRoute path="/reports" component={() => <Dashboard />} />
      <ProtectedRoute path="/test-requests" component={() => <Dashboard />} />
      <ProtectedRoute path="/history" component={() => <Dashboard />} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
