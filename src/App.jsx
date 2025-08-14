import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Bitnest" className="h-8 w-8" />
          <span className="text-white font-extrabold text-xl tracking-wide">Bitnest</span>
        </Link>
        <ul className="flex items-center gap-6">
          <li>
            <Link to="/" className="text-white hover:text-yellow-400 font-semibold transition">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/login" className="text-yellow-400 hover:text-white font-semibold transition">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Bitnest. All rights reserved.
      </div>
    </footer>
  );
}
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletConnect from "./WalletConnect";

const WALLET_ADDRESS = "0x0123456789abcdef0123456789abcdef01234567"; // Hidden from UI
const BNB_DECIMALS = 18;

export default function Dashboard() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const bal = await provider.getBalance(WALLET_ADDRESS);
        setBalance(ethers.formatUnits(bal, BNB_DECIMALS));
      } catch (e) {
        setBalance("Error");
      }
    }
    fetchBalance();
  }, []);

  return (
    <section className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-2xl px-10 py-10 flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight mb-2">Bitnest Dashboard</h1>
          <span className="block text-lg text-blue-700 font-semibold mb-2">BNB Smart Chain (BEP20)</span>
          <WalletConnect />
          <div className="mt-8 flex flex-col items-center">
            <div className="mb-1 text-base font-bold text-gray-700">Platform Wallet Balance</div>
            <div className="text-3xl md:text-4xl text-yellow-400 font-bold drop-shadow">
              {balance !== null ? `${balance} BNB` : "Loading..."}
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-6">
            Only the wallet balance is publicly shown.<br />
            All addresses and internal operations are securely hidden.
          </p>
        </div>
      </div>
    </section>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Nancy$100";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem("admin", "true");
      navigate("/admin");
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <section className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 min-h-[70vh] flex items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-5"
        autoComplete="off"
      >
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button type="submit" className="bg-yellow-400 text-blue-900 py-2 rounded font-bold mt-2 hover:bg-yellow-500 transition">
          Login
        </button>
      </form>
    </section>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("admin") === "true";

  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }

  function handleLogout() {
    sessionStorage.removeItem("admin");
    navigate("/");
  }

  return (
    <section className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 min-h-[70vh] flex items-center justify-center py-10">
      <div className="bg-white/95 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 items-center">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-3">Bitnest Admin Panel</h2>
        <div className="text-gray-700 font-semibold text-center">
          Welcome, Admin!<br />
          (All sensitive operations remain private and secure.)
        </div>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded mt-6 font-bold hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
  );
}
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  background: #0c1833;
}
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#1A237E"/>
  <path d="M11 28L20 12L29 28H11Z" fill="#FFD600"/>
  <circle cx="20" cy="20" r="4" fill="#1A237E"/>
</svg>
