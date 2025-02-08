"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import GoogleButton from "react-google-button";

// Schema validation
const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    if (!isClient) return; // Ensure execution only on client

    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false, // Prevent automatic redirection issues
    });

    if (signInData?.error) {
      console.error(signInData.error);
    } else {
      router.push("/admin");
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Sign In
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              defaultValue=""
              {...form.register("email")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mail@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              defaultValue=""
              {...form.register("password")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Sign in
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <button
            className="bg-blue-500 w-40 rounded-4xl"
            onClick={() => {
              signIn("github", { callbackUrl: "/" });
            }}
          >
            Sign In with Github
          </button>
          <button
            className="bg-blue-500 w-40 rounded-4xl"
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
          >
            Sign In with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            If you don&apos;t have an account, please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
