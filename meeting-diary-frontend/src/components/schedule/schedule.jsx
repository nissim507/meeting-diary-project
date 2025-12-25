import { useState } from 'react';
import CalendarTable from '../CalendarTable';

export default function Schedule() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1); // 1-12

  // sample meetings shape: { id, title, date: 'YYYY-MM-DD', time }
  const [meetings] = useState([
    { id: '1', title: 'Team sync', date: `${year}-${String(month).padStart(2,'0')}-03`, time: '10:00' },
    { id: '2', title: 'Client call', date: `${year}-${String(month).padStart(2,'0')}-15`, time: '14:00' },
  ]);

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const todays = meetings.filter(m => m.date === dateStr);
    if (todays.length) console.log('Meetings on', dateStr, todays);
    else console.log('No meetings on', dateStr);
  };

  return (
    <div>
      <h2>Schedule</h2>
      <CalendarTable year={year} month={month} meetings={meetings} onDayClick={handleDayClick} />
    </div>
  );
}