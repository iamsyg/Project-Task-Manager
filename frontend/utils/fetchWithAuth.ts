// frontend/utils/fetchWithAuth.ts

export const fetchWithAuth = async (url: string, options: any = {}) => {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // ❌ access token expired
  if (response.status === 401) {
    // try refresh
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!refreshRes.ok) {
      // ❌ refresh also failed → logout
      localStorage.removeItem("user");
      window.location.href = "/"; // or dispatch logout
      throw new Error("Session expired");
    }

    // ✅ retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session invalid after refresh");
    }
  }

  return response;
};