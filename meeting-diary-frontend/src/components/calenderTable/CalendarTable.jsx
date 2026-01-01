import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { getMeetingsByDate } from "../../services/api";
import MeetingCard from "../MeetingCard/MeetingCard";
import "./CalendarTable.css"

export default function CalendarTable({ user, token }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);
  const [colors, setColors] = useState({});

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      try {
        const date = selectedDate.format("YYYY-MM-DD");
        const data = await getMeetingsByDate(
          user.user_id || user.user_id,
          date,
          token
        );
        const meetings = data
          .map((m) => ({ ...m, date: m.date.split("T")[0] }))
          .sort((a, b) => {
            const toSeconds = (t) => {
              const [h, m, s] = t.split(":").map(Number);
              return h * 3600 + m * 60 + s;
            };

            return toSeconds(a.time) - toSeconds(b.time);
          });
        setMeetings(meetings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeetings();
  }, [selectedDate, user, token]);

  useEffect(() => {
    const generateColors = () => {
      const newColors = {};
      meetings.forEach((m) => {
        if (!colors[m.meeting_id]) {
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
            16
          )}`;
          newColors[m.meeting_id] = randomColor;
        }
      });
      setColors(newColors);
    };
    generateColors();
  }, [meetings]);

  const handleMeetingUpdated = (updated) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.meeting_id === (updated.meeting_id || updated.id) ? updated : m
      )
    );
  };

  const handleMeetingDeleted = (deletedId) => {
    setMeetings((prev) => prev.filter((m) => m.meeting_id !== deletedId));
  };

  return (
    <div className="calendarContainer">

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          date={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
        <h2>Meetings on {selectedDate.format("YYYY-MM-DD")}</h2>
        <div>
          {meetings.length === 0 ? (
            <p>No meetings</p>
          ) : (
            <div className="meetingsContainer">
              {meetings.map((m) => (
                <div key={m.meeting_id}>
                  <div className="meetingCardRow">
                    <div
                      className="meetingColorIndicator"
                      style={{ backgroundColor: colors[m.meeting_id] }}
                    />
                    <MeetingCard
                      meeting={m}
                      token={token}
                      user={user}
                      onMeetingDeleted={handleMeetingDeleted}
                      onMeetingUpdated={handleMeetingUpdated}
                    />
                  </div>
                  <div className="divider" />
                </div>
              ))}
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
}
