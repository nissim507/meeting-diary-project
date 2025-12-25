import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { getMeetingsByDate } from '../../services/api';
// import MeetingCard from '../MeetingCard/meetingCard';

export default function CalendarTable({ user, token }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if(!user)
        return;
      try {
        const date = selectedDate.format('YYYY-MM-DD');
        console.log(' Selected date:', date);
        console.log(' User ID:', user.id);
        const data = await getMeetingsByDate(user.id, date, token);
        console.log(' Meetings from server:', data); // ⭐ חשוב
        setMeetings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeetings();
  }, [selectedDate, user, token]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        date={selectedDate}
        onChange={(newDate) => setSelectedDate(newDate)}
      />
      <h3>Meetings on {selectedDate.format('YYYY-MM-DD')}</h3>
      <ul>
        {meetings.length === 0 ? (
  <p>No meetings</p>
) : (
  meetings.map((m) => (
    <li key={m.meeting_id}>
    <strong>{m.title}</strong> <br />
    {m.time} - {m.end_time} <br />
    {m.place}
    </li>
  ))
)}
      </ul>
    </LocalizationProvider>
  );
}
