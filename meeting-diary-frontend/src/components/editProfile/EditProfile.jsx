import "./EditProfile.css";
import { updateUserProfile } from "../../services/api";

function EditProfile({ user, token, closeEditProfile }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get("firstName") || user.name,
      last_name: form.get("lastName") || user.last_name,
      password: form.get("password") || user.password,
    };
    const updatedUser = {
      ...user,
      ...payload,
    };
    try {
      const user = await updateUserProfile(updatedUser, token);
      localStorage.setItem("user", JSON.stringify(user));
      closeEditProfile();
      alert("succesfull");
    } catch (err) {
      // TODO: show error to user
      console.error(err);
      alert(err)
    }
  };

  return (
    <form className="editProfileContainer" onSubmit={handleSubmit}>
      <div className="editProfileCloseContainer">
      <h3>Edit Profile</h3>
      <button className="closeEditProfile" onClick={closeEditProfile}>
        X
      </button>
      </div>
      <div className="inputEditProfileContainer">
        <label htmlFor="username">Username</label>
        <input name="username" placeholder={user.username} readOnly />
        <label htmlFor="firstName">First Name</label>
        <input name="firstName" placeholder={user.name} />
        <label htmlFor="lastName">Last Name</label>
        <input name="lastName" placeholder={user.last_name} />
        <label htmlFor="password">Password</label>
        <input name="password" placeholder="password" type="password" />
        <label htmlFor="email">Email</label>
        <input name="email" type="email" readOnly value={user.email} />
      </div>
      <button className="saveButtonProfile" type="submit">
        Save
      </button>
    </form>
  );
}

export default EditProfile;
