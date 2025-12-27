
import { useEffect, useState } from 'react';
import Login from './pages/Welcome';
import Signup from './pages/signup';
import CalendarTable from './components/calenderTable/CalendarTable';
import AddMeeting from './components/AddMeeting/AddMeeting';





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
    setView('login');
  };

const renderWelcomePage = ()=> {
    return view === 'login' ? (
      <Login onLogin={handleLogin} />
    ) : (
      <Signup onSignup={() => setView('login')} />
    );
}

const renderLogin = ()=> {
  return (
    <div>
      <h1>Welcome, {user.username}</h1>

      <button onClick={handleLogout}>Logout</button>

      <AddMeeting
        user={user}
        token={token}
        onMeetingAdded={() => window.location.reload()}
      />

      <CalendarTable user={user} token={token} />
    </div>
  );
}

  return (
    <>
    {(!token)? renderWelcomePage() : renderLogin()}
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


