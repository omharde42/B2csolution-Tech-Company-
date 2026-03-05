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
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import OrderTracking from "./pages/OrderTracking";
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
            <Header />
            <CartDrawer />
            <AuthModal />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
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
