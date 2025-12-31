import { useEffect, useState } from "react";
import {
  getParticipantsByMeeting,
  deleteMeeting,
  changeMyStatus,
  addParticipant,
  removeParticipant,
  getUsersNotInMeeting,
  updateMeeting,
} from "../../services/api";
import EditMeetingForm from "../MeetingCard/components/editMeetingForm/EditMeetingForm";
import MeetingDetails from "../MeetingCard/components/meetingDetails/MeetingDetails";

import "./MeetingCard.css";

export default function MeetingCard({
  meeting,
  token,
  user,
  onMeetingDeleted,
}) {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [usersNotInMeeting, setUsersNotInMeeting] = useState([]);

  // Edit meeting
  const [showEditMeeting, setShowEditMeeting] = useState(false);
  const [editMeetingData, setEditMeetingData] = useState({
    title: meeting.title || "",
    date: meeting.date || "",
    time: meeting.time || "",
    end_time: meeting.end_time || "",
    place: meeting.place || "",
    notes: meeting.notes || "",
  });
  const [updatingMeeting, setUpdatingMeeting] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [ownerName, setOwnerName] = useState("");

  const isOwner = user && meeting.owner_user === user.user_id;
  const isParticipant =
    user && participants.some((p) => p.user_id === user.user_id);
  const editMeetingText = `${showEditMeeting ? "Hide" : "Edit"} Meeting`;

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

  const toggleParticipants = () => setShowParticipants((prev) => !prev);

  const handleChangeStatus = async (newStatus) => {
    try {
      setStatusLoading(true);
      await changeMyStatus(meeting.meeting_id, user.user_id, newStatus, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
      setShowStatusSelect(false);
    } catch (err) {
      console.error(err);
      alert("Failed to change status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this meeting?"))
      return;
    try {
      setLoadingDelete(true);
      await deleteMeeting(meeting.meeting_id, token);
      if (onMeetingDeleted) onMeetingDeleted(meeting.meeting_id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete meeting");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleLoadUsersNotInMeeting = async () => {
    try {
      const data = await getUsersNotInMeeting(meeting.meeting_id, token);
      setUsersNotInMeeting(data);
      setShowAddUser((prev) => !prev);
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
      alert("Failed to add participant");
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    if (!window.confirm("Remove this participant?")) return;
    try {
      await removeParticipant(meeting.meeting_id, userId, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data);
    } catch (err) {
      console.error(err);
      alert("Failed to remove participant");
    }
  };

  const handleEditMeetingChange = (e) => {
    const { name, value } = e.target;
    setEditMeetingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateMeeting = async () => {
    try {
      setUpdatingMeeting(true);

      const payload = {
        meeting_id: meeting.meeting_id,
        title: editMeetingData.title || meeting.title,
        date: editMeetingData.date || meeting.date,
        time: editMeetingData.time || meeting.time,
        end_time: editMeetingData.end_time || meeting.end_time,
        place: editMeetingData.place || meeting.place,
        notes: editMeetingData.notes || meeting.notes,
      };

      await updateMeeting({ meeting: payload }, token);

      Object.assign(meeting, payload);
      setShowEditMeeting(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update meeting");
    } finally {
      setUpdatingMeeting(false);
    }
  };

  const openGoogleMaps = (address) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
      "_blank"
    );
  };

  const openOptions = () => {
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const owner = participants.filter((p) => p.user_id === meeting.owner_user);
    console.log("🚀 ~ MeetingCard ~ participants:", participants)
    console.log("🚀 ~ MeetingCard ~ owner:", owner);
    const name = owner.length && (`${owner[0]?.name} ${owner[0]?.last_name}`);
    setOwnerName(name);
  }, [participants]);

  const showOptionSymbol = showOptions ? "▲" : "▼";
  const isZoom = meeting.place.toLowerCase().includes("zoom");

  const renderStatus = () => {
    return (
      <div style={{ marginTop: 8 }}>
        <select
          disabled={statusLoading}
          defaultValue=""
          onChange={(e) => handleChangeStatus(e.target.value)}
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="pending">Pending</option>
          <option value="arrived">Arrived</option>
          <option value="absent">Absent</option>
        </select>
      </div>
    );
  };

  const openDetials = () => {
    setDetailsModal(true);
  };

  return (
    <div className="meetingCardContainer">
      <div className="headerContainer">
        <h4 className="meetingTitle" onClick={openDetials}>
          {meeting.title}
        </h4>
        {isOwner && (
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

        {detailsModal && (
          <MeetingDetails
            meeting={{ ...meeting, owner_user: ownerName }}
            onClose={() => setDetailsModal(false)}
          />
        )}
      <div className="meetingDetails">
        {meeting.time} – {meeting.end_time} {meeting.place}
        {!isZoom && (
          <button
            onClick={() => openGoogleMaps(meeting.place)}
            style={{ marginLeft: 5 }}
          >
            show map
          </button>
        )}
        <button onClick={openOptions}> {showOptionSymbol} </button>
      </div>
            {showOptions && (
        <>
          <div className="editMeetingButtons">
            <button onClick={toggleParticipants}>
              {showParticipants ? "Hide participants" : "Show participants"}
            </button>

            {isParticipant && (
              <button onClick={() => setShowStatusSelect((prev) => !prev)}>
                Change Status
              </button>
            )}

            {isOwner && (
              <>
                <button onClick={handleLoadUsersNotInMeeting}>
                  Add participant
                </button>
                <button onClick={() => setShowEditMeeting((prev) => !prev)}>
                  {editMeetingText}
                </button>
              </>
            )}
          </div>
          {/* Edit Meeting Form */}
          {isOwner && showEditMeeting && (
            <EditMeetingForm
              editMeetingData={editMeetingData}
              handleEditMeetingChange={handleEditMeetingChange}
              handleUpdateMeeting={handleUpdateMeeting}
              updatingMeeting={updatingMeeting}
            />
          )}

          {isParticipant && showStatusSelect && renderStatus()}

          {isOwner && showAddUser && (
            <div style={{ marginTop: 8 }}>
              <select
                disabled={addingUser}
                defaultValue=""
                onChange={(e) => handleAddParticipant(e.target.value)}
              >
                <option value="" disabled>
                  Select user
                </option>
                {usersNotInMeeting.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name || "No Name"} {u.last_name || "No Last Name"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showParticipants && (
            <ul className="particpants-container" style={{ marginTop: 10 }}>
              {participants.map((p) => (
                <li key={p.participant_id} className="participantListItem">
                  <div>
                    {p.name} {p.last_name} –{" "}
                    <b className="statusParticipant">{p.status}</b>
                  </div>
                  {isOwner && p.user_id !== user.user_id && (
                    <button
                      className="delete-button"
                      onClick={() => handleRemoveParticipant(p.user_id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
