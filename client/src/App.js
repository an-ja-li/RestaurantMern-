// /src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import StaffPage from "./pages/staff/StaffPage";
import Food from "./pages/Food/Food"; // Food page component
import Order from './pages/Order/Order';




function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/Food" element={<Food />} /> {/* Food page route */}
        <Route path="/Order" element={<Order />}/>


      </Routes>
    </Router>
  );
}

export default App;