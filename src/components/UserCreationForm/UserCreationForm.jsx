import React from 'react';
import './UserCreationForm.css';

const UserCreationForm = () => {
  return (
    <div className="user-creation-form">
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
  );
};

export default UserCreationForm;
