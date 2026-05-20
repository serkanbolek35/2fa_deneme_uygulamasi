import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SifreOlcer from "./pages/SifreOlcer";
import PhishingDedektifi from "./pages/PhishingDedektifi";
import DominoSimulator from "./pages/DominoSimulator";
import "./App.css";

function PrivateRoute({ children }) {
  const { currentUser, awaitingTwoFA } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (awaitingTwoFA) return <Navigate to="/login" />;
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, awaitingTwoFA } = useAuth();
  if (currentUser && !awaitingTwoFA) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          {/* Giriş yapılması gereken sayfalar */}
          <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/sifre-olcer" element={<PrivateRoute><SifreOlcer /></PrivateRoute>} />
          <Route path="/phishing"    element={<PrivateRoute><PhishingDedektifi /></PrivateRoute>} />
          <Route path="/domino"      element={<PrivateRoute><DominoSimulator /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
