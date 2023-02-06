import React from "react";

import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({account, setAccount}) => {
  return (
    <div>
      <Header account={account} setAccount={setAccount}/>
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;