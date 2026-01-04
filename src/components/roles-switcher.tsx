"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import OdongIcon from "@/assets/OdongIcon"

// 🧠 Type definitions
export interface RoleSwitcher {
  apps_name?: string
  logo?: React.ComponentType<any>
  role?: string
}

export interface UserRoleSwitcher {
  role_name: string
  role_alias: string
  status: string
  effective_from: string
  effective_to: string
}

export interface UserSwitcher {
  department: string
  division: string
  email: string
  entity: string
  fullname: string
  group: string
  level: string
  npk: string
  position: string
  username: string
  work_location: string
}

export interface RoleSwitcherProps {
  roles: RoleSwitcher[]
  userRole: { user: UserSwitcher, roles: UserRoleSwitcher[] } | null
  activeRole: RoleSwitcher | null,
  handleChangeRole: (role: UserRoleSwitcher) => void
}

// 🧩 Component
export function RoleSwitcher({
  roles,
  userRole = null,
  activeRole,
  handleChangeRole,
}: RoleSwitcherProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <OdongIcon className="size-9" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-lg pb-0.5">
                  {activeRole?.apps_name || "Odong"}
                </span>
                <span className={`truncate text-xs ${activeRole?.role ? "" : "text-destructive"}`}>
                  {activeRole?.role || "NOT ASSIGNED"}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-46 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Roles {userRole?.roles?.length === 0 && <span className="text-destructive">(NOT ASSIGNED)</span>}
            </DropdownMenuLabel>

            {userRole && userRole?.roles?.filter((role) => role.effective_to !== null && new Date(role.effective_to) > new Date()).map((role) => (
              <DropdownMenuItem
                key={role.role_name}
                onClick={() => handleChangeRole(role)}
                className="gap-2 p-2"
              >
                {role.role_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
