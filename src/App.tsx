import { Routes, Route } from "react-router-dom";

import AuthenticatedLayout from "./components/layouts/authenticated-layout";

// Auth Pages
// import AuthPage from "./pages/auth";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

// Main Pages
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import BranchPage from "./pages/branch";
import RolePage from "./pages/role";
import EmployeePage from "./pages/employee";

// Delivery & Shipping Pages
import DeliveryPage from "./pages/delivery";
import SendPackagePage from "./pages/send-package";
import AddSendPackagePage from "./pages/send-package/add";
import DetailSendPackagePage from "./pages/send-package/detail";
import PaySendPackagePage from "./pages/send-package/pay";

// History & Tracking Pages
import HistoryPage from "./pages/history";
import DetailHistoryPage from "./pages/history/detail";
import TrackPackagePage from "./pages/track-package";
import ShipmentBranchPage from "./pages/shipment-branch";

// User Address Pages
import UserAddressesPage from "./pages/user-addresses";
import AddUserAddressPage from "./pages/user-addresses/add";
import EditUserAddressPage from "./pages/user-addresses/edit";
import NoAddressPage from "./pages/send-package/no-address";
import { AuthGuard } from "./components/auth-guard";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route path="/auth" element={<AuthPage />} /> */}
      <Route
        path="/auth/login"
        element={
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        }
      />
      <Route
        path="/auth/register"
        element={
          <AuthGuard requireAuth={false}>
            <RegisterPage />
          </AuthGuard>
        }
      />

      {/* Legacy auth routes - redirect for compatibility */}
      {/* <Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} /> */}

      {/* Protected Routes */}
      <Route
        element={
          <AuthGuard requireAuth={true}>
            <AuthenticatedLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Branch Management */}
        <Route path="/branch" element={<BranchPage />} />

        {/* Role Management */}
        <Route path="/role" element={<RolePage />} />

        {/* Employee Management */}
        <Route path="/employee" element={<EmployeePage />} />

        {/* User Address Management */}
        <Route path="/user-addresses" element={<UserAddressesPage />} />
        <Route path="/user-addresses/add" element={<AddUserAddressPage />} />
        <Route
          path="/user-addresses/edit/:id"
          element={<EditUserAddressPage />}
        />

        {/* Delivery Management */}
        <Route path="/delivery" element={<DeliveryPage />} />

        {/* Package Sending */}
        <Route path="/send-package" element={<SendPackagePage />} />
        <Route path="/send-package/no-address" element={<NoAddressPage />} />
        <Route path="/send-package/add" element={<AddSendPackagePage />} />
        <Route
          path="/send-package/detail/:id"
          element={<DetailSendPackagePage />}
        />
        <Route path="/send-package/pay/:id" element={<PaySendPackagePage />} />

        {/* History Management */}
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/detail/:id" element={<DetailHistoryPage />} />

        {/* Package Tracking */}
        <Route path="/track-package" element={<TrackPackagePage />} />

        {/* Shipment Branch */}
        <Route path="/shipment-branch" element={<ShipmentBranchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
