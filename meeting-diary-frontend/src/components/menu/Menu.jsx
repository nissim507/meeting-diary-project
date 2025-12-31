import "./Menu.css";

export default function Menu({
  handleLogout,
  toggleAddMeeting,
  toggleEditProfile,
  firstName,
  lastName,
  email,
}) {
  const initials = `${firstName?.charAt(0) || ""}${
    lastName?.charAt(0) || ""
  }`.toUpperCase();

  return (
    <div className="menu-container">
      <div className="user-info">
        <div className="userLogo">{initials}</div>
        <div className="userName">
          <div className="firstName">{firstName}</div>
          <div className="lastName">{lastName}</div>
        </div>
        <div className="email">{email}</div>
      </div>
      <div className="buttonsContainer">
        <div className="mainButtonsContainer">
          <button className="addMeetingButton" onClick={toggleAddMeeting}>
            Add Meeting
          </button>
          <button className="addMeetingButton" onClick={toggleEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>
      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
