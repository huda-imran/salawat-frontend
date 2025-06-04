import React from 'react';
import './CommunityMemberScreen.css';

const CommunityMemberScreen = () => {
  return (
    <div className='route-fade'>
      <div className="community-member-screen">
      <div className="form-modules-container">

        {/* LEFT MODULE */}
        <div className="section left user-creation-form">
          <h2>Creation of Community Members</h2>
          <p className="section-description">
            Add new Level 3 users (Community Members) who will be managed by community builders.
          </p>
          <form>
            <label>Username</label>
            <input type="text" placeholder="Username" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />

            <label>Full Name</label>
            <input type="text" placeholder="Full Name" />

            <label>ID</label>
            <input type="text" placeholder="ID" />

            <label>Email</label>
            <input type="email" placeholder="Email" />

            <label>Assign to Community ID</label>
            <select>
              <option value="">Select Community</option>
              <option value="COMM0001">COMM0001</option>
              <option value="COMM0002">COMM0002</option>
            </select>

            <button type="submit">Create User</button>
          </form>
        </div>

        {/* RIGHT MODULE */}
        <div className="section right user-search-update-delete">
          <h2>Alteration or Deletion</h2>
          <p className="section-description">
            Update or remove an existing user by searching with their username.
          </p>
          <form>
            <label>Search Username</label>
            <input type="text" placeholder="Search Username" />

            <label>Full Name</label>
            <input type="text" placeholder="Full Name" />

            <label>ID</label>
            <input type="text" placeholder="ID" />

            <label>Email</label>
            <input type="email" placeholder="Email" />

            <div className="button-group">
              <button type="button" className="delete-btn">Delete</button>
              <button type="button" className="update-btn">Update</button>
            </div>
          </form>
        </div>

      </div>
    </div>
    </div>
    
  );
};

export default CommunityMemberScreen;
