// Quiet Systems Studio: the portfolio is intentionally a single readable page with anchored sections.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AssetManager from "./pages/AssetManager";
import DashboardLayout from "./components/DashboardLayout";
import { CustomCursor } from "./components/CustomCursor";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return <Switch><Route path="/" component={Home} /><Route path="/manage/assets"><DashboardLayout><AssetManager /></DashboardLayout></Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><CustomCursor /><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
