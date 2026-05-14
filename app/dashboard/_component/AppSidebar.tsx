"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Gem } from "lucide-react";
import { useContext } from "react"; 
import { UserDetails } from "@/context/UserData";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const MenuOptions = [
  { name: 'Dashboard', url: '/dashboard', icon: '/dashboard.png' },
  { name: 'Agent', url: '/dashboard/my-agents', icon: '/ai.png' },
  { name: 'Pricing', url: '/dashboard/pricing', icon: '/download.png' },
  { name: 'Profile', url: '/dashboard/profile', icon: '/profile.png' }
]

export function AppSidebar() {
  const { open } = useSidebar();
  const { userDetails } = useContext(UserDetails); 
  const { has } = useAuth();
  const hasPremiumAccess = has && has({ plan: "unlimited_plan" });
  const path = usePathname();
  const userAgents = useQuery(api.agent.GetUserAgents, 
    userDetails?._id ? { userId: userDetails._id as Id<"UserTable"> } : "skip"
  );
  const agentCount = userAgents?.length || 0;
  const isLimitReached = agentCount >= 2;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="Logo" width={35} height={35} />
          {open && <h2 className="text-lg font-bold">AgentFlow</h2>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size={open ? "lg" : "default"} isActive={path === menu.url}>
                    <Link href={menu.url}>
                      <Image src={menu.icon} alt={menu.name} width={20} height={20} />
                      <span>{menu.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-5">
        {!hasPremiumAccess ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <Gem className="w-5 h-5 text-yellow-500 shrink-0" />
              {open && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Remaining Credits</span>
                  <span className="text-sm font-bold">
                     {Math.max(0, 2 - agentCount)} / 2 Free Plan
                  </span>
                </div>
              )}
            </div>
            {open && (
              <Button className="w-full" size="sm">
                Upgrade to Premium
              </Button>
            )}
          </div>
        ) : (
          <div className="px-2 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            {open ? (
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-600 shrink-0" />
                <p className="text-sm font-semibold text-purple-900">
                  Unlimited Agents
                </p>
              </div>
            ) : (
              <Gem className="w-5 h-5 text-purple-600 mx-auto" />
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}