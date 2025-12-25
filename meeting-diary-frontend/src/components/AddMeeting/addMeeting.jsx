import { useEffect, useState } from 'react';
import { addMeeting } from '../../services/api';

export default function AddMeeting({ user, token, onMeetingAdded }) {
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        // getting al the users with the name and last_name
        const res = await fetch('http://localhost:3000/allusers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();

        console.log("user login:",user);


        // filter the owner from the list
        const filteredUsers = data.filter(u => u.user_id !== user.id);

        setUsers(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }, [token, user.user_id]);

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    try {
      const meeting = {
        title,
        place,
        date,
        time,
        owner_user: user.id,
        participants: selectedUsers,
      };

      await addMeeting(meeting, token);
      onMeetingAdded();
    } catch (err) {
      console.error(err);
    }
  };

  console.log('USERS STATE:', users);

  return (
    <div style={{ border: '1px solid black', padding: 15, marginBottom: 20 }}>
      <h3>Add Meeting</h3>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <br />

      <input placeholder="Place" onChange={(e) => setPlace(e.target.value)} />
      <br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <br />

      <input type="time" onChange={(e) => setTime(e.target.value)} />
      <br />

      <h4>Participants</h4>

      {users.map(u => (
        <label key={u.user_id} style={{ display: 'block', color: 'white', marginBottom: '6px' }}>
          <input
            type="checkbox"
            checked={selectedUsers.includes(u.user_id)}
            onChange={() => toggleUser(u.user_id)}
          />
          {u.name} {u.last_name}
        </label>
      ))}

      <br />
      <button onClick={handleAdd}>Add Meeting</button>
    </div>
  );
}
