import { useState } from "react";
import { loginUser } from "../services/api";
import "./style.css";

export default function Welcome({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(username, password);
    if (data.token) {
      onLogin(data.token, data.user);
    } else {
      setError(data.message || "Login failed");
    }
  };

  const setSignUpStatus = () => {
    setIsSignUp((status)=> !status)
  }

  const renderExtraSignUpFields = () => {
    return (
    <>
          <input
                  placeholder="FirstName"
                  value={firstName}
                  onChange={(e) => setUsername(e.target.value)}
                />
                    <input
                  placeholder="LastName"
                  value={lastName}
                  onChange={(e) => setUsername(e.target.value)}
                />
                    <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                />
    </>
    )
  }

  const submitTextButton = isSignUp ? "signUp": "Login";
  const buttonText = isSignUp ? "Back": "SignUp";

  return (
    <div className="mainContainer">
      <h1>Meeting Diary</h1>
      <div className="userInteraction">
        <div className="background">
          <h2 className="header">Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="userFields">
              <div className="fields">
                <input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && renderExtraSignUpFields()}
              </div>
              <div className="buttons">
                <button
                  type="submit"
                  style={{ background: "green", color: "white" }}
                >
                  {submitTextButton}
                </button>
                <button type="button" onClick={setSignUpStatus}>{buttonText}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
