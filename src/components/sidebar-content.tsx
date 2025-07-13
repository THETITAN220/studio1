
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Home,
  User,
  ShoppingBag,
  PanelLeft,
  Moon,
  Sun,
  LogIn
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./ui/button";

export function SidebarContent() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/backpack", label: "My Backpack", icon: ShoppingBag },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              CampusConnect
            </h1>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <PanelLeft />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContentArea className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton tooltip={item.label} isActive={pathname === item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContentArea>
      
      <SidebarFooter>
        <div className="flex items-center justify-between border-t border-sidebar-border p-2 gap-2">
          <Link href="/profile" passHref className="flex-grow">
            <Button variant="ghost" className="w-full justify-start gap-2 px-2">
              <User className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Profile</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
          </Button>
        </div>
        <div className="border-t border-sidebar-border p-2">
           <Link href="/login" passHref className="w-full">
            <Button variant="outline" className="w-full justify-center gap-2 bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogIn className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Login</span>
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </>
  );
}
