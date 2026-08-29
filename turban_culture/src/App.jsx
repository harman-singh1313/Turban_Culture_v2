import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import FloatingContact from "./Components/FloatingContact";

// PUBLIC
const Home = lazy(() => import("./Pages/Home"));
const Services = lazy(() => import("./Pages/Services"));
const Gallery = lazy(() => import("./Pages/Gallery"));
const Reviews = lazy(() => import("./Pages/Reviews"));
const Booking = lazy(() => import("./Pages/Booking"));
const ReceiptPage = lazy(() => import("./Pages/ReceiptPage"));

// ADMIN
const AdminBookings = lazy(() => import("./Dashboard/SidebarPages/AdminBookings"));
const AdminServices = lazy(() => import("./Dashboard/SidebarPages/AdminServices"));
const AdminLayout = lazy(() => import("./Pages/AdminLayout"));
const Dashboard = lazy(() => import("./Dashboard/SidebarPages/Dashboard"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const GalleryManager = lazy(() => import("./Dashboard/SidebarPages/GalleryManager"));
const ProtectedRoute = lazy(() => import("./Pages/ProtectedRoute"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const SliderManager = lazy(() => import("./Dashboard/SidebarPages/SliderManager"))
const VideoManager = lazy(() => import("./Dashboard/SidebarPages/VideoManager"))

/* ---------------- LAYOUT ---------------- */
const Layout = () => (
  <>
    <Navbar />
    {/* GAP FIX: pt-24 hata ke pt-[68px] kita - Navbar di height jinna */}
    <div className="pt-[68px]">
      <Outlet />
    </div>
    <Footer />
    <FloatingContact/>
  </>
);

/* ---------------- LOADER ---------------- */
const Loader = () => (
  <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 border-4 border-[#c9913a]/30 border-t-[#c9913a] rounded-full animate-spin"></div>
    <p className="text-[#c9913a] tracking-widest text-xs">LOADING ROYAL LOOK...</p>
  </div>
);

/* ---------------- APP ---------------- */
const App = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* PUBLIC */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* 404 */}
            <Route path="*" element={<div className="p-20 text-center">Page Not Found</div>} />
          </Route>

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="galleryManager" element={<GalleryManager />} />
            <Route path="sliderManager" element={<SliderManager />} />
            <Route path="videoManager" element={<VideoManager />} />
          </Route>

          <Route path="/receipt" element={<ReceiptPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;