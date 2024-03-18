import { Priority } from '@prisma/client'
import { Flame } from 'lucide-react'
import React from 'react'

interface Props {
    priority: Priority
}

const priorityColors: Record<Priority, {
    label: string,
    level: 1 | 2 | 3
}> = {
    HIGH: {
        label: "High",
        level: 3
    },
    MEDIUM: {
        label: "Medium",
        level: 2
    },
    LOW: {
        label: "Low",
        level: 1
    }
}

function TicketPriority({ priority }: Props) {
    const { level } = priorityColors[priority]
    const flameColor = () => {
        switch (level) {
            case 1:
                return 'text-red-200'
            case 2:
                return 'text-red-300'
            case 3:
                return 'text-red-500'
            default:
                return 'text-red-500'
        }
    }
    return (
        <div className='flex justify-center'>
            {Array.from({ length: level }).map((_, i) => (<Flame className={flameColor()} key={i} />))}
            {Array.from({ length: 3 - level }).map((_, i) => (<Flame className='text-gray-200' key={i} />))}
        </div>
    )
}

export default TicketPriority