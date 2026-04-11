"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-semibold">Sign in to continue</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/auth/role-gate" })}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Continue with Google
      </button>
    </div>
  );
}
