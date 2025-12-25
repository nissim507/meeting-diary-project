const API_URL = "http://localhost:3000";

/*
  שולח בקשת התחברות לשרת
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
  שולח בקשת הרשמה לשרת
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
