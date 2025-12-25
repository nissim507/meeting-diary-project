import { useState } from 'react';
import { getParticipantsByMeeting, deleteMeeting } from '../../services/api';

export default function MeetingCard({ meeting, token, user, onMeetingDeleted }) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const loadParticipants = async () => {
    try {
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
      setShowParticipants(!showParticipants);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;

    try {
      setLoadingDelete(true);
      await deleteMeeting(meeting.meeting_id, token);
      if (onMeetingDeleted) onMeetingDeleted(meeting.meeting_id); 
    } catch (err) {
      console.error('Failed to delete meeting', err);
      alert('Failed to delete meeting');
    } finally {
      setLoadingDelete(false);
    }
  };

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const isZoom = meeting.place.toLowerCase().includes('zoom');
  const isOwner = user && meeting.owner_user === user.id;

  return (
    <div style={{ border: '1px solid gray', padding: 10, marginBottom: 10 }}>
      <h4>{meeting.title}</h4>
      <p>
        {meeting.time} – {meeting.place}{' '}
        {!isZoom && (
          <button
            onClick={() => openGoogleMaps(meeting.place)}
            title="Open in Google Maps"
            style={{ cursor: 'pointer', marginLeft: 5 }}
          >
            show map
          </button>
        )}
      </p>

      <button onClick={loadParticipants}>
        {showParticipants ? 'Hide participants' : 'Show participants'}
      </button>

      {showParticipants && (
        <ul>
          {participants.map((p) => (
            <li key={p.participant_id}>
              {p.name} {p.last_name} – <b>{p.status}</b>
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={{ color: 'red', marginTop: 5, cursor: 'pointer' }}
        >
          {loadingDelete ? 'Deleting...' : 'Delete Meeting'}
        </button>
      )}
    </div>
  );
}
