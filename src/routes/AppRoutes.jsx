import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import RaiseTicket from "../pages/ticket/RaiseTicket";
import RaiseEmergencyTicket from "../pages/ticket/RaiseEmergencyTicket";
import ProgramCreate from "../pages/ngo/ProgramCreate";
import ProgramList from "../pages/ngo/ProgramList";
import ProgramDashboard from "../pages/Dashboard/ProgramDashboard";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children }) =>
    user ? children : <Navigate to="/login" replace />;

  return (
    <Routes>
      {/* Default → Always redirect to /dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/raise-ticket" element={<RaiseTicket />} />
      <Route
        path="/EmergencyTicket"
        element={
          <PrivateRoute>
            <RaiseEmergencyTicket />
          </PrivateRoute>
        }
      />
      <Route
        path="/ngo/program/create"
        element={
          <PrivateRoute>
            <ProgramCreate />
          </PrivateRoute>
        }
      />
      <Route path="/programs" element={<ProgramDashboard />} />
      <Route
        path="/ngo/program/list"
        element={
          <PrivateRoute>
            <ProgramList />
          </PrivateRoute>
        }
      />

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
