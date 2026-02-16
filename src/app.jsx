import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./webTheme.css";
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import AirlineDash from "./pages/AirlineDash";
import GateDash from "./pages/GateDash";
import GroundDash from "./pages/GroundDash";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/airline" element={<AirlineDash />} />
        <Route path="/gate" element={<GateDash />} />
        <Route path="/ground" element={<GroundDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

