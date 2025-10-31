import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import BackgroundPattern from "@/components/BackgroundPattern";
import EventsPage from "@/pages/EventsPage";
import TeamsPage from "@/pages/TeamsPage";
import CourtsPage from "@/pages/CourtsPage";
import MatchesPage from "@/pages/MatchesPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EventsPage} />
      <Route path="/teams" component={TeamsPage} />
      <Route path="/courts" component={CourtsPage} />
      <Route path="/matches" component={MatchesPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BackgroundPattern />
        <Navbar />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
