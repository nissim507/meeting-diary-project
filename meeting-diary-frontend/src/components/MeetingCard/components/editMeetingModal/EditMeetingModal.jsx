import React, { useState, useEffect, useRef } from "react";
import {
  updateMeeting,
  getUsersNotInMeeting,
  getParticipantsByMeeting,
  addParticipant,
  removeParticipant,
  changeMyStatus,
} from "../../../../services/api";
import "./EditMeetingModal.css";

export default function EditMeetingModal({
  meeting,
  token,
  onClose,
  onUpdated,
  isParticipant,
  isOwner,
  user,
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [usersNotInMeeting, setUsersNotInMeeting] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const addButtonRef = useRef(null);
  const [anchorPos, setAnchorPos] = useState(null);
  const modalRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!meeting || !meeting.meeting_id) return;
    const loadParticipants = async () => {
      try {
        const data = await getParticipantsByMeeting(meeting.meeting_id, token);
        setParticipants(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadParticipants();
  }, [meeting, token]);

  // (save button handled as fixed bottom-right so it's always reachable)

  if (!meeting) return null;

  const { owner_user, title, notes } = meeting;

  const stop = (e) => e.stopPropagation();

  const handleLoadUsersNotInMeeting = async () => {
    try {
      const data = await getUsersNotInMeeting(meeting.meeting_id, token);
      setUsersNotInMeeting(data || []);
      // compute button position so popover can be fixed in viewport
      if (addButtonRef?.current) {
        const rect = addButtonRef.current.getBoundingClientRect();
        setAnchorPos({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
          rectTop: rect.top,
          rectRight: rect.right,
          rectHeight: rect.height,
        });
      }
      setShowAddPopover(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleAddSelectedUsers = async () => {
    if (selectedUsers.size === 0) return;
    try {
      for (const uid of Array.from(selectedUsers)) {
        await addParticipant(meeting.meeting_id, uid, token);
      }
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data || []);
      setSelectedUsers(new Set());
      setShowAddPopover(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add selected users");
    }
  };

  const handleRemoveParticipant = async (userId) => {
    if (!window.confirm("Remove this participant?")) return;
    try {
      await removeParticipant(meeting.meeting_id, userId, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to remove participant");
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      await changeMyStatus(meeting.meeting_id, user.user_id, newStatus, token);
      const data = await getParticipantsByMeeting(meeting.meeting_id, token);
      setParticipants(data || []);
      setShowStatusSelect(false);
    } catch (err) {
      console.error(err);
      alert("Failed to change status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      ...meeting,
      title: form.get("title") || meeting.title,
      date: form.get("date") || meeting.date,
      time: form.get("time") || meeting.time,
      end_time: form.get("time") || meeting.end_time,
      place: form.get("location") || meeting.place,
      notes: form.get("notes") || meeting.notes,
    };

    try {
      const updated = await updateMeeting(
        meeting.meeting_id || meeting.id,
        payload,
        token
      );
      if (onUpdated) onUpdated(updated);
      if (onClose) onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  return (
    <div className="editMeetingModal" onClick={onClose}>
      <div
        className="editMeetingModalsMainContainer"
        onClick={stop}
        ref={modalRef}>
        <h4 className="editMeetingModalsTitle">{title}</h4>
        <div className="seprator" />

        <p>
          <b>organizer:</b> {owner_user}
        </p>

        <p className="Notes">
          <b>Notes: </b>
          <span>{notes}</span>
        </p>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}>
          {isOwner && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowEditForm((s) => !s)}>
              {showEditForm ? "Hide details" : "Edit details"}
            </button>
          )}

          {isParticipant && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ marginRight: 8 }}>My status:</span>
              <div className="statusPills">
                {["pending", "arrived", "absent"].map((s) => {
                  const myStatus = (
                    participants.find((p) => p.user_id === user?.user_id) || {}
                  ).status;
                  const active = myStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`pill ${active ? "active" : ""}`}
                      onClick={() => handleChangeStatus(s)}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {showStatusSelect && isParticipant && user && (
          <div className="statusSelect">
            <label>Change my status:</label>
            <select
              defaultValue={
                (participants.find((p) => p.user_id === user.user_id) || {})
                  .status || ""
              }
              onChange={(e) => handleChangeStatus(e.target.value)}>
              <option value="" disabled>
                Select status
              </option>
              <option value="pending">Pending</option>
              <option value="arrived">Arrived</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        )}

        {/* popover placeholder removed here; it will be rendered next to Add button */}

        <div className="participantsPanel">
          <ul className="particpants-container">
            {participants.map((p) => (
              <li
                key={p.participant_id || p.user_id}
                className="participantListItem">
                <div className="leftCell">
                  <span className="pName">
                    {p.name} {p.last_name}
                  </span>
                </div>
                <div>
                  <b className="statusParticipant">{p.status}</b>
                </div>
                {isOwner && p.user_id !== meeting.owner_user && (
                  <button
                    className="delete-button"
                    onClick={() => handleRemoveParticipant(p.user_id)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isOwner && (
            <div className="addButtonWrapper">
              <button
                ref={addButtonRef}
                className="btn btn-primary"
                onClick={handleLoadUsersNotInMeeting}>
                Add participants
              </button>
            </div>
          )}
        </div>

        {/* popover rendered fixed in viewport so it doesn't scroll away */}
        {showAddPopover && anchorPos && (
          <>
            {/* compute clamped popover position so it doesn't go offscreen */}
            <div
              className="add-user-popover"
              role="dialog"
              style={(function () {
                const popoverWidth = 320;
                const popoverMaxHeight = 320;
                const margin = 8;
                const winW =
                  typeof window !== "undefined" ? window.innerWidth : 1024;
                const winH =
                  typeof window !== "undefined" ? window.innerHeight : 768;
                let left = anchorPos.left || margin;
                // clamp horizontally
                left = Math.min(
                  Math.max(margin, left),
                  Math.max(margin, winW - popoverWidth - margin)
                );

                // default to below the button
                let top = (anchorPos.top || 0) + 8;
                // if it would overflow bottom, try to place above the button
                if (
                  top + popoverMaxHeight > winH - margin &&
                  anchorPos.rectTop
                ) {
                  top = anchorPos.rectTop - popoverMaxHeight - margin;
                  if (top < margin) top = margin; // still clamp to top
                }

                return {
                  position: "fixed",
                  left,
                  top,
                  width: popoverWidth,
                  zIndex: 140,
                };
              })()}
              onClick={(e) => e.stopPropagation()}>
              <div className="addUserList">
                {usersNotInMeeting && usersNotInMeeting.length > 0 ? (
                  usersNotInMeeting.map((u) => (
                    <label key={u.user_id || u.id} className="userRow">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(u.user_id)}
                        onChange={() => handleToggleUserSelection(u.user_id)}
                      />
                      <span className="userLabel">
                        {u.name || u.username || u.email}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="empty">No users available</div>
                )}
              </div>
              <div className="addUserActions">
                <button
                  className="btn btn-primary"
                  onClick={handleAddSelectedUsers}>
                  Add
                </button>
                <button
                  className="btn"
                  onClick={() => setShowAddPopover(false)}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* edit form (toggle) */}
        {showEditForm && (
          <form ref={formRef} onSubmit={handleSubmit} className="editForm">
            <label>Title</label>
            <input name="title" defaultValue={meeting.title || ""} />

            <label>Location</label>
            <input name="place" defaultValue={meeting.place || ""} />

            <label>Date</label>
            <input type="date" name="date" defaultValue={meeting.date || ""} />

            <label>Time</label>
            <input type="time" name="time" defaultValue={meeting.time || ""} />

            <label>Time</label>
            <input type="time" name="end_time" defaultValue={meeting.end_time || ""} />

            <label>Notes</label>
            <textarea className="notesMeetingTextarea"
              name="notes"
              defaultValue={meeting.notes || ""} />

            <div className="editingModalButtonsContainer">
              <button
                type="button"
                className="btn"
                onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary save-btn"
                onClick={() => {
                  if (
                    formRef.current &&
                    typeof formRef.current.requestSubmit === "function"
                  ) {
                    formRef.current.requestSubmit();
                  } else if (formRef.current) {
                    formRef.current.dispatchEvent(
                      new Event("submit", { bubbles: true, cancelable: true })
                    );
                  }
                }}>
                Save
              </button>
            </div>
          </form>
        )}

        

        {/* close button top-right */}
        <button
          className="modalClose"
          onClick={() => {
            setShowAddPopover(false);
            if (onClose) onClose();
          }}
          aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
