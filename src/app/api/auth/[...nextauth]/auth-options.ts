import { login, refreshToken } from "@/utils/useApis";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type CustomJWT = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: any;
  rememberMe: any;
};

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const isAuthResponse = (response: any): response is AuthResponse => {
  return (
    response &&
    typeof response === "object" &&
    "data" in response &&
    "accessToken" in response.data &&
    "refreshToken" in response.data
  );
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Default to 1 day
  },
  callbacks: {
    async jwt({ token, user, account }) {
      let customToken = token as CustomJWT;

      // Initial sign in
      if (account && user) {
        customToken = {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
          rememberMe: (user as any).rememberMe,
        };
        return customToken;
      }

      // Return previous token if the access token has not expired
      if (Date.now() < customToken.accessTokenExpires) {
        return customToken;
      }

      // Refresh token if expired
      // return await refreshAccessToken(customToken);
    },
    async session({ session, token }) {
      const customToken = token as CustomJWT;

      session.user = {
        id: token.sub || "",
        accessToken: customToken.accessToken,
        refreshToken: customToken.refreshToken,
      };

      // Adjust session expiration based on rememberMe
      if (customToken.rememberMe) {
        session.expires = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(); // 30 days
      }

      return session;
    },
    async signIn({ user }) {
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs (e.g., /dashboard)
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow URLs within the app
      if (url.includes(baseUrl)) {
        return url;
      }
      // Default to /dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "Login",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) {
          console.error("Username and password are required.");
          throw new Error("Username and password are required.");
        }

        try {
          const res = await login(credentials.userName, credentials.password);
          if (isAuthResponse(res)) {
            return {
              id: "0",
              username: credentials.userName,
              accesstoken: res.data.accesstoken,
              refreshToken: res.data.refreshToken,
              rememberMe: credentials.rememberMe === "on",
            };
          }
          console.error("Invalid login response:", res);
          throw new Error("Invalid login response.");
        } catch (error) {
          if (isError(error)) {
            console.error("Error during authentication:", error.message);
            throw new Error(error.message);
          } else {
            console.error("Unknown error during authentication");
            throw new Error("Unknown error during authentication");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
//   try {
//     const refreshedTokens = await refreshToken(token.refreshtoken);

//     if (!isAuthResponse(refreshedTokens)) {
//       throw new Error("Invalid refresh token response");
//     }

//     const newUserInfo = await getProfile(refreshedTokens.data.token);

//     return {
//       accessToken: refreshedTokens.data.token,
//       refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken,
//       accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
//       userInfo: newUserInfo,
//     };
//   } catch (error) {
//     console.error("Error refreshing access token", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }
