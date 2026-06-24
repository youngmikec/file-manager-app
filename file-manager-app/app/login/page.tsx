"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthFormData } from "@/validations/auth";
import { useLoginUser } from "@/hooks/auth-hooks";

export default function LoginPage() {
  const { mutate: login, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const onSubmit = (data: AuthFormData) => login(data);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-purple-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full border border-purple-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Dont have an account?{" "}
            <a href="/register" className="text-purple-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}