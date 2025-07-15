"use client";

import * as React from "react";
import { Command } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  NavigationLinks,
  schoolName,
  SecondaryLinks,
} from "../../utils/constants";
import Link from "next/link";
import { NavSecondary } from "./nav-secondary";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <Image
                    height={400}
                    width={400}
                    alt="Logo"
                    src={"/android-chrome-512x512.png"}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className=" line-clamp-1 font-medium">
                    {schoolName}
                  </span>
                  <span className="truncate text-xs">Library</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NavigationLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
      </SidebarFooter>
    </Sidebar>
  );
}
