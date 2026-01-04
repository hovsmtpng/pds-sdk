import * as React from "react"
import { DashboardCard } from "./dashboard-card"

interface DashboardCardGroupProps {
  items: {
    id: string | number
    label: string
    value: string | number
    icon?: React.ElementType
    color?: string
  }[]
  activeId?: string | number
  onChange?: (id: string | number) => void
}

export function DashboardCardGroup({
  items,
  activeId: controlledActiveId,
  onChange,
}: DashboardCardGroupProps) {
  const [activeId, setActiveId] = React.useState<string | number | null>(
    controlledActiveId ?? (items.length > 0 ? items[0].id : null)
  )

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const borderRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    const border = borderRef.current
    if (!container || !border || !activeId) return

    const activeCard = container.querySelector<HTMLDivElement>(`[data-id="${activeId}"]`)
    if (!activeCard) return

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeCard
    border.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`
    border.style.width = `${offsetWidth}px`
    border.style.height = `${offsetHeight}px`
  }, [activeId, items])

  const handleClick = (id: string | number) => {
    setActiveId(id)
    if (onChange) onChange(id)
  }

  return (
    <div
      ref={containerRef}
      className="relative grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <div
        ref={borderRef}
        className="absolute border-1 border-purple-400 rounded-md transition-all duration-200 ease-in-out pointer-events-none"
      />

      {items.map((item) => (
        <DashboardCard
          key={item.id}
          data-id={item.id}
          label={item.label}
          value={item.value}
          icon={item.icon}
          color={item.color}
          active={activeId === item.id}
          onClick={() => handleClick(item.id)}
        />
      ))}
    </div>
  )
}
