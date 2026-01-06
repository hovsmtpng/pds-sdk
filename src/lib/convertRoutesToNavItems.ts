import { RouteItem, NavItem, NavSubItem } from "@/types"

export function convertRoutesToNavItems(routes: RouteItem[]): NavItem[] {
  return routes
    .map<NavItem>(route => ({
      title: route.title,
      path: route.path, // fallback kalau url undefined
      visibility: route.visibility,
      icon: route.icon || undefined, // bisa isi sesuai kebutuhan
      items: route.items
        ? route.items
            .map<NavSubItem>(sub => ({
              title: sub.title,
              path: sub.path || "#",
              visibility: sub.visibility,
              icon: sub.icon || undefined,
            }))
        : undefined,
    }))
}
