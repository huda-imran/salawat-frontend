import React, { useEffect, useState } from 'react';
import './MemberScreen.css';

const MemberScreen = ({user}) => {
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
                <th>Community ID</th>
                <th>Token ID</th>
                <th>Status</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>COMM0001</td>
                <td>12345</td>
                <td>Pending</td>
                <td><a href="http://example.com" target="_blank" rel="noreferrer">Link</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section: Count Submit Form */}
        <div className="section verification-count-submit">
          <h2>Count Submit</h2>
          <p className="section-description">
            Submit how many times the action was completed by the community member for a specific token.
          </p>
          <form>
            <label>Token ID</label>
            <input type="text" placeholder="Enter Token ID" />

            <label>Verification Count</label>
            <input type="number" placeholder="Enter Count" />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberScreen;
