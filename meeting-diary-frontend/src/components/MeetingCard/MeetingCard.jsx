import { useEffect, useState } from "react";
import { getParticipantsByMeeting, deleteMeeting } from "../../services/api";
import EditMeetingModal from "../MeetingCard/components/editMeetingModal/EditMeetingModal";
import MeetingDetails from "../MeetingCard/components/meetingDetails/MeetingDetails";
import { MdDelete, MdEdit } from "react-icons/md";
import "./MeetingCard.css";

export default function MeetingCard({
  meeting,
  token,
  user,
  onMeetingDeleted,
  onMeetingUpdated,
}) {
  const [participants, setParticipants] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Edit meeting (handled in EditMeetingModal)
  const [detailsModal, setDetailsModal] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = user && meeting.owner_user === user.user_id;
  const isParticipant =
    user && participants.some((p) => p.user_id === user.user_id);
  // editMeetingText moved into modal component

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

  const openGoogleMaps = (address) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
      "_blank"
    );
  };

  // options handled via menu toggle

  useEffect(() => {
    const owner = participants.filter((p) => p.user_id === meeting.owner_user);
    const name = owner.length && `${owner[0]?.name} ${owner[0]?.last_name}`;
    setOwnerName(name);
  }, [participants, meeting.owner_user]);

  const isZoom = meeting.place.toLowerCase().includes("zoom");

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevents default browser context menu
    console.log("Right clicked!");
    setShowMenu(() => true);
  };

  const closeMenu = () => {
    setShowMenu(() => false);
  };

  const openDetails = () => {
    setDetailsModal(true);
  };

  const toggleEditModal = (status) => {
    setIsEditing(status);
    setShowMenu(false);
  };

  const handleCloseEdit = () => setIsEditing(false);

  const handleUpdated = (updatedMeeting) => {
    // notify parent (CalendarTable) so list is refreshed
    if (typeof onMeetingUpdated === "function")
      onMeetingUpdated(updatedMeeting);
    setIsEditing(false);
  };

  const MeetingMenu = (
    <div className="menuMeeting" onClick={(e) => e.stopPropagation()}>
      <button
        className="delete-button-menu"
        onClick={handleDelete}
        disabled={loadingDelete}>
        <MdDelete size={16} />
        <span> {loadingDelete ? "Deleting..." : "Delete"}</span>
      </button>
      <button className="" onClick={() => toggleEditModal(true)}>
        <MdEdit size={16} />
        <span>Edit</span>
      </button>
    </div>
  );
  return (
    <div
      className="meetingCardContainer"
      onContextMenu={handleRightClick}
      onClick={closeMenu}>
      <div className="headerContainer">
        <h1 className="meetingTitle" onClick={openDetails}>
          {meeting.title}
        </h1>
        <div className="meetingDetails">
          {meeting.time} – {meeting.end_time}{" "}
          {!isZoom ? (
            <a
              className="map-link"
              onClick={() => openGoogleMaps(meeting.place)}>
              {meeting.place}
            </a>
          ) : (
            <span>{meeting.place}</span>
          )}
        </div>
        <button
          className="showEditingModalButton"
          onClick={() => setIsEditing(true)}>
          +
        </button>
      </div>
      {showMenu && isOwner && MeetingMenu}
      {detailsModal && (
        <MeetingDetails
          meeting={{ ...meeting, owner_user: ownerName }}
          onClose={() => setDetailsModal(false)}
        />
      )}

      {isEditing && (
        <EditMeetingModal
          meeting={{ ...meeting, owner_user: ownerName }}
          token={token}
          onClose={handleCloseEdit}
          onUpdated={handleUpdated}
          isParticipant={isParticipant}
          isOwner={isOwner}
          user={user}
        />
      )}
    </div>
  );
}