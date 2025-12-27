import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import "./welcome.css";

export default function Welcome({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await loginUser(userInfo.username, userInfo.password);
    if (data.token) {
      onLogin(data.token, data.user);
    } else {
      setError(data.message || "Login failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!userInfo.username || !userInfo.password) {
      setError("Missing details");
    }

    try {
      const status = await signupUser(userInfo);
    if (status === true) {
      setIsSignUp(false);
      setIsSuccess(true);
     }
    } 
    catch (err) {
      setErrorMessage(err.message);
    }
  }

  const setSignUpStatus = () => {
    setIsSignUp((status) => !status);
  };

  const renderExtraSignUpFields = () => {
    return (
      <>
        <input
          name="first-name"
          placeholder="FirstName"
          required
          onChange={(e) => setUserInfo((userInfo) => ({...userInfo, name: e.target.value}))}
        />
        <input
          name="last-name"
          placeholder="LastName"
          required
          onChange={(e) => setUserInfo((userInfo) => ({...userInfo, last_name: e.target.value}))}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setUserInfo((userInfo) => ({...userInfo, email: e.target.value}))}
        />
      </>
    );
  };

  const submitTextButton = isSignUp ? "signUp" : "Login";
  const buttonText = isSignUp ? "Back" : "SignUp";

  return (
    <div className="mainWelcomeContainer">
      <h1>Meeting Diary</h1>
      <div className="userInteraction">
        <div className="background">
          <h2 className="header">Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <div className="userFields">
              <div className="fields">
                <input
                  name="username"
                  required
                  placeholder="Username"
                  onChange={(e) => setUserInfo((userInfo) => ({...userInfo, username: e.target.value}))}
                />
                <input
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setUserInfo((userInfo) => ({...userInfo, password: e.target.value}))}
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
                <button type="button" onClick={setSignUpStatus}>
                  {buttonText}
                </button>
              </div>
              {isSuccess && <div className="successfull-text">Succesfull signup</div>}
              {errorMessage && <div className="fail-error-text">{errorMessage}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
