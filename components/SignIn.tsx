"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { naSignIn, signInWithCredentials } from "@/app/lib/actions";
import google from "@/public/google.svg";
import { Input } from "./ui/input";
import Image from "next/image";
import { formSchemaSignIn } from "@/app/lib/validators";
import { useState } from "react";
import dynamic from "next/dynamic";

const FormError = dynamic(() => import("./form-error"));
const FormSuccess = dynamic(() => import("./form-success"));

const SignIn: React.FC = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm({
    resolver: zodResolver(formSchemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof formSchemaSignIn>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(() => {
      setError("");
      setSuccess("");
      signInWithCredentials(values)
        .then((data) => {
          if (data.error) {
            // Handle error
            setError(data.error);
          } else {
            // Handle success
            setSuccess(data.success);
            setError(""); // Clear any previous errors
          }
        })
        .catch((error) => {
          // Handle promise rejection (if any)
          console.error("An error occurred:", error);
          setError("An error occurred while signing in."); // Display a generic error message
        });
    });
  }

  return (
    <Card className="w-full max-w-sm p-8 md:max-w-md lg:max-w-lg ">
      <CardHeader>
        <CardTitle className="font-bold">Welcome Back!</CardTitle>
        <CardDescription>
          Please login to access the book summary app. We recommend using google
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full px-4 py-2"
                      placeholder="johndoe@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-muted-foreground" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full px-4 py-2"
                      placeholder="strong password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-muted-foreground" />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              className="w-full px-4 py-2 text-sm font-medium"
              type="submit"
              disabled={isPending}
            >
              Login Into Your Account
            </Button>
          </form>
        </Form>
        <form action={naSignIn}>
          <Button
            className="w-full px-4 py-2 mt-4 flex justify-center items-center space-x-2"
            type="submit"
            disabled={isPending}
          >
            <Image src={google} width={20} height={20} alt="google icon" />
            <span>Sign in with Google</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignIn;
