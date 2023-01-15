import React from "react";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SchedulerPage from "./pages/SchedulerPage";
import TrainerClassesPage from "./pages/TrainerClassesPage";
import UserPlansPage from "./pages/UserPlansPage";
import Footer from "./components/Footer";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classesTimetable" element={<SchedulerPage />}></Route>
            <Route
              path="/trainerclasses/:time"
              element={<TrainerClassesPage />}
            ></Route>
            <Route path="/myplans/:time" element={<UserPlansPage />}></Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
