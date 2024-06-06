import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Your password must be at least 8 characters long." })
  .regex(/[0-9]/, "Your password must contain at least 1 number.")
  .regex(
    /[^a-zA-Z0-9]/,
    "Your password must contain at least 1 special character.",
  )
  .trim();

export const formSchemaSignIn = z.object({
  email: z.string().email({
    message: "Please input a valid email.",
  }),
  password: passwordSchema,
});

export const formSchemaSignUp = z.object({
  email: z
    .string()
    .email({
      message: "Please input a valid email.",
    })
    .refine(
      (email) => {
        return (
          email.endsWith("@gmail.com") ||
          email.endsWith("@outlook.com") ||
          email.endsWith("@yahoo.com")
        );
      },
      {
        message:
          "Email must use famous providers such as Outlook, Gmail or Yahoo",
      },
    ),
  password: passwordSchema,
  username: z
    .string()
    .min(3, {
      message: "Please enter a username with at least 3 characters",
    })
    .max(16)
    .trim(),
});
