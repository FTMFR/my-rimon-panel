// import type { NextApiRequest, NextApiResponse } from "next";
// import { serialize } from "cookie";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { username, password } = req.body;

//   // اعتبارسنجی (مثلا با DB)
//   if (username === "test" && password === "Test@123") {
//     const token = res.data.accessToken;

//     // ست کردن کوکی HttpOnly
//     res.setHeader(
//       "Set-Cookie",
//       serialize("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         path: "/",
//         maxAge: 60 * 60 * 24, // 1 روز
//       })
//     );

//     return res.status(200).json({ message: "Login success" });
//   }

//   return res.status(401).json({ message: "Invalid credentials" });
// }
