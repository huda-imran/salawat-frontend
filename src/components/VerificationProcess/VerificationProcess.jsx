import React from 'react';
import './VerificationProcess.css';

const VerificationProcess = () => {
  return (
    <div className="verification-process">
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
            <td>http://example.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VerificationProcess;
