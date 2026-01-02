"use client"

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOut(){
    return <div onClick={()=> signOut({ callbackUrl: '/sign-in'})} className="flex items-center gap-2"> 
        <LogOut className="w-4" /> Log out!
    </div>
}