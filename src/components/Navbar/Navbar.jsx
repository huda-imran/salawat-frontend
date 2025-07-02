import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/salawat-logo.png';
import { FiCopy } from 'react-icons/fi';
import { ethers } from 'ethers';

const Navbar = ({ isLoggedIn, username, onLogout, user }) => {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);

  const handleCopy = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const shortAddress = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : '';

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!user?.walletAddress) return;
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const rawBalance = await provider.getBalance(user.walletAddress);
        const formatted = ethers.formatEther(rawBalance);
        setBalance(Number(formatted).toFixed(4)); // rounded to 4 decimals
      } catch (err) {
        console.error('❌ Error fetching balance:', err);
      }
    };

    fetchBalance();
  }, [user?.walletAddress]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {isLoggedIn && user?.role === 'admin' && (
        <div className="navbar-links">
          <NavLink to="/tokenmanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Token Dashboard</NavLink>
          <NavLink to="/coremembermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Admin Dashboard</NavLink>
          <NavLink to="/communitybuildermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Core Member Dashboard</NavLink>
          <NavLink to="/communitymembermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Builder Dashboard</NavLink>
          <NavLink to="/communitymember" end className={({ isActive }) => isActive ? "active-link" : ""}>Member Dashboard</NavLink>
        </div>
      )}

      {isLoggedIn && (
        <div className="navbar-profile">
          <span className="username">{username}</span>
          {user?.walletAddress && (
            <div className="wallet-address" onClick={handleCopy}>
              <span>{shortAddress} ({balance} POL)</span>
              <FiCopy className="copy-icon" />
              {copied && <span className="copied-msg">Copied</span>}
            </div>
          )}
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
