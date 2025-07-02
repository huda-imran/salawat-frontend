
import React, { useEffect, useState } from 'react';
import './CommunityBuilderScreen.css';
import axios from 'axios';
import { useMessage } from '../../context/MessageContext'; // adjust path if needed

const API = process.env.REACT_APP_API_URL;

const CommunityBuilder = ({user}) => {
  const [builders, setBuilders] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState('');
  const [communityIds, setCommunityIds] = useState([]);
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [newCommunityName, setNewCommunityName] = useState('');
  const { showMessage } = useMessage();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    id: '',
    email: '',
    createdBy:''
  });

  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [searchUsername, setSearchUsername] = useState('');

  useEffect(() => {
    fetchBuilders();

  }, []);

  useEffect(() => {
    if (!selectedBuilder) return;
    
    axios.get(`${API}/builder/communities/${selectedBuilder}`)
      .then(res => setCommunityIds(res.data))
      .catch(err => console.error(err));

    axios.get(`${API}/builder/members/${selectedBuilder}`)
      .then(res => setRegisteredMembers(res.data))
      .catch(err => console.error(err));
  }, [selectedBuilder]);

  const fetchBuilders = async () => {
    try {
      const res = await axios.get(`${API}/builder/all`);
      console.log(res.data)
      setBuilders(res.data);
      
    } catch (err) {
      console.error(err);
    }
  };


  const handleBuilderSelect = (e) => setSelectedBuilder(e.target.value);

  const handleCreateBuilder = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return showMessage('error', "Passwords don't match");
    //if (!formData.assignedCommunity) return showMessage('error', "Please select a community to assign");

    showMessage('loading', 'Creating builder...');
    axios.post(`${API}/builder/create`, { ...formData, createdBy: user?.username })
      .then(() => {
        showMessage('success', 'Builder created');
        setFormData({
          username: '', password: '', confirmPassword: '', fullName: '',
          id: '', email: '', createdBy: ''
        });
        fetchBuilders();
      })
      .catch(err => {
        console.error(err);
        showMessage('error', 'Builder creation failed');
      });
  };

  const handleDeleteBuilder = () => {
    if (!searchUsername) return showMessage('error', 'Please enter a username to delete.');
    showMessage('loading', 'Deleting Builder...');
    axios.delete(`${API}/builder/delete/${searchUsername}`)
      .then(() => {
        showMessage('success', 'Builder deleted');
        fetchBuilders();
        setSearchUsername('');
        setSelectedField('');
        setFieldValue('');
      })
      .catch(err => {
        console.error(err);
        showMessage('error', 'Delete failed');
      });
  };

  const handleDynamicUpdate = () => {
    if (!searchUsername || !selectedField || !fieldValue) {
      return showMessage('error', 'Fill all update fields');
    }
    showMessage('loading', 'Updating...');
    const payload = { [selectedField]: fieldValue };
    axios.put(`${API}/builder/update/${searchUsername}`, payload)
      .then(() => {
        showMessage('success', `${selectedField} updated`);
        fetchBuilders();
        setSearchUsername('');
        setSelectedField('');
        setFieldValue('');
      })
      .catch(err => {
        console.error(err);
        showMessage('error', 'Update failed');
      });
  };

  return (
    <div className="route-fade">
      <div className="community-builder-page">

        {/* Left Section */}
        <div className="left-section">

          {/* Create Builder */}
          <div className="form-section">
            <h2>Creation of Community Builders</h2>
            <form onSubmit={handleCreateBuilder}>
              <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              <input type="text" placeholder="ID" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              {/* <select value={formData.assignedCommunity} onChange={e => setFormData({ ...formData, assignedCommunity: e.target.value })}>
                <option value="">-- Select Community --</option>
                {communityIds.map((id, idx) => (
                  <option key={idx} value={id}>{id}</option>
                ))}
              </select> */}
              <button type="submit" className="create-btn">Create User</button>
            </form>
          </div>

          {/* Update/Delete */}
          <div className="form-section">
            <h2>Alteration or Deletion</h2>
            <input type="text" placeholder="Search Username" value={searchUsername} onChange={e => setSearchUsername(e.target.value)} />
            <select value={selectedField} onChange={e => setSelectedField(e.target.value)}>
              <option value="">-- Select Field --</option>
              <option value="fullName">Full Name</option>
              <option value="id">ID</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>
            {selectedField && (
              <input type="text" placeholder={`New ${selectedField}`} value={fieldValue} onChange={e => setFieldValue(e.target.value)} />
            )}
            <div className="button-group">
              <button className="delete-btn" onClick={handleDeleteBuilder}>Delete</button>
              <button className="update-btn" onClick={handleDynamicUpdate}>Update</button>
            </div>
          </div>

          <div className="info-box">
            <h2>All Builders</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Wallet</th>
                </tr>
              </thead>
              <tbody>
                {builders.map((builder, index) => (
                  <tr key={index}>
                    <td>{builder.username}</td>
                    <td>{builder.walletAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 

        </div>

        {/* Right Section */}
        {/* <div className="right-section">
          <div className="info-box builder-meta-card">
            <div className="builder-meta-section">
              <h2>Select Builder</h2>
              <select className="builder-dropdown" value={selectedBuilder} onChange={e => setSelectedBuilder(e.target.value)}>
                <option value="">-- Select Builder --</option>
                {builders.map(b => (
                  <option key={b.username} value={b.username}>{b.username}</option>
                ))}
              </select>
            </div>

            <div className="builder-meta-section">
              <h2>Community IDs</h2>
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
              <ul className={`scrollable-list ${selectedBuilder && registeredMembers.length > 0 ? 'expanded' : ''}`}>
                {selectedBuilder && registeredMembers.length > 0 ? (
                  registeredMembers.map((m, i) => <li key={i}>{m}</li>)
                ) : (
                  <li className="placeholder">No members to display.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="info-box">
            <h2>Salawat Token ID</h2>
            <p className="token-value">@SALAWAT8745</p>
          </div>

          <div className="info-box">
            <h2>All Builders</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Wallet</th>
                  <th>Communities</th>
                </tr>
              </thead>
              <tbody>
                {builders.map((builder, index) => (
                  <tr key={index}>
                    <td>{builder.username}</td>
                    <td>{builder.wallet}</td>
                    <td>{builder.communities?.join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        <div className="right-section">
        <div className="info-box">
            <h2>Salawat Token ID</h2>
            <p className="token-value">{process.env.REACT_APP_SALAWAT_TOKEN}</p>
          </div>

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
                 communityIds.map((comm, i) => (
                  <li key={i}>
                    <strong>{comm.name}</strong><br />
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{comm.communityId}</span>
                  </li>
                ))
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
                  registeredMembers.map((m, i) => (
                    <li key={i}>
                      <strong>{m.username}</strong><br />
                      <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{m.walletAddress}</span><br />
                      <span style={{ fontSize: '0.8rem', color: '#777' }}>Community: {m.communityId}</span>
                    </li>
                  ))
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
                axios.post(`${API}/builder/create-community`, { name: newCommunityName, builderUsername: selectedBuilder })
                  .then(() => {
                    setNewCommunityName('');
                    return axios.get(`${API}/builder/communities/${selectedBuilder}`);
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
          

         
        </div>
      </div>
    </div>
  );
};

export default CommunityBuilder;