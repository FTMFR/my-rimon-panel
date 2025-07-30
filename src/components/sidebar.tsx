"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "User", href: "/dashboard/user" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded hover:bg-gray-100 transition",
              pathname === item.href ? "bg-gray-200 font-medium" : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
