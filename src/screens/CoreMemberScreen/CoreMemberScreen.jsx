import React, { useEffect, useState } from 'react';
import './CoreMemberScreen.css';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const CoreMemberScreen = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userId: '',
    email: '',
  });
  const [editUser, setEditUser] = useState({
    username: '',
    fullName: '',
    userId: '',
    email: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/core`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) return alert("Passwords don't match");
    try {
      await axios.post(`${API}/core/create`, newUser);
      fetchUsers();
      setNewUser({ username: '', password: '', confirmPassword: '', fullName: '', userId: '', email: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/core/delete/${editUser.username}`);
      fetchUsers();
      setEditUser({ username: '', fullName: '', userId: '', email: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/core/update/${editUser.username}`, editUser);
      fetchUsers();
      setEditUser({ username: '', fullName: '', userId: '', email: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='route-fade'>
      <div className="core-member-page">
        <div className="top-section">
          <div className="form-section">
            <h2>Creation of Core Users</h2>
            <p className="section-description">
              Add new Level 1 users (Core Users) who will manage community builders.
            </p>
            <form onSubmit={handleCreate}>
              <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
              <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" value={newUser.confirmPassword} onChange={e => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
              <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
              <input type="text" placeholder="ID" value={newUser.userId} onChange={e => setNewUser({ ...newUser, userId: e.target.value })} />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <button type="submit" className="create-btn">Create User</button>
            </form>
          </div>

          <div className="form-section">
            <h2>Alteration or Deletion</h2>
            <p className="section-description">Update or remove an existing user by searching with their username.</p>
            <input type="text" placeholder="Search Username" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            <input type="text" placeholder="Full Name" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} />
            <input type="text" placeholder="ID" value={editUser.userId} onChange={e => setEditUser({ ...editUser, userId: e.target.value })} />
            <input type="email" placeholder="Email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
            <div className="button-group">
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <button className="update-btn" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="info-box">
            <h2>Core Users</h2>
            <p className="section-description">List of all Level 1 Core Users.</p>
            <ul>
              {users.map((user, i) => (
                <li key={i}>{user.username}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreMemberScreen;
