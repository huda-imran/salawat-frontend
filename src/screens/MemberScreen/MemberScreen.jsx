import React, { useEffect, useState } from 'react';
import './MemberScreen.css';
import axios from 'axios';
import { useMessage } from '../../context/MessageContext'; // adjust path if needed


const MemberScreen = ({ user }) => {
  const [tokenId, setTokenId] = useState('');
  const [count, setCount] = useState('');
  const [requests, setRequests] = useState([]);
    const { showMessage } = useMessage();

  // Fetch existing verification requests on mount
  useEffect(() => {
    if (user?.username) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/member/verification-requests/${user.username}`)
        .then(res => setRequests(res.data))
        .catch(err => console.error('❌ Failed to fetch requests:', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!tokenId || !count) return showMessage('error', 'Please fill in both fields');

  showMessage('loading', 'Submitting count ...');

  // Wait 500ms after showing loading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/member/submit-verification`, {
      memberUsername: user.username,
      tokenId,
      count: Number(count),
    });

    showMessage('success', 'Submitted!');
    setTokenId('');
    setCount('');

    // Refresh table
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/member/verification-requests/${user.username}`);
    setRequests(res.data);

  } catch (err) {
    console.error('❌ Error submitting request:', err);
    showMessage('error', 'Failed to submit');
  }
};


  return (
    <div className="route-fade">
      <div className="member-screen">

        {/* Section: Community Info */}
        <div className="section community-info">
          <h2>Community & Builder Details</h2>
          <p><strong>Community ID:</strong> {user?.communityId || 'N/A'}</p>
          <p><strong>Builder Username:</strong> {user?.builderUsername || 'N/A'}</p>
          <p><strong>Builder Wallet:</strong> {user?.builderWallet || 'N/A'}</p>
        </div>

        {/* Section: Verification Process Table */}
        <div className="section verification-process">
          <h2>Verification Process</h2>
          <table>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="3">No requests submitted yet.</td></tr>
              ) : (
                requests.map((req, idx) => (
                  <tr key={idx}>
                    <td>{req.tokenId}</td>
                    <td>{req.count}</td>
                    <td>{req.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Section: Count Submit Form */}
        <div className="section verification-count-submit">
          <h2>Count Submit</h2>
          <p className="section-description">
            Submit how many times the action was completed by the community member for a specific token.
          </p>
          <form onSubmit={handleSubmit}>
            <label>Token ID</label>
            <input
              type="text"
              placeholder="Enter Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />

            <label>Verification Count</label>
            <input
              type="number"
              placeholder="Enter Count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />

            <button type="submit">Submit</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default MemberScreen;
