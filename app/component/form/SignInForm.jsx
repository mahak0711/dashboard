"use client"
import { useForm } from "react-hook-form"
import Link from "next/link"

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = values => {
    console.log(values)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mail@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must have at least 8 characters" } })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200" type="submit">
            Sign in
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          
          <p className="text-center text-sm text-gray-600">
            If you don&apos;t have an account, please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignInForm
