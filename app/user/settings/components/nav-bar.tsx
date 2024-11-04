"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link key={item.title} href={item.href}>
          <Button
            variant="ghost"
            className={`w-full ${
              pathname === item.href
                ? `bg-muted hover:bg-muted`
                : `hover:bg-transparent hover:underline`
            }`}
          >
            <div className={`w-full text-left py-2`}>{item.title}</div>
          </Button>
        </Link>
      ))}
    </nav>
  );
}
