import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import React from "react";

const Settings = async () => {
  async function handleSignOut() {
    "use server";
    // Add your sign-out logic here
    await signOut();
    revalidatePath("/");
  }

  const session = await auth();
  const user_session = JSON.stringify(session?.user, null, 2);
  return (
    <>
      <form action={handleSignOut}>
        <Button type="submit">Sign out</Button>
      </form>
      {user_session ? <pre>{user_session}</pre> : <h1>no user yet</h1>}
    </>
  );
};

export default Settings;
