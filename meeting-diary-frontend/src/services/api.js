const API_URL = "http://localhost:3000";

/*
 send login request to the server
*/
export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
}

/*
  send signup request to the server 
*/
export async function signupUser(user) {
  const res = await fetch(`${API_URL}/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }

  return res.json();
}


export async function getMeetingsByDate(userId, date, token) {
  const res = await fetch(`http://localhost:3000/meetings/user/${userId}?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch meetings');
  }
  return await res.json();
}

export async function getParticipantsByMeeting(meetingId, token) {
  const res = await fetch(`${API_URL}/participants/meeting/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch participants');
  }
  return await res.json();
}

export async function addMeeting(meeting, token) {
  const res = await fetch('http://localhost:3000/meetings/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      meeting: meeting,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to add meeting');
  }

  return await res.json();
}

export async function getAllUsers(token) {
  const res = await fetch('http://localhost:3000/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return await res.json();
}