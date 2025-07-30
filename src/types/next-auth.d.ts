import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     accessToken?: string;
//     tokenType?: string;
//     expiresIn?: number;
//     expiresTo?: string;
//     isAdmin?: boolean;
//   }

//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       accessToken?: string;
//       tokenType?: string;
//       expiresIn?: number;
//       expiresTo?: string;
//       isAdmin?: boolean;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string;
//     accessToken?: string;
//     tokenType?: string;
//     expiresIn?: number;
//     expiresTo?: string;
//     isAdmin?: boolean;
//   }
// }
