import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Certifications from "../pages/Certifications";
import Governance from "../pages/Governance";
import Home from "../pages/Home";
//import NftDetails from "../pages/NftDetails";
import Wallet from "../pages/Wallet";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/certifications" element={<Certifications />} />
      <Route path="/home" element={<Home />} />
      <Route path="/governance" element={<Governance />} />
      <Route path="/wallet" element={<Wallet />} />

      {/* <Route path="/wallet/:id" element={<NftDetails />} /> */}
    </Routes>
  );
};

export default Routers;