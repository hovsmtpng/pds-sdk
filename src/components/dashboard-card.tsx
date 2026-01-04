import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FolderCheck } from "lucide-react"

interface DashboardCardProps {
    icon?: React.ElementType
    label: string
    value: number | string
    color?: string
    active?: boolean
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function DashboardCard({
    icon: Icon = FolderCheck,
    label,
    value,
    color = "text-primary",
    active = false,
    onClick,
}: DashboardCardProps) {
    const cardRef = React.useRef<HTMLDivElement | null>(null)

    const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current
        if (!card) return

        const circle = document.createElement("span")
        const diameter = Math.max(card.clientWidth, card.clientHeight)
        const radius = diameter / 2

        circle.style.width = circle.style.height = `${diameter}px`
        circle.style.left = `${e.clientX - card.getBoundingClientRect().left - radius}px`
        circle.style.top = `${e.clientY - card.getBoundingClientRect().top - radius}px`
        circle.classList.add("ripple")

        const oldRipple = card.getElementsByClassName("ripple")[0]
        if (oldRipple) oldRipple.remove()

        card.appendChild(circle)
    }

    // gabungkan ripple effect + event luar
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        handleRipple(e)
        if (onClick) onClick(e) // tetap panggil callback luar
    }

    return (
        <Card
            ref={cardRef}
            className={`relative overflow-hidden w-48 shadow-xs hover:shadow-sm transition-all select-none`}
            onClick={handleClick}
        >
            <CardContent className="flex flex-col items-start justify-between px-4 space-y-2">
                {/* Header */}
                <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
                </div>

                {/* Value */}
                <div className="text-2xl font-semibold text-foreground">{value}</div>
            </CardContent>
        </Card>
    )
}
