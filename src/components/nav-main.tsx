"use client"

import * as React from "react"
import { ChevronRight, Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { Text } from "./text"

// 🧠 Type definitions
export interface NavSubItem {
  title: string
  path: string
  visibility?: boolean | string
}

export interface NavItem {
  title: string
  path?: string
  visibility?: boolean | string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items?: NavSubItem[]
}

export interface NavMainProps {
  items: NavItem[]
}

// 🧭 Component
export function NavMain({ items }: NavMainProps) {
  const location = useLocation()
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => item.path !== "*" && item.visibility !== false)
          .map((item) => {
            const visibleSubItems = Array.isArray(item.items)
              ? item.items.filter((subItem) => subItem.visibility !== false)
              : [];

            const hasVisibleSubItems = visibleSubItems.length > 0;

            return hasVisibleSubItems ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={location.pathname.startsWith(`/${item.path}`)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={location.pathname.startsWith(`/${item.path}`)}
                    >
                      {item.icon && <item.icon />}
                      <Text size="sm">{item.title}</Text>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub>
                      {visibleSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === `/${subItem.path}`}
                          >
                            <Link
                              to={subItem.path}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <Text size="sm">{subItem.title}</Text>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              // === Menu tanpa child (semua child hidden atau tidak ada) ===
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={location.pathname === `/${item.path}` || location.pathname.startsWith(`/${item.path}`)}
                >
                  <Link to={item.path || "#"}>
                    {item.icon && <item.icon />}
                    <Text size="sm">{item.title}</Text>
                  </Link>
                </SidebarMenuButton>
                {/* Penambahan baru */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-full rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );

}
