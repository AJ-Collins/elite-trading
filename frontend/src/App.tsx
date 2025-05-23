
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MentorshipPlans from "./pages/MentorshipPlans";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin pages
import Users from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import Videos from "./pages/admin/Videos";
import AdminCommunity from "./pages/admin/Blogs";
import Content from "./pages/admin/Content";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import FAQPage from "./pages/FAQPage";
import LotsizeCalculator from "./pages/LotsizeCalculator";
import SupportPage from "./pages/SupportPage";
import BlogPost from "./pages/BlogPost";
import Tour from "./pages/Tour";
import ScrollToTop from './components/ScrollToTop'; 
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import Courses from "./pages/Courses";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from './components/ProtectedRoute';
import RequireAdmin from "./components/RequireAdmin";
import Unauthorized from "./pages/Unauthorized";
import LiveSessions from "./pages/admin/LiveSessions";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/plans" element={<MentorshipPlans />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/lotsize-calculator" element={<LotsizeCalculator />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/watch-course/:id" element={<Courses />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/terms" element={<TermsAndConditionsPage />} />
              
              {/* Admin routes */}
              <Route element={<RequireAdmin />}>
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/videos" element={<Videos />} />
                <Route path="/admin/blogs" element={<AdminCommunity />} />
                <Route path="/admin/notes" element={<Content />} />
                <Route path="/admin/sessions" element={<LiveSessions/>} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
