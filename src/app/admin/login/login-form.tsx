"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          disabled={isLoading}
          className="w-full p-2 border rounded"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          disabled={isLoading}
          className="w-full p-2 border rounded"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-2 rounded font-medium"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}