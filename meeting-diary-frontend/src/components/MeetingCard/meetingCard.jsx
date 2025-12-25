import { useState } from 'react';
import { getParticipantsByMeeting } from '../../services/api';

export default function MeetingCard({ meeting, token }) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);

  const loadParticipants = async () => {
    try {
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
      setShowParticipants(!showParticipants);
    } catch (err) {
      console.error(err);
    }
  };

  // open google maps brawser
  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank'); 
  };

  
  const isZoom = meeting.place.toLowerCase().includes('zoom');

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
    </div>
  );
}
