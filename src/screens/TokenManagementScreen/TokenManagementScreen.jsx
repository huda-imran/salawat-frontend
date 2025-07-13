import React, { useEffect, useState } from 'react';
import './TokenManagementScreen.css';
import { useMessage } from '../../context/MessageContext';

const TokenManagementScreen = () => {
  const [tokens, setTokens] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [value, setValue] = useState('');
  const [verificationCount, setVerificationCount] = useState(1);
  const [meta, setMeta] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { showMessage } = useMessage();

  const fetchAllTokens = async () => {
    try {
      const response = await fetch(`${API_URL}/token/`);
      const data = await response.json();
      setTokens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/token/requests/`);
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllTokens();
    fetchRequests();
  }, []);

  const handleCopy = (text) => {
    if (typeof text === 'string') {
      navigator.clipboard.writeText(text);
      showMessage('success', 'Copied to clipboard');
    }
  };

  const shorten = (val) => (typeof val === 'string' ? `${val.slice(0, 6)}...${val.slice(-4)}` : '—');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    showMessage('loading', 'Deploying token...');
    try {
      await fetch(`${API_URL}/token/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tokenName,
          symbol: tokenSymbol,
          tokenId,
          verificationCount,
          meta,
        }),
      });
      await fetchAllTokens();
      showMessage('success', 'Token created successfully');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

 const handleMint = async (e) => {
  e.preventDefault();
  setLoading(true);
  showMessage('loading', 'Minting token...');
  try {
    const res = await fetch(`${API_URL}/token/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver, tokenId, value }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Minting failed');
    }

    await fetchAllTokens();
    showMessage('success', 'Token minted successfully');
  } catch (err) {
    console.error(err);
    showMessage('error', err.message || 'Failed to mint token');
  } finally {
    setLoading(false);
  }
};


  const handleBurn = async (e) => {
    e.preventDefault();
    setLoading(true);
    showMessage('loading', 'Burning token...');
    try {
      await fetch(`${API_URL}/token/burn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          amount: value,
        }),
      });
      await fetchAllTokens();
      showMessage('success', 'Token burned successfully');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to burn token');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (tokenId) => {
    showMessage('loading', 'Marking as complete...');
    try {
      await fetch(`${API_URL}/token/mark-complete/${tokenId}`, {
        method: 'PATCH',
      });
      await fetchAllTokens();
      showMessage('success', 'Marked as completed');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to mark as completed');
    }
  };

  const handleRemoveRequest = async (requestId) => {
    showMessage('loading', 'Removing request...');
    try {
      await fetch(`${API_URL}/token/request/${requestId}`, {
        method: 'DELETE',
      });
      await fetchRequests();
      showMessage('success', 'Request removed');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to remove request');
    }
  };

  const handleSearch = async () => {
    showMessage('loading', 'Searching...');
    try {
      const res = await fetch(`${API_URL}/token/${searchId}`);
      const data = await res.json();
      setSearchResult(data);
      showMessage('success', 'Search complete');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Search failed');
    }
  };

  return (
    <div className="route-fade">
      <div className="token-management-grid">

        <div className="total-active-tokens compact-card">
          <h2>Total Active Tokens</h2>
          <p className="section-description">The total number of tokens currently managed by the system.</p>
          <p>Number: {tokens.length}</p>
        </div>

        <div className="search-token-info compact-card">
          <h2>Search Token Info</h2>
          <p className="section-description">Retrieve token details using the Token ID.</p>
          <label>Search Token ID</label>
          <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Enter Token ID" />
          <button className="search-btn" onClick={handleSearch}>Search</button>
          {searchResult && (
            <div className="search-result">
              <pre>{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Token Deployment</h2>
          <form onSubmit={handleCreate}>
            <label>Token Name</label>
            <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Token Name" />
            <label>Symbol</label>
            <input value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} placeholder="Token Symbol" />
            <label>Verification Count</label>
            <input value={verificationCount} onChange={(e) => setVerificationCount(e.target.value)} placeholder="Verification Count" />
            <button type="submit" className="deploy-btn" disabled={loading}>Deploy Token</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Token Mint</h2>
          <form onSubmit={handleMint}>
            <label>Token ID</label>
            <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="Token ID" />
            <label>Receiver</label>
            <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Receiver Address" />
            <label>Amount</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Amount" />
            <button type="submit" className="mint-btn" disabled={loading}>Mint Token</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Token Burn</h2>
          <form onSubmit={handleBurn}>
            <label>Token ID</label>
            <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="Token ID" />
            <label>Amount</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Amount" />
            <label>Verification Count</label>
            <input value={verificationCount} onChange={(e) => setVerificationCount(e.target.value)} placeholder="Verification Count" />
            <button type="submit" className="burn-btn" disabled={loading}>Burn Token</button>
          </form>
        </div>

        <div className="results-section">
          <h2>Tokens</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date Issued</th>
                  <th>Token ID</th>
                  <th>Value</th>
                  <th>Count</th>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                  <tr><td colSpan="8">No tokens available</td></tr>
                ) : (
                  tokens.map((t, i) => (
                    <tr key={i}>
                      <td>{t.issuedDate ? new Date(t.issuedDate).toLocaleDateString() : '—'}</td>
                      <td onClick={() => handleCopy(t.tokenId)} title="Click to copy" style={{ cursor: 'pointer', color: '#90caf9' }}>
                        {shorten(t.tokenId)}
                      </td>
                      <td>{t.value ?? '—'}</td>
                      <td>{t.verificationCount ?? '—'}</td>
                      <td>{t.verifiedStatus ?? '—'}</td>
                      <td>{t.name || '—'}</td>
                      <td>{t.symbol || '—'}</td>
                      <td>
                        {t.verifiedStatus !== 'Completed' ? (
                          <button onClick={() => handleMarkComplete(t.tokenId)} style={{ background: '#4caf50', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            Complete
                          </button>
                        ) : (
                          <span style={{ color: '#9ccc65', fontWeight: 'bold' }}>✔ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="results-section">
          <h2>Requests</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member Username</th>
                  <th>Wallet Address</th>
                  <th>Token ID</th>
                  <th>Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="5">No requests found</td></tr>
                ) : (
                  requests.map((req, i) => (
                    <tr key={i}>
                      <td onClick={() => handleCopy(req.memberUsername)} title="Click to copy" style={{ cursor: 'pointer', color: '#90caf9' }}>
                        {shorten(req.memberUsername)}
                      </td>
                      <td onClick={() => handleCopy(req.memberAddress)} title="Click to copy" style={{ cursor: 'pointer', color: '#90caf9' }}>
                        {shorten(req.memberAddress)}
                      </td>
                      <td onClick={() => handleCopy(req.tokenId)} title="Click to copy" style={{ cursor: 'pointer', color: '#90caf9' }}>
                        {shorten(req.tokenId)}
                      </td>
                      <td>{req.count ?? '—'}</td>
                      <td>
                        <button onClick={() => handleRemoveRequest(req._id)} style={{ background: '#e53935', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TokenManagementScreen;
