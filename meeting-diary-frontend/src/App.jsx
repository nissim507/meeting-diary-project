import { useEffect, useState } from "react";
import Welcome from "./pages/Welcome";
import CalendarTable from "./components/calenderTable/CalendarTable";
import AddMeeting from "./components/addMeeting/AddMeeting";
import Menu from "./components/menu/Menu";
import EditProfile from "./components/editProfile/EditProfile";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showToggleAddMeetingStatus, setToggleAddMeetingStatus] =
    useState(false);
  const [showToggleEditProfile, setToggleEditProfile] = useState(false);

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
  };

  function toggleAddMeeting() {
    const modal = document.querySelector(".create-meeting");

    if (showToggleAddMeetingStatus) {
      // Closing - trigger animation first
      modal.classList.add("closing");

      setTimeout(() => {
        setToggleAddMeetingStatus((current) => !current);
        modal.classList.remove("closing");
      }, 300); 
    } else {
      // Opening - toggle immediately
      setToggleAddMeetingStatus((current) => !current);
    }
  }

  function toggleEditProfile() {
    const modal = document.querySelector(".create-meeting");

    if (showToggleEditProfile) {
      // Closing - trigger animation first
      modal.classList.add("closing");

      setTimeout(() => {
        setToggleEditProfile((current) => !current);
        modal.classList.remove("closing");
      }, 300); // Match animation duration
    } else {
      // Opening - toggle immediately
      setToggleEditProfile((current) => !current);
    }
  }

  const renderWelcomePage = () => {
    
    return <Welcome onLogin={handleLogin} />;
    
  };

  const renderLogin = () => {
    return (
      <div className="mainApp">
        <div className="header">
          <h1 className="mainHeadline">My Meeting Calendar</h1>
        </div>
        <div className="sideMenu">
          <Menu
            firstName={user?.name}
            lastName={user?.last_name}
            email={user?.email}
            toggleAddMeeting={toggleAddMeeting}
            toggleEditProfile={toggleEditProfile}
            handleLogout={handleLogout}
          />
        </div>
        <div className="meetingContainer">
          <CalendarTable user={user} token={token} />
        </div>
        {showToggleEditProfile && (
          <div
            className={`create-meeting ${
              showToggleEditProfile ? "" : "closing"
            }`}>
            <EditProfile
              user={user}
              token={token}
              onMeetingAdded={() => window.location.reload()}
              closeEditProfile={() => setToggleEditProfile(false)}
            />
          </div>
        )}
         {showToggleAddMeetingStatus && (
          <div
            className={`create-meeting ${
              showToggleAddMeetingStatus ? "" : "closing"
            }`}>
            <AddMeeting
              user={user}
              token={token}
              onMeetingAdded={() => window.location.reload()}
              setToggleAddMeetingStatus={()=>setToggleAddMeetingStatus(false)}
            />
          </div>
        )}
      </div>
    );
  };

  return <>{!token ? renderWelcomePage() : renderLogin()}</>;
}

export default App;
