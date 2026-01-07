"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollText } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full h-14 border-b">
      <div className="flex h-full w-full items-center justify-between px-8">

        {/* LEFT: App name */}
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <ScrollText className="h-5 w-5" />
          <span>DOCSAI</span>
        </Link>

        {/* RIGHT */}
        {status === "authenticated" ? (
          <UserMenu user={session.user} />
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-md bg-white text-white text-sm font-xl hover:bg-gray-200 transition"
          >
            Sign in
          </Link>
        )}

      </div>
    </header>
  );
}

function UserMenu({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Image
          src={user.image || "/avatar.png"}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
