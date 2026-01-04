import * as React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyBoxProps {
  onAdd?: () => void
  title?: string | React.ReactNode,
  text?: string | React.ReactNode,
}

export const EmptyBox: React.FC<EmptyBoxProps> = ({
  onAdd,
  title = 'Approver',
  text = 'Please add one or more approvers to continue.',
}) => {
  return (
    <div className="w-full h-50 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md hover:border-indigo-400 transition text-center">
      {typeof text === 'string' ? <p className="text-sm text-gray-600 mb-3">{text}</p> : text}
      <Button
        type="button"
        onClick={onAdd}
        variant="primary"
        className="text-xs"
      >
        <Plus className="h-2 w-2" />Add {title}
      </Button>
    </div>
  )
}
