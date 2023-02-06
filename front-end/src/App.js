import { useState } from 'react';
import "./App.css";
import Layout from "./components/Layout/Layout";

function App() {
  let [account, setAccount] = useState(null)

  return <Layout account={account} setAccount={setAccount} />;
}

export default App;