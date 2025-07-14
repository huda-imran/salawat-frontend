import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommunityMemberScreen.css';
import { useMessage } from './../../context/MessageContext'

const API = process.env.REACT_APP_API_URL;

const CommunityMemberScreen = ({ user }) => {
  const [communityIds, setCommunityIds] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    id: '',
    email: '',
  });
  const [searchUsername, setSearchUsername] = useState('');
  const [editUser, setEditUser] = useState(null);

  const { showMessage, hideMessage } = useMessage();

  useEffect(() => {
    axios
      .get(`${API}/builder/communities/${user?.username}`)
      .then((res) => setCommunityIds(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      axios
        .get(`${API}/builder/members/${user?.username}`)
        .then((res) => setMembers(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedCommunity]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/builder/members/${user?.username}`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, []);
  

  useEffect(() => {
    console.log("heree");
    axios
      .get(`${API}/builder/members/${user?.username}`)
      .then((res) => {
        console.log("Response data:", res.data);
        setMembers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  

  const handleCreate = async (e) => {
    e.preventDefault();
  
    if (newUser.password !== newUser.confirmPassword) {
      return showMessage('error', 'Passwords do not match.');
    }
  
    try {
      showMessage('loading', 'Creating member...');
      const res = await axios.post(`${API}/member/create`, {
        ...newUser,
        createdBy: user.username,
        communityId: selectedCommunity,
      });
  
      showMessage('success', 'Member created and added to community!');
      setNewUser({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        id: '',
        email: '',
      });
      setSelectedCommunity('');
    } catch (err) {
      console.error(err);
      showMessage('error', err.response?.data?.message || 'Failed to create member');
    }
    await fetchMembers();
  };
  

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
  
    try {
      showMessage('loading', 'Searching...');
      const res = await axios.post(`${API}/member/search`, {
        builderUsername: user.username,
        query: searchUsername.trim(),
      });
      setEditUser(res.data);
      hideMessage();
    } catch (err) {
      setEditUser(null);
      showMessage('error', err.response?.data?.message || 'User not found');
    }
  };
  

  const handleUpdate = async () => {
    try {
      showMessage('loading', 'Updating member...');
      await axios.put(`${API}/member/update/${searchUsername}`, editUser);
      showMessage('success', 'Member updated successfully');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to update member');
    }
  };

  const handleDelete = async () => {
    try {
      showMessage('loading', 'Removing member...');
  
      await axios.delete(`${API}/member/delete`, {
        data: {
          username: searchUsername,
          createdBy: user.username
        }
      });
  
      showMessage('success', 'Member removed and deleted');
      setEditUser(null);
      setSearchUsername('');
    } catch (err) {
      console.error(err);
      showMessage('error', err.response?.data?.message || 'Failed to delete member');
    }
    await fetchMembers();
  };
  

  return (
    <div className="route-fade">
      <div className="community-member-screen">
        <div className="form-modules-container">
          {/* LEFT MODULE */}
          <div className="section left user-creation-form">
            <h2>Creation of Community Members</h2>
            <p className="section-description">
              Add new Level 3 users (Community Members) who will be managed by community builders.
            </p>
            <form onSubmit={handleCreate}>
              <label>Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />

              <label>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              />

              <label>Full Name</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              />

              <label>ID</label>
              <input
                type="text"
                value={newUser.id}
                onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
              />

              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              <label>Assign to Community ID</label>
              <select value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value)}>
                <option value="">Select Community</option>
                  {communityIds.map((c) => (
                  <option key={c.communityId} value={c.communityId}>
                    {c.name}
                  </option>
                ))}

              </select>

              <button type="submit" className="create-btn">
                Create User
              </button>
            </form>
          </div>

          {/* RIGHT MODULE */}
          <div className="section right user-search-update-delete">
            <h2>Alteration or Deletion</h2>
            <p className="section-description">
              Update or remove an existing user by searching with their username.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
            <label>Search Member (username/email/wallet)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
              <button type="button" onClick={handleSearch} className="search-btn">Search</button>
            </div>


              {editUser && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editUser.fullName}
                    onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                  />

                  <label>ID</label>
                  <input
                    type="text"
                    value={editUser.id}
                    onChange={(e) => setEditUser({ ...editUser, id: e.target.value })}
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />

                  {/* <label>Password</label>
                  <input
                    type="password"
                    value={editUser.password}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  /> */}

                  <div className="button-group">
                    <button type="button" className="delete-btn" onClick={handleDelete}>
                      Delete
                    </button>
                    <button type="button" className="update-btn" onClick={handleUpdate}>
                      Update
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* TABLE MODULE */}
          <div className="bottom-section">
            <div className="info-box">
              <h2>Community Members</h2>
              <p className="section-description">List of all Level 3 Members under this builder’s community.</p>
              <ul>
                {members.length === 0 ? (
                  <li>
                    <em>No members found for this community.</em>
                  </li>
                ) : (
                  members.map((member, i) => (
                    <li key={i}>
                      <strong>{member.username}</strong>
                      <br />
                      <span>{member.walletAddress}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMemberScreen;
