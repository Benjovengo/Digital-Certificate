import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Certificates from "../pages/Certificates";
import Governance from "../pages/Governance";
import Home from "../pages/Home";
//import NftDetails from "../pages/NftDetails";
import Identity from "../pages/Identity";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/home" element={<Home />} />
      <Route path="/governance" element={<Governance />} />
      <Route path="/identity" element={<Identity />} />

      {/* <Route path="/identity/:id" element={<NftDetails />} /> */}
    </Routes>
  );
};

export default Routers;