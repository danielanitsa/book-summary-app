"use server";

import { signIn, signOut } from "@/auth";
import { formSchemaSignIn, formSchemaSignUp } from "./validators";
import { db } from "@/db/db";
import { getUserByEmail } from "./user";
import { z } from "zod";
import { pbkdf2Sync, randomBytes } from "crypto";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function naSignIn() {
  await signIn("google");
}
export async function naSignOut() {
  await signOut();
}

export async function signInWithCredentials(
  values: z.infer<typeof formSchemaSignIn>,
) {
  try {
    const validatedFields = formSchemaSignIn.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Sign In successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}

const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = "sha-512";

export async function registerUser(values: z.infer<typeof formSchemaSignUp>) {
  const imageUrls = [
    "https://www.dropbox.com/scl/fi/pvrmpp405tj6coe3ryhzp/dragon_dance.jpeg?rlkey=4xtx55fgi8qgp6zqns7m0zv26&st=3bdfuz3v&raw=1",
    "https://www.dropbox.com/scl/fi/26mpwdhw236pq3miy9n3k/celestial_dance.jpeg?rlkey=m8aqi7zlyjm5o3obuc19xl5hi&st=izvr1mre&raw=1",
    "https://www.dropbox.com/scl/fi/1w42bkuk1avar4xyy0wv4/lion_velocious_hair.jpeg?rlkey=kb214iq8l15as2l1jsngi9iz9&st=nsbbplad&raw=1",
  ];

  const validatedFields = formSchemaSignUp.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, password, username } = validatedFields.data;

    // Generate a salt
    const salt = randomBytes(SALT_LENGTH).toString("hex");

    // Hash the password with the salt
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      HASH_LENGTH,
      DIGEST,
    ).toString("hex");

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const randomImageIndex = Math.floor(Math.random() * imageUrls.length);

    const user = await db.user.create({
      data: {
        email,
        password: `${salt}:${hashedPassword}`, // Store salt and hash together
        name: username,
        image: `${imageUrls[randomImageIndex]}`,
      },
    });

    if (!user) {
      return {
        error: "An error occurred while creating your account.",
      };
    }

    // Return the created user or any other relevant data
    return {
      success: "Account created!",
    };
  } catch (error: any) {
    // Handle any errors that might occur during user creation
    return {
      error: error.message, // Optionally, you can include the error message for debugging
    };
  }
}
