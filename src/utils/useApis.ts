import api from "@/app/axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const login = async (data: {
  id: number;
  userName: string;
  password: string;
  rememberMe: boolean;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  console.log("Login request data:", data); // Log the request payload
  try {
    const response = await api.post<{
      data: { accessToken: string; refreshToken: string };
    }>("User/Login", data);
    console.log("Login response:", response.data); // Log the response
    return response.data.data;
  } catch (error) {
    if (isError(error)) {
      console.error("Login error:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post(
    `User/RefreshToken`
    // { RefreshToken: refreshToken }
  );
  return response.data;
};
