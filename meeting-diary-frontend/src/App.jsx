import { useEffect, useState } from "react";
import Login from "./pages/Welcome";
import Signup from "./pages/signup";
import CalendarTable from "./components/calenderTable/CalendarTable";
import AddMeeting from "./components/addMeeting/AddMeeting";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // 'login' | 'signup'
  const [showToggleAddMeetingStatus, setToggleAddMeetingStatus] =
    useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Invalid user in localStorage");
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setView("login");
  };

  const toggleAddMeeting = () => {
    setToggleAddMeetingStatus((current) => !current);
  };

  const addMeetingButton = showToggleAddMeetingStatus ? "Hide" : "Add Meeting";

  const renderWelcomePage = () => {
    return view === "login" ? (
      <Login onLogin={handleLogin} />
    ) : (
      // <Signup onSignup={() => setView("login")} />
      <></>
    );
  };

  const renderLogin = () => {
    return (
      <div className="mainApp">
        <div className="header">
          <h1 className="mainHeadline">Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="meetingContainer">
          <CalendarTable user={user} token={token} />
          <div className="create-meeting">

          <button className="addMeetingButton" onClick={toggleAddMeeting}>{addMeetingButton}</button>
          {showToggleAddMeetingStatus && (
            <AddMeeting
            user={user}
            token={token}
            onMeetingAdded={() => window.location.reload()}
            />
          )}
          </div>
        </div>
      </div>
    );
  };

  return <>{!token ? renderWelcomePage() : renderLogin()}</>;
}

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
    throw new Error("Failed to fetch participants");
  }

  return await res.json();
}

export default App;
