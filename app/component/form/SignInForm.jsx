"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaGithub, FaGoogle } from "react-icons/fa";

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
    if (!isClient) return;

    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      console.error(signInData.error);
    } else {
      router.push("/admin");
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 px-4 ">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105 mt-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              {...form.register("email")}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="mail@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              {...form.register("password")}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your password"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
            type="submit"
          >
            Sign In
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              className="flex items-center justify-center w-full bg-gray-800 text-white py-2 rounded-md font-semibold transition-all duration-300 hover:bg-gray-900 hover:shadow-lg"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <FaGithub className="mr-2" size={20} /> Sign In with GitHub
            </button>

            <button
              className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-md font-semibold transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FaGoogle className="mr-2" size={20} /> Sign In with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link className="text-blue-500 hover:underline font-medium" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
