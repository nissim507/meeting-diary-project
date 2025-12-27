import { useEffect, useState } from "react";
import { addMeeting } from "../../services/api";
import "./addMeeting.css";

export default function AddMeeting({ user, token, onMeetingAdded }) {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        // getting all the users with the name and last_name
        const res = await fetch("http://localhost:3000/allusers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        // filter the owner from the list
        const filteredUsers = data.filter((u) => u.user_id !== user.id);

        setUsers(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }, [token, user.user_id]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
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

  return (
    <div className="addMeetingContainer">
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

      <div className="participantsDropdown">
        <button
          type="button"
          className="dropdownToggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedUsers.length === 0
            ? "Select participants..."
            : `${selectedUsers.length} selected`}
          <span className={`arrow ${isDropdownOpen ? "open" : ""}`}>▼</span>
        </button>

        {isDropdownOpen && (
          <div className="dropdownMenu">
            {users.length === 0 ? (
              <p className="noUsers">No participants available</p>
            ) : (
              users.map((u) => (
                <label key={u.user_id} className="participantOption">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.user_id)}
                    onChange={() => toggleUser(u.user_id)}
                  />
                  <span>
                    {u.name} {u.last_name}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      <br />
      <button onClick={handleAdd}>Add Meeting</button>
    </div>
  );
}
