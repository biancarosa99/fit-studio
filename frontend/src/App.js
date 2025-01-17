import React, { useContext } from "react";
import axios from "axios";
import AuthContext from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SchedulerPage from "./pages/SchedulerPage";
import TrainerClassesPage from "./pages/TrainerClassesPage";
import UserPlansPage from "./pages/UserPlansPage";
import Footer from "./components/Footer";
import "./App.css";
import { LocationProvider } from "./context/LocationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <LocationProvider>
      <Router>
        <Navbar />
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classesTimetable" element={<SchedulerPage />} />
            <Route
              path="/trainerclasses/:time"
              element={
                <ProtectedRoute user={user} requiredRole="trainer">
                  <TrainerClassesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myplans/:time"
              element={
                <ProtectedRoute user={user} requiredRole="user">
                  <UserPlansPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </LocationProvider>
  );
}

export default App;
