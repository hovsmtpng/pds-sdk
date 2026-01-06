"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  Search,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { RoleSwitcher } from "@/components/roles-switcher"

import { Button } from "@/components/ui/button"
import { Input, InputWrapper } from "@/components/ui/input"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

import OdongIcon from "@/assets/OdongIcon"
import { useAuth } from "@/auth/AuthContext"
import NoMenuAvailable from "./error-pages/NoMenuAvailable"
import { convertRoutesToNavItems } from "@/lib/convertRoutesToNavItems"

// 🧠 Types
export interface Role {
  apps_name?: string
  logo?: React.ComponentType<any>
  role_name?: string
}

export interface RouteItem {
  title: string
  path?: string
  visibility?: boolean | string
  items?: RouteItem[]
}

export interface UserRole {
  role_name: string
  effective_from: string
  effective_to: string
  role_alias: string
  status: string
}

export interface User {
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

export interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: Role[]
  routes: RouteItem[]
  activeRole: Role | null
  userRole: { user: User, roles: UserRole[] } | null
  handleClick?: (route: RouteItem) => void
  handleRoutes: (routes: RouteItem[]) => void
  handleChangeRole: (role: UserRole) => void
  handleAccountInformation?: () => void
}

// 🧩 Sample data (dummy)
const data = {
  user: {
    name: "Pulog UXUI",
    email: "it@puninar.com",
    avatar: "/avatars/shadcn.jpg",
  },
  roles: [
    { name: "Odong", logo: OdongIcon, plan: "SUPERADMIN" },
    { name: "Odong", logo: OdongIcon, plan: "SURAT JALAN" },
    { name: "Odong", logo: OdongIcon, plan: "POOLING" },
    { name: "Odong", logo: OdongIcon, plan: "SETTLE OPERATION" },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
}

// 🧭 Component
export function AppSidebar({
  roles,
  routes,
  userRole,
  activeRole,
  handleClick,
  handleRoutes,
  handleChangeRole,
  handleAccountInformation,
  ...props
}: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const { auth } = useAuth();

  const wasCollapsed = React.useRef(false)

  const handleSidebarEnter = () => {
    if (state === "collapsed") {
      wasCollapsed.current = true
      toggleSidebar()
    }
  }

  const handleSidebarLeave = () => {
    if (wasCollapsed.current) {
      toggleSidebar()
      wasCollapsed.current = false
    }
  }

  // 🔍 Recursive filter for search
  const filterRoutes = React.useCallback(
    (routes: RouteItem[], query: string): RouteItem[] => {
      if (!query) return routes

      return routes
        .map((route) => {
          const matchSelf = route.title
            ?.toLowerCase()
            .includes(query.toLowerCase())

          if (route.items) {
            const filteredItems = filterRoutes(route.items, query)
            if (matchSelf || filteredItems.length > 0) {
              return { ...route, items: filteredItems }
            }
          }

          if (matchSelf) return { ...route }
          return null
        })
        .filter((r): r is RouteItem => r !== null)
    },
    []
  )

  // 🔍 Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleRoutes(filterRoutes(routes.filter((r) => !r.visibility), value))
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}
      onMouseEnter={handleSidebarEnter}
      onMouseLeave={handleSidebarLeave}
    >
      <SidebarHeader>
        <RoleSwitcher
          roles={roles}
          userRole={userRole}
          activeRole={activeRole}
          handleChangeRole={handleChangeRole}
        />
      </SidebarHeader>

      <SidebarContent>
        {/* 🔎 Search bar */}
        <div className={`pt-2 mx-2 ${state === "expanded" ? "block" : "hidden"}`}>
          <InputWrapper>
            <Search />
            <Input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </InputWrapper>
        </div>

        {/* 🧭 Menu Available */}
        {routes.length > 0 && (
          <>
            <NavMain items={convertRoutesToNavItems(routes)} />
          </>
        )}

        {/* 🧭 Menu Not Available */}
        {routes.length === 0 && state === "expanded" && (
          <NoMenuAvailable />
        )}

        <NavProjects className="hidden" projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={auth} handleRoutes={handleRoutes} handleAccountInformation={handleAccountInformation} />
      </SidebarFooter>

      {/* Vertical handle to expand/collapse */}
      <SidebarRail />
    </Sidebar>
  )
}
