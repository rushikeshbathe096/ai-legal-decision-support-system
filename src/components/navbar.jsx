import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { ScrollText } from "lucide-react";
//import { getAuthsession } from "@/lib/auth";
import Image from "next/image";
import SignOut from "./signout";

export default async function Navbar() {
    const auth = true;
  //const session = await getAuthsession();
  // console.log(session, 'session')
  const tempUser = {
    name: 'Sam',
    username: 'sam'
  }
  return (
    <div className="w-full flex justify-between items-center px-8 h-12">
      <Link href="/" className="flex gap-2">
        <ScrollText /> <span className="font-extrabold">DOCSAI</span>
      </Link>
      {auth ? (
        <UserModalComponent user={tempUser}/>
      ) : (
        <Link href="/sign-in">Sign in</Link>
      )}
    </div>
  );
}

const UserModalComponent = ({user})=>{
    return(
        <DropdownMenu>
  <DropdownMenuTrigger>
    <Image src = {user.image} height = {40} width={40} alt="user avatar" className="rounded-full"/>
    </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Hi, {user.name}!</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
        <Link href={`/profile/${user.username}`}>
        Go to Profile
        </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <SignOut/>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    )
}