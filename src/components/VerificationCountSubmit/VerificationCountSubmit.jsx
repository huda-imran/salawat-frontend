import React from 'react';
import './VerificationCountSubmit.css';

const VerificationCountSubmit = () => {
  return (
    <div className="verification-count-submit">
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
  );
};

export default VerificationCountSubmit;
