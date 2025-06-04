import React from 'react';
import './UserSearchUpdateDelete.css';

const UserSearchUpdateDelete = () => {
  return (
    <div className="user-search-update-delete">
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
  );
};

export default UserSearchUpdateDelete;
