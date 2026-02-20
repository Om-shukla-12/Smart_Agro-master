import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import PreviousRecords from "./pages/PreviousRecords";
import ManualAutomation from './pages/ManualAutomation';
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

function App() {
  return (
    <SmoothScrollProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={(
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            )}
          />
          <Route
            path="/register"
            element={(
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/records"
            element={(
              <ProtectedRoute>
                <PreviousRecords />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/manual-automation"
            element={(
              <ProtectedRoute>
                <ManualAutomation />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/about"
            element={(
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </Router>
    </SmoothScrollProvider>
  );
}

export default App;
