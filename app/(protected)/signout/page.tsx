import { naSignOut } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import React from "react";

const Page = () => {
  const signOut = async () => {
    "use server";
    await naSignOut();
  };

  return (
    <form action={signOut}>
      <Button>signout</Button>
    </form>
  );
};

export default Page;
