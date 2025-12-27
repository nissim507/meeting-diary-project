const API_URL = "http://localhost:3000";

// LOGIN
export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  return res.json();
}

// SIGNUP
export async function signupUser(user) {
  const res = await fetch(`${API_URL}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }
  return res.json();
}

// MEETINGS
export async function getMeetingsByDate(userId, date, token) {
  const res = await fetch(`${API_URL}/meetings/user/${userId}?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return await res.json();
}

export async function addMeeting(meeting, token) {
  const res = await fetch(`${API_URL}/meetings/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ meeting }),
  });
  if (!res.ok) throw new Error('Failed to add meeting');
  return await res.json();
}

export const deleteMeeting = async (meetingId, token) => {
  const res = await fetch(`${API_URL}/meetings/${meetingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete meeting');
  return await res.json();
}

// PARTICIPANTS
export async function getParticipantsByMeeting(meetingId, token) {
  const res = await fetch(`${API_URL}/participants/meeting/${meetingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch participants');
  return await res.json();
}

export async function addParticipant(meetingId, userId, token) {
  const res = await fetch(`${API_URL}/participants/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ meetingId, userId }),
  });
  if (!res.ok) throw new Error('Failed to add participant');
  return await res.json();
}

export async function removeParticipant(meetingId, userId, token) {
  const res = await fetch(`${API_URL}/participants`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ meetingId, userId }),
  });
  if (!res.ok) throw new Error('Failed to remove participant');
  return await res.json();
}

export async function changeMyStatus(meetingId, userId, status, token) {
  const res = await fetch(`${API_URL}/participants/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ meetingId, userId, status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return await res.json();
}

export async function getUsersNotInMeeting(meetingId, token) {
  const res = await fetch(`${API_URL}/participants/not-in-meeting/${meetingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users not in meeting');
  return await res.json();
}

export async function updateMeeting(meeting, token) {
  console.log("meeting", meeting);
  const res = await fetch(`${API_URL}/meetings/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meeting }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(err);
    throw new Error('Failed to update meeting');
  }

  return res.json();
}
