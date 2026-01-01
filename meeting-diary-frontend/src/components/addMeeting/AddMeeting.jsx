import { useEffect, useState } from "react";
import { addMeeting } from "../../services/api";
import "./AddMeeting.css";

export default function AddMeeting({ user, token, onMeetingAdded, setToggleAddMeetingStatus}) {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        // getting all the users with the name and last_name
        const res = await fetch("https://meeting-diary-backend.onrender.com/allusers"/* "http://localhost:3000/allusers"*/, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        // filter the owner from the list
        const filteredUsers = data.filter((u) => u.user_id !== user.user_id);

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
        end_time,
        notes,
        owner_user: user.user_id,
        participants: selectedUsers,
      };

      await addMeeting(meeting, token);
      onMeetingAdded();
      alert("succesfull");
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <div className="addMeetingContainer">
      <div className="titleAddCloseMeeting">
        <h3 className="titleMeeting">
          <b>Add Meeting</b>
        </h3>
        <b>
          <button
            type="button"
            className="closeAddMeeting"
            onClick={setToggleAddMeetingStatus}>
            X
          </button>
        </b>
      </div>
      <div className="inputsContainer">
        <label htmlFor="Title">Title</label>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="place">Location</label>
        <input
          placeholder="Location"
          onChange={(e) => setPlace(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <input type="date" onChange={(e) => setDate(e.target.value)} />

        <label htmlFor="time">Start At</label>
        <input type="time" onChange={(e) => setTime(e.target.value)} />

        <label htmlFor="time">End At</label>
        <input type="time" onChange={(e) => setEndTime(e.target.value)} />

        <label htmlFor="notes">Notes</label>
        <textarea
          style={{ width: "75%" }}
          className="notesMeeting"
          name="notes"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="">
        <div className="participantsDropdown">
          <button
            type="button"
            className="dropdownToggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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

        <button className="addMeetingButton" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
