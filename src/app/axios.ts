import { refreshToken } from "@/utils/useApis";
import axios, { AxiosHeaders } from "axios";
import { getSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

const baseURL = "http://37.152.180.173:4030/api/";
const api = axios.create({ baseURL });

api.interceptors.request.use(
  async (config) => {
    try {
      const noAuth = config?.headers?.NoAuth;

      if (!noAuth) {
        const session = await getSession();
        const token = session?.user?.accessToken;
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }

      config.headers = new AxiosHeaders({
        ...config.headers,
        "Content-Type": "application/json",
      });

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorMessage =
      error.response?.data?.title ||
      error.title ||
      "An unexpected error occurred";

    toast.error(errorMessage);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await getSession();
        if (!session) {
          console.error("No active session found");
          signIn();
          const { data } = error.response;

          error.message = `${data.title || "Unknown error"}`;

          return Promise.reject(error);
        }
        // const refreshedToken = await refreshAccessToken(
        //   session.user.refreshToken
        // );

        // if (refreshedToken.accessToken) {
        //   originalRequest.headers[
        //     "Authorization"
        //   ] = `Bearer ${refreshedToken.accessToken}`;
        //   return api(originalRequest);
        // }
      } catch (refreshError) {
        console.error("Error refreshing access token", refreshError);
        signIn();
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const { data } = error.response;
      error.message = `${data.title || "Unknown error"}`;
    } else if (error.request) {
      error.message = "Something went wrong!";
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

async function refreshAccessToken(refreshToken1: string) {
  try {
    const refreshedTokens = await refreshToken(refreshToken1);

    if (refreshedTokens.data) {
      return {
        accessToken: refreshedTokens.data.token,
        refreshToken: refreshedTokens.data.refreshToken,
        accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
      };
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      accessToken: "",
      refreshToken: "",
      accessTokenExpires: 0,
    };
  }
}
