

export default function EditMeetingForm({editMeetingData, handleEditMeetingChange, handleUpdateMeeting, updatingMeeting}) {

return ((
        <div className="editInputContainer">
          <input
            name="title"
            placeholder="Title"
            value={editMeetingData.title}
            onChange={handleEditMeetingChange}
          />
          <input
            type="date"
            name="date"
            value={editMeetingData.date}
            onChange={handleEditMeetingChange}
          />
          <input
            type="time"
            name="time"
            value={editMeetingData.time}
            onChange={handleEditMeetingChange}
          />
          <input
            type="time"
            name="end_time"
            value={editMeetingData.end_time}
            onChange={handleEditMeetingChange}
          />
          <input
            name="place"
            placeholder="Place"
            value={editMeetingData.place}
            onChange={handleEditMeetingChange}
          />
          <div className="footerEditMeeting">
            <textarea
              className="notesMeeting"
              name="notes"
              placeholder="Notes"
              value={editMeetingData.notes}
              onChange={handleEditMeetingChange}
            />
            <button
              className="updateMeetingButton"
              onClick={handleUpdateMeeting}
              disabled={updatingMeeting}
            >
              {updatingMeeting ? "Updating..." : "Update Meeting"}
            </button>
          </div>
        </div>
      ))
    }