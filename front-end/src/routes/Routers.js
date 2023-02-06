import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Certifications from "../pages/Certifications";
import Home from "../pages/Home";
import Wallet from "../pages/Wallet";
/* import Market from "../pages/Market";
import Create from "../pages/Create";
import Contact from "../pages/Contact";
import NftDetails from "../pages/NftDetails"; */

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/certifications" element={<Certifications />} />
      <Route path="/home" element={<Home />} />
      <Route path="/wallet" element={<Wallet />} />
{/*       <Route path="/market" element={<Market />} />
      <Route path="/create" element={<Create />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/market/:id" element={<NftDetails />} /> */}
    </Routes>
  );
};

export default Routers;