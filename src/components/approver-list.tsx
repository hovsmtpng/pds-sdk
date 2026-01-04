import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Employee {
  name: string
  title: string
  avatarUrl?: string
}

interface ApproverListProps {
    data: Employee[]
    isShowDelete?: boolean
    onDelete?: (index: number) => void
}

export function ApproverList({ 
    data, 
    isShowDelete,
    onDelete
 }: ApproverListProps) {
  return (
    <div className="w-full bg-white rounded-lg divide-y divide-dashed border border-gray-100">
      {data.map((person, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            {person.avatarUrl ? (
              <AvatarImage src={person.avatarUrl} alt={person.name} />
            ) : (
              <AvatarFallback>
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <div>
            <p className="text-sm font-medium text-gray-900">{person.name}</p>
            <p className="text-xs text-gray-500">{person.title}</p>
          </div>
          {isShowDelete && (
            <div className="ml-auto">
              <Button variant="outline" size="icon" className="ml-2" onClick={() => onDelete?.(index)}>
                <Trash2 className="text-destructive" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
