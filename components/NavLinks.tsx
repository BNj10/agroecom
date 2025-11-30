import Link from "next/link";
import { useUser } from "@/hooks/use-user";

export default function NavLinks() {
  const { user } = useUser();

  return (
    <nav className="hidden md:flex items-center gap-8 text-white font-medium">
      {user && <Link href="/dashboard" className="hover:text-green-300 transition">Dashboard</Link>}
      {!user && <Link href="/" className="hover:text-green-300 transition">Home</Link>}

        <Link href="/equipment" className="hover:text-green-300 transition">
            Equipment
        </Link>

        <Link href="/about-us" className="hover:text-green-300 transition">
            About Us
        </Link>

        <Link href="/contacts" className="hover:text-green-300 transition">
            Contacts
        </Link>
    </nav>
  );
}