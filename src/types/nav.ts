import React from "react"

/**
 * Submenu item di sidebar navigasi
 */
export interface NavSubItem {
  title: string
  path: string
  visibility?: boolean | string
}

/**
 * Item utama di sidebar navigasi
 */
export interface NavItem {
  title: string
  path?: string
  visibility?: boolean | string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items?: NavSubItem[]
}
