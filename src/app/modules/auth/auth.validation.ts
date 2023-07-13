import { z } from "zod";

// User login zod validation
const loginZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "ID is required",
    }),
    password: z.string({
      required_error: "Password is required!",
    }),
  }),
});

//  Refresh token zod validation
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    // we receive the cookie from cookies not from body
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
