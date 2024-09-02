export const loginToDummy = async (username: string, password: string) => {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
      expiresInMins: 30, // optional, defaults to 60
    }),
  });
  return res;
};

export const fetchCurrentUser = async (token: string) => {
  try {
    const res = await fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const refreshSession = async (refreshToken: string) => {
  const res = fetch("https://dummyjson.com/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
      expiresInMins: 30, // optional, defaults to 60
    }),
  });

  return res;
};
