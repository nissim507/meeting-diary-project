import { useEffect, useState } from 'react';
import {
  getParticipantsByMeeting,
  deleteMeeting,
  changeMyStatus,
  addParticipant,
  removeParticipant,
  getUsersNotInMeeting
} from '../../services/api';

export default function MeetingCard({ meeting, token, user, onMeetingDeleted }) {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [usersNotInMeeting, setUsersNotInMeeting] = useState([]);

  // Load participants
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const data = await getParticipantsByMeeting(meeting.meeting_id, token);
        setParticipants(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadParticipants();
  }, [meeting.meeting_id, token]);

  const isOwner = user && meeting.owner_user === user.id;
  const isParticipant = user && participants.some(p => p.user_id === user.id);

  const toggleParticipants = () => setShowParticipants(prev => !prev);

  const handleChangeStatus = async (newStatus) => {
    try {
      setStatusLoading(true);
      await changeMyStatus(meeting.meeting_id, user.id, newStatus, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
      setShowStatusSelect(false);
    } catch (err) {
      console.error(err);
      alert('Failed to change status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      setLoadingDelete(true);
      await deleteMeeting(meeting.meeting_id, token);
      if (onMeetingDeleted) onMeetingDeleted(meeting.meeting_id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete meeting');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleLoadUsersNotInMeeting = async () => {
    try {
      const data = await getUsersNotInMeeting(meeting.meeting_id, token);
      setUsersNotInMeeting(data);
      setShowAddUser(prev => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddParticipant = async (userId) => {
    try {
      setAddingUser(true);
      await addParticipant(meeting.meeting_id, userId, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
      setShowAddUser(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add participant');
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    if (!window.confirm('Remove this participant?')) return;
    try {
      await removeParticipant(meeting.meeting_id, userId, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
    } catch (err) {
      console.error(err);
      alert('Failed to remove participant');
    }
  };

  const openGoogleMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const isZoom = meeting.place.toLowerCase().includes('zoom');

  return (
    <div style={{ border: '1px solid gray', padding: 10, marginBottom: 10 }}>
      <h4>{meeting.title}</h4>

      <p>
        {meeting.time} – {meeting.place}
        {!isZoom && <button onClick={() => openGoogleMaps(meeting.place)} style={{ marginLeft: 5 }}>show map</button>}
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={toggleParticipants}>
          {showParticipants ? 'Hide participants' : 'Show participants'}
        </button>

        {isParticipant && <button onClick={() => setShowStatusSelect(prev => !prev)}>Change Status</button>}

        {isOwner && <button onClick={handleLoadUsersNotInMeeting}>Add participant</button>}
      </div>

      {isParticipant && showStatusSelect && (
        <div style={{ marginTop: 8 }}>
          <select disabled={statusLoading} defaultValue="" onChange={(e) => handleChangeStatus(e.target.value)}>
            <option value="" disabled>Select status</option>
            <option value="pending">Pending</option>
            <option value="arrived">Arrived</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      )}

      {isOwner && showAddUser && (
        <div style={{ marginTop: 8 }}>
          <select disabled={addingUser} defaultValue="" onChange={(e) => handleAddParticipant(e.target.value)}>
            <option value="" disabled>Select user</option>
            {usersNotInMeeting.map(u => (
              <option key={u.user_id} value={u.user_id}>
                {u.name || 'No Name'} {u.last_name || 'No Last Name'}
              </option>
            ))}
          </select>
        </div>
      )}

      {showParticipants && (
        <ul style={{ marginTop: 10 }}>
          {participants.map(p => (
            <li key={p.participant_id}>
              {p.name} {p.last_name} – <b>{p.status}</b>
              {isOwner && p.user_id !== user.id && (
                <button onClick={() => handleRemoveParticipant(p.user_id)} style={{ marginLeft: 10, color: 'red' }}>Remove</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <button onClick={handleDelete} disabled={loadingDelete} style={{ color: 'red', marginTop: 10 }}>
          {loadingDelete ? 'Deleting...' : 'Delete Meeting'}
        </button>
      )}
    </div>
  );
}
