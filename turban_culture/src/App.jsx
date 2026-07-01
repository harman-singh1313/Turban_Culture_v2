import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import WhatsappChat from "./Components/whatsappChat";

// 🔥 LAZY LOADED PAGES (PUBLIC)
const Home = lazy(() => import("./Pages/Home"));
const Services = lazy(() => import("./Pages/Services"));
const Gallery = lazy(() => import("./Pages/Gallery"));
const Reviews = lazy(() => import("./Pages/Reviews"));
const Booking = lazy(() => import("./Pages/Booking"));
const ReceiptPage = lazy(() => import("./Pages/ReceiptPage"));

// 🔥 ADMIN LAZY PAGES
const AdminBookings = lazy(() => import("./Dashboard/SidebarPages/AdminBookings"));
const AdminServices = lazy(() => import("./Dashboard/SidebarPages/AdminServices"));
const AdminLayout = lazy(() => import("./Pages/AdminLayout"));
const Dashboard = lazy(() => import("./Dashboard/SidebarPages/Dashboard"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const GalleryManager = lazy(() => import("./Dashboard/SidebarPages/GalleryManager"));
const ProtectedRoute = lazy(() => import("./Pages/ProtectedRoute"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
/* ---------------- LAYOUT ---------------- */
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
    <WhatsappChat />
  </>
);

/* ---------------- APP ---------------- */
const App = () => {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<div style={{ padding: "20px" }}>Loading...</div>}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="galleryManager" element={<GalleryManager />} />
          </Route>

          {/* RECEIPT */}
<Route path="/receipt/:bookingId" element={<ReceiptPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;