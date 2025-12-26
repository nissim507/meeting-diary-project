import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { getMeetingsByDate } from '../../services/api';
import MeetingCard from '../MeetingCard/meetingCard';

export default function CalendarTable({ user, token }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      try {
        const date = selectedDate.format('YYYY-MM-DD');
        const data = await getMeetingsByDate(user.user_id || user.id, date, token);
        setMeetings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeetings();
  }, [selectedDate, user, token]);

  const handleMeetingDeleted = (deletedId) => {
    setMeetings(prev => prev.filter(m => m.meeting_id !== deletedId));
  };

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
              <MeetingCard
                meeting={m}
                token={token}
                user={user}
                onMeetingDeleted={handleMeetingDeleted}
              />
            </li>
          ))
        )}
      </ul>
    </LocalizationProvider>
  );
}
