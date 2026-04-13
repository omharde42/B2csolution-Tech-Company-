import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import PageTracker from "@/components/PageTracker";
import CollaborationBanner from "@/components/CollaborationBanner";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import OrderTracking from "./pages/OrderTracking";
import ServicesPage from "./pages/ServicesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import AdminDashboard from "./pages/AdminDashboard";
import JoinCommunity from "./pages/JoinCommunity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker />
            <Header />
            <CartDrawer />
            <AuthModal />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/community" element={<JoinCommunity />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <CollaborationBanner />
            <Footer />
            <WhatsAppButton />
            <ChatBot />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
