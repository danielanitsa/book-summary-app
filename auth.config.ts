import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";
import credentials from "next-auth/providers/credentials";
import { formSchemaSignIn } from "./app/lib/validators";
import { getUserByEmail } from "./app/lib/user";
import { pbkdf2Sync } from "crypto";

const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = "sha512";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    credentials({
      async authorize(credentials) {
        const validatedFields = formSchemaSignIn.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const [salt, hashedPassword] = user.password.split(":");
          const inputPassword = pbkdf2Sync(
            password,
            salt,
            ITERATIONS,
            HASH_LENGTH,
            DIGEST,
          ).toString("hex");

          if (inputPassword === hashedPassword) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
