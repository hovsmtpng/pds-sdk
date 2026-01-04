/**
 * Struktur dasar untuk routing aplikasi.
 * Biasanya digunakan untuk definisi navigasi atau react-router.
 */
export interface RouteItem {
  title: string
  path?: string
  visibility?: boolean | string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items?: RouteItem[]
}
