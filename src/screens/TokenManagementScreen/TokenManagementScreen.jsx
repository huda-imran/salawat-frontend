import React, { useEffect, useState } from 'react';
import './TokenManagementScreen.css';

const TokenManagementScreen = () => {
  const [tokens, setTokens] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [value, setValue] = useState('');
  const [verificationCount, setVerificationCount] = useState(1);
  const [meta, setMeta] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAllTokens = async () => {
    try {
      const response = await fetch(`${API_URL}/token`);
      const data = await response.json();
      setTokens(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllTokens();
  }, []);

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/token/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          value,
          verificationCount,
          meta,
          name: tokenName,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        }),
      });
      const result = await response.json();
      fetchAllTokens();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBurn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/token/burn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          amount: value,
        }),
      });
      const result = await response.json();
      fetchAllTokens();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}/token/${searchId}`);
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
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
          <h2>Token Mint (New)</h2>
          <p className="section-description">Create and deploy a new token on-chain.</p>
          <form onSubmit={handleMint}>
            <label>Token Name</label>
            <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Token Name" />
            <label>Symbol</label>
            <input value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} placeholder="Token Symbol" />
            <label>Decimals</label>
            <input value={tokenDecimals} onChange={(e) => setTokenDecimals(e.target.value)} placeholder="Token Decimals" />
            <label>Token ID</label>
            <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="Token ID" />
            <label>Amount</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Amount" />
            <label>Verification Count</label>
            <input value={verificationCount} onChange={(e) => setVerificationCount(e.target.value)} placeholder="Verification Count" />
            <label>Meta Tags</label>
            <textarea value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="Meta Tags" />
            <button type="submit" className="mint-btn" disabled={loading}>Mint Token</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Token Burn</h2>
          <p className="section-description">Burn a token and remove it from the system.</p>
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
          <h2>Results</h2>
          <p className="section-description">A table listing all token activity with full metadata.</p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date Issued</th>
                  <th>Token ID</th>
                  <th>Value</th>
                  <th>Count</th>
                  <th>Status</th>
                  <th>Meta</th>
                  <th>Date Burn</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>No tokens available</td>
                  </tr>
                ) : (
                  tokens.map((t, i) => (
                    <tr key={i}>
                      <td>{new Date(t.issuedDate).toLocaleDateString()}</td>
                      <td>{t.tokenId}</td>
                      <td>{t.value}</td>
                      <td>{t.verificationCount}</td>
                      <td>{t.verifiedStatus}</td>
                      <td>{t.meta}</td>
                      <td>{t.burnDate ? new Date(t.burnDate).toLocaleDateString() : '—'}</td>
                      <td>{t.owner}</td>
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