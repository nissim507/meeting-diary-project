import "./meetingDetails.css";



export default function MeetingDetails({ meeting, onClose }) {
  const { owner_user, title, date, time, end_time, place, notes } = meeting;
  const isZoom = meeting.place.toLowerCase().includes("zoom");
  
  return (
    <div className="meetingDetailsModal" onClick={onClose}>
      <div  className="meetingDetailsMainContainer" onClick={(e) => e.stopPropagation()}>
        <h4 className="meetingDetailsTitle">{title}</h4>
        <div className="seprator"></div>
        <p>
          <b>orginaizer:</b> {owner_user}
        </p>
        <p className="date ">
          <b>Date: </b> {date}{" "}
          <span>
            {time} - {end_time}
          </span>
        </p>
        <p className="location" >
          <b>Loacation: </b>{isZoom?<span>{place}</span>: <a onClick={() => openGoogleMaps(meeting.place)} class="placeARef">{place}</a>}
        </p>
        <p className="Notes ">
          <b>Notes: </b> <span>{notes}</span>
        </p>
      </div>
    </div>
  );
}

const openGoogleMaps = (address) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
      "_blank"
    );
  };
