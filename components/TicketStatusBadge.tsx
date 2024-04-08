import React from 'react'
import { Badge } from './ui/badge'
import { Status } from '@prisma/client'
import { cn } from '@/lib/utils'

interface Props {
    status: Status
}

const statusColorMap: Record<Status, { label: string; color: "bg-red-400" | "bg-blue-400" | "bg-green-400" }> = {
    OPEN: { label: "Open", color: "bg-red-400" },
    STARTED: { label: "Started", color: "bg-blue-400" },
    CLOSED: { label: "Closed", color: "bg-green-400" },
}

function TicketStatusBadge({ status }: Props) {
    const { color, label } = statusColorMap[status]
    return <Badge className={cn(color, 'text-background', `hover:${color} min-w-[66px] justify-center`)}>
        {label}
    </Badge>
}

export default TicketStatusBadge