import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login | Admin Dashboard",
  description: "Login to the admin dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access the admin area
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          <Link href="/" className="text-primary hover:underline">
            Return to blog
          </Link>
        </div>
      </div>
    </div>
  );
}