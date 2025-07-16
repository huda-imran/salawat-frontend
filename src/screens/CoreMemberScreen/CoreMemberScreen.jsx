import React, { useEffect, useState } from 'react';
import './CoreMemberScreen.css';
import { useMessage } from '../../context/MessageContext'; // adjust path if needed
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const CoreMemberScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const { showMessage } = useMessage();
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    id: '',
    email: '',
  });
  const [editUser, setEditUser] = useState({
    username: '',
    fullName: '',
    id: '',
    email: '',
  });

  const [fetchedUser, setFetchedUser] = useState(null);  // Added state to hold fetched user info

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

  const fetchUserInfo = async (username) => {
    if (!username) {
      showMessage('error', 'Please enter a username to search.');
      return;
    }

    try {
      const res = await axios.get(`${API}/core/${username}`);
      console.log(res.data);
      if (res.data.success) {
        setFetchedUser(res.data.user);  // Store the fetched user data
        setEditUser({
          username: res.data.user.username,
          fullName: res.data.user.fullName,
          id: res.data.user.id,
          email: res.data.user.email,
        });
      } else {
        showMessage('error', 'User not found.');
        setFetchedUser(null);  // Clear the fetched user data if not found
        setEditUser({ username: '', fullName: '', id: '', email: '' });
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to fetch user info. Please try again.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      showMessage('error', "Passwords do not match.");
      return;
    }
    try {
      showMessage('loading', 'Creating core user...');
      await axios.post(`${API}/core/create`, newUser);
      showMessage('success', 'Core user created successfully.');
      fetchUsers();
      setNewUser({ username: '', password: '', confirmPassword: '', fullName: '', id: '', email: '' });
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        showMessage('error', err);
      } else {
        showMessage('error', 'Failed to create core user. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (!editUser.username) return showMessage('error', 'Please enter a username to delete.');
      showMessage('loading', 'Deleting core user...');
      await axios.delete(`${API}/core/delete/${editUser.username}`);
      showMessage('success', 'Core user deleted successfully.');
      fetchUsers();
      setEditUser({ username: '', fullName: '', id: '', email: '' });
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to delete core user. Please try again.');
    }
  };

  const handleDynamicUpdate = async () => {
    try {
      if (!editUser.username || !selectedField || !fieldValue) {
        return showMessage('error', 'Please complete all fields before updating.');
      }

      showMessage('loading', `Updating ${selectedField}...`);

      const payload = { [selectedField]: fieldValue };

      await axios.put(`${API}/core/update/${editUser.username}`, payload);
      showMessage('success', `${selectedField} updated successfully.`);

      fetchUsers();
      setEditUser({ username: '', fullName: '', id: '', email: '' });
      setSelectedField('');
      setFieldValue('');
    } catch (err) {
      console.error(err);
      showMessage('error', `Failed to update ${selectedField}.`);
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
              <input type="text" placeholder="ID" value={newUser.id} onChange={e => setNewUser({ ...newUser, id: e.target.value })} />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <button type="submit" className="create-btn">Create User</button>
            </form>
          </div>

          <div className="form-section">
            <h2>Alteration or Deletion</h2>
            <p className="section-description">
              Select a field to update or delete the user.
            </p>

            <input type="text" placeholder="Search Username" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            <button onClick={() => fetchUserInfo(editUser.username)}>Search</button>

            <label>Select Field to Update</label>
            <select value={selectedField} onChange={e => setSelectedField(e.target.value)}>
              <option value="">-- Select Field --</option>
              <option value="fullName">Full Name</option>
              <option value="id">ID</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>

            {selectedField && (
              <input
                type={selectedField === 'email' ? 'email' : 'text'}
                placeholder={`New ${selectedField === 'id' ? 'ID' : selectedField === 'fullName' ? 'Full Name' : selectedField}`}
                value={fieldValue}
                onChange={e => setFieldValue(e.target.value)}
              />
            )}

            <div className="button-group">
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <button className="update-btn" onClick={handleDynamicUpdate}>Update</button>
            </div>

                {/* Display fetched user info below the search button */}
            {fetchedUser && (
              <div className="user-info-display">
                <p><strong>Username:</strong> {fetchedUser.username}</p>
                <p><strong>Full Name:</strong> {fetchedUser.fullName}</p>
                <p><strong>ID:</strong> {fetchedUser.id}</p>
                <p><strong>Email:</strong> {fetchedUser.email}</p>
              </div>
            )}
          </div>

        </div>

        

        <div className="bottom-section">
          <div className="info-box">
            <h2>Core Users</h2>
            <p className="section-description">List of all Level 1 Core Users.</p>
            <ul>
              {users.map((user, i) => (
                <li key={i}>
                  <strong>{user.username}</strong><br />
                  <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{user.walletAddress}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreMemberScreen;
