"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleGate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.googleId) {
      router.push("/auth/signin");
      return;
    }

    const checkUser = async () => {
      const res = await fetch("/api/user/me");

      if (res.ok) {
        const user = await res.json();

        if (user.role === "police") router.push("/police/dashboard");
        if (user.role === "judge") router.push("/judge/dashboard");
        if (user.role === "govt") router.push("/govt/dashboard");
      } else {
        // New user → show role selection
        setLoading(false);
      }
    };

    checkUser();
  }, [session, status, router]);

  const selectRole = async (role) => {
    await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (role === "police") router.push("/police/dashboard");
    if (role === "judge") router.push("/judge/dashboard");
    if (role === "govt") router.push("/govt/dashboard");
  };

  if (loading) {
    return <p className="text-center mt-20">Checking account...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-semibold">Select Your Role</h1>

      <div className="flex gap-4">
        <button
          onClick={() => selectRole("police")}
          className="px-6 py-3 bg-blue-600 rounded"
        >
          Police
        </button>

        <button
          onClick={() => selectRole("judge")}
          className="px-6 py-3 bg-green-600 rounded"
        >
          Judge
        </button>

        <button
          onClick={() => selectRole("govt")}
          className="px-6 py-3 bg-purple-600 rounded"
        >
          Govt Legal
        </button>
      </div>
    </div>
  );
}
