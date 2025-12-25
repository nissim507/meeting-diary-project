// import { useState } from 'react';
// import { getParticipantsByMeeting } from '../services/api';

// export default function MeetingCard({ meeting, token }) {
//   const [showParticipants, setShowParticipants] = useState(false);
//   const [participants, setParticipants] = useState([]);

//   const loadParticipants = async () => {
//     try {
//       const data = await getParticipantsByMeeting(
//         meeting.meeting_id,
//         token
//       );
//       setParticipants(data);
//       setShowParticipants(!showParticipants);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ border: '1px solid gray', padding: 10, marginBottom: 10 }}>
//       <h4>{meeting.title}</h4>
//       <p>
//         {meeting.time} – {meeting.place}
//       </p>

//       <button onClick={loadParticipants}>
//         {showParticipants ? 'Hide participants' : 'Show participants'}
//       </button>

//       {showParticipants && (
//         <ul>
//           {participants.map((p) => (
//             <li key={p.participant_id}>
//               {p.username} – <b>{p.status}</b>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
