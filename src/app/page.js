"use client";

import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Gavel, ShieldCheck, FileSearch, Zap } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter} from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = async () => {
    // Not signed in → go to signin
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Signed in → fetch user role
    const res = await fetch("/api/user/me");

    if (!res.ok) {
      // Edge case: session exists but user doc missing
      router.push("/auth/role-gate");
      return;
    }

    const user = await res.json();

    // Role-based redirect
    if (user.role === "police") {
      router.push("/police/dashboard");
    } else if (user.role === "judge") {
      router.push("/judge/dashboard");
    } else if (user.role === "govt") {
      router.push("/govt/dashboard");
    } else {
      router.push("/auth/role-gate");
    }
  };
  return (
    <>
    <Navbar />
    <main className="w-full">

      {/* HERO SECTION */}
      <section className="flex justify-center h-[55vh] sm:h-[70vh] w-full">
        <div className="flex flex-col gap-6 justify-center items-center text-center px-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              AI‑Powered Legal Decision Support
            </h1>
            <p className="text-gray-400 max-w-[760px] mx-auto">
              Analyze FIRs, case documents, and judgments using explainable GenAI.  
              Built for Judges, Police, and Government Legal Departments.
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleGetStarted}>
          {session ? "Go to Dashboard" : "Get Started"}
        </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* FEATURES / STAKEHOLDERS */}
      <section className="min-h-[50vh] bg-gray-600/10 w-full flex justify-center items-center px-4">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 max-w-6xl w-full">

          {/* JUDGE */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-800">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Judges & Courts</h3>
            <p className="text-gray-400 max-w-[260px]">
              Prioritize cases, summarize large case files, and explore precedents
              using citation‑backed AI insights.
            </p>
          </div>

          {/* POLICE */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-800">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Police & Investigation</h3>
            <p className="text-gray-400 max-w-[260px]">
              Upload FIRs, extract IPC sections, generate summaries, and
              identify missing investigative elements.
            </p>
          </div>

          {/* GOVT LEGAL */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-800">
              <FileSearch className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Government Legal Dept</h3>
            <p className="text-gray-400 max-w-[260px]">
              Track government cases, analyze litigation risk, and
              study outcomes of similar past cases.
            </p>
          </div>

        </div>
      </section>

      {/* WHY THIS APP */}
      <section className="min-h-[40vh] w-full flex justify-center items-center px-4">
        <div className="max-w-4xl text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Why This Platform?
          </h2>
          <p className="text-gray-400">
            Legal professionals deal with thousands of pages across FIRs,
            charge sheets, and judgments. Our system uses a
            <span className="text-white font-medium"> rule‑aware RAG pipeline </span>
            to ensure AI responses are explainable, citation‑backed,
            and ethically constrained.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="h-[45vh] w-full flex flex-col justify-center items-center bg-gray-600/10 px-4">
        <div className="space-y-4 text-center max-w-xl">
          <h3 className="text-2xl font-bold">
            Start Exploring Legal Intelligence
          </h3>
          <p className="text-gray-400 text-sm">
            Sign in to access your role‑specific dashboard and begin
            analyzing legal cases with AI assistance.
          </p>
          <Link href="/auth/signin">
            <Button className="mt-2">Create an Account</Button>
          </Link>
        </div>
      </section>

    </main>
    </>
  );
}
