import React, { useEffect, useState } from 'react';
import './CommunityBuilderScreen.css';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const CommunityBuilder = () => {
  const [builders, setBuilders] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState('');
  const [communityIds, setCommunityIds] = useState([]);
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [newCommunityName, setNewCommunityName] = useState('');
  
  // Builder form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userId: '',
    email: '',
    wallet: ''
  });

  const [searchUsername, setSearchUsername] = useState('');
  const [updateData, setUpdateData] = useState({
    fullName: '',
    userId: '',
    email: ''
  });

  // Fetch all builders on mount
  useEffect(() => {
    axios.get(`${API}/builders/all`)
      .then(res => setBuilders(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch communities and members when builder is selected
  useEffect(() => {
    if (!selectedBuilder) return;

    axios.get(`${API}/builders/communities/${selectedBuilder}`)
      .then(res => setCommunityIds(res.data))
      .catch(err => console.error(err));

    axios.get(`${API}/builders/members/${selectedBuilder}`)
      .then(res => setRegisteredMembers(res.data))
      .catch(err => console.error(err));
  }, [selectedBuilder]);

  const handleBuilderSelect = (e) => setSelectedBuilder(e.target.value);

  const handleCreateBuilder = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords don't match");
    }

    axios.post(`${API}/builders/create`, formData)
      .then(() => {
        alert('Builder created');
        setFormData({ username: '', password: '', confirmPassword: '', fullName: '', userId: '', email: '', wallet: '' });
        return axios.get(`${API}/builders/all`);
      })
      .then(res => setBuilders(res.data))
      .catch(err => console.error(err));
  };

  const handleUpdateBuilder = () => {
    axios.put(`${API}/builders/update/${searchUsername}`, updateData)
      .then(() => alert('Builder updated'))
      .catch(err => console.error(err));
  };

  const handleDeleteBuilder = () => {
    axios.delete(`${API}/builders/delete/${searchUsername}`)
      .then(() => {
        alert('Builder deleted');
        return axios.get(`${API}/builders/all`);
      })
      .then(res => setBuilders(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="route-fade">
      <div className="community-builder-page">

        {/* Left: Create / Update / Delete */}
        <div className="left-section">
          <div className="form-section">
            <h2>Creation of Community Builders</h2>
            <form onSubmit={handleCreateBuilder}>
              <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              <input type="text" placeholder="ID" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              <input type="text" placeholder="Wallet Address" value={formData.wallet} onChange={e => setFormData({ ...formData, wallet: e.target.value })} />
              <button type="submit" className="create-btn">Create User</button>
            </form>
          </div>

          <div className="form-section">
            <h2>Alteration or Deletion</h2>
            <input type="text" placeholder="Search Username" value={searchUsername} onChange={e => setSearchUsername(e.target.value)} />
            <input type="text" placeholder="Full Name" value={updateData.fullName} onChange={e => setUpdateData({ ...updateData, fullName: e.target.value })} />
            <input type="text" placeholder="ID" value={updateData.userId} onChange={e => setUpdateData({ ...updateData, userId: e.target.value })} />
            <input type="email" placeholder="Email" value={updateData.email} onChange={e => setUpdateData({ ...updateData, email: e.target.value })} />
            <div className="button-group">
              <button className="delete-btn" type="button" onClick={handleDeleteBuilder}>Delete</button>
              <button className="update-btn" type="button" onClick={handleUpdateBuilder}>Update</button>
            </div>
          </div>
        </div>

        {/* Right: Builder Info */}
        <div className="right-section">
          <div className="info-box builder-meta-card">
            <div className="builder-meta-section">
              <h2>Select Builder</h2>
              <select className="builder-dropdown" value={selectedBuilder} onChange={handleBuilderSelect}>
                <option value="">-- Select Builder --</option>
                {builders.map(b => (
                  <option key={b.username} value={b.username}>{b.username}</option>
                ))}
              </select>
            </div>

            <div className="builder-meta-section">
              <h2>Community IDs</h2>
              <p className="section-description">
                {selectedBuilder ? `Communities assigned to ${selectedBuilder}.` : 'Select a builder to view communities.'}
              </p>
              <ul className={`scrollable-list ${selectedBuilder && communityIds.length > 0 ? 'expanded' : ''}`}>
                {selectedBuilder && communityIds.length > 0 ? (
                  communityIds.map((id, i) => <li key={i}>{id}</li>)
                ) : (
                  <li className="placeholder">No communities to display.</li>
                )}
              </ul>
            </div>

            <div className="builder-meta-section">
              <h2>Registered Members</h2>
              <p className="section-description">
                {selectedBuilder ? `Members created by ${selectedBuilder}.` : 'Select a builder to view members.'}
              </p>
              <ul className={`scrollable-list ${selectedBuilder && registeredMembers.length > 0 ? 'expanded' : ''}`}>
                {selectedBuilder && registeredMembers.length > 0 ? (
                  registeredMembers.map((m, i) => <li key={i}>{m}</li>)
                ) : (
                  <li className="placeholder">No members to display.</li>
                )}
              </ul>
            </div>

            {/* Create Community */}
            <div className="builder-meta-section">
              <h2>Create Community</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!selectedBuilder || !newCommunityName) return;
                axios.post(`${API}/builders/${selectedBuilder}/create-community`, { name: newCommunityName })
                  .then(() => {
                    setNewCommunityName('');
                    return axios.get(`${API}/builders/communities/${selectedBuilder}`);
                  })
                  .then(res => setCommunityIds(res.data))
                  .catch(err => console.error(err));
              }}>
                <input
                  type="text"
                  placeholder="Community Name"
                  value={newCommunityName}
                  onChange={e => setNewCommunityName(e.target.value)}
                />
                <button type="submit" className="create-btn" disabled={!selectedBuilder}>Create Community</button>
              </form>
            </div>
          </div>

          {/* Token Info */}
          <div className="info-box">
            <h2>Salawat Token ID</h2>
            <p className="token-value">@SALAWAT8745</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBuilder;
