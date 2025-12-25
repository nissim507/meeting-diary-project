/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

*/

import { useEffect, useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import CalendarTable from './components/calenderTable/CalendarTable';




function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if(savedToken && savedUser)
    {
      try{
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch(err) {
        console.error('Invalid user in localStorage');
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setToken(null);
    setView('login');
  };

const renderLogout = ()=> {
    return view === 'login' ? (
      <Login onLogin={handleLogin} />
    ) : (
      <Signup onSignup={() => setView('login')} />
    );
}

const renderLogin = ()=> {
  console.log(user);
  return <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>

      <CalendarTable user={user} token={token} />
    </div>;
}

  return (
    <>
    {(!token)? renderLogout() : renderLogin()}
    </>
  )
};

export async function getParticipantsByMeeting(meetingId, token) {
  const res = await fetch(
    `http://localhost:3000/participants/meeting/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch participants');
  }

  return await res.json();
}


export default App;


/*
עכשיו אני רוצה לעשות קומפוננטה אשר תוסיף פגישה,
מי שעושה הוסף פגישה הוא יהיה הOWNER יהיה לו סוג של LABEL כזה שהוא יוכל לראות את כל היוזרים לפי השם ושם משפחה שלהם ויהיה גם LABEL של בחירת תאריך ועוד אחד של בחירת שעה... ובסוף כשהוא ילחץ על הוסף זה יוסיף אצל כולם את הפגישה

*/