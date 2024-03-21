"use client"
import { Ticket, User } from '@prisma/client'
import { useState } from 'react'
import request from '@/lib/request'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

interface Props {
    ticket: Ticket,
    users: User[]
}

const AssignTickets = ({ ticket, users }: Props) => {
    const [isAssigning, setIsAssigning] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    async function assignTicket(userId: string) {
        setIsAssigning(true)
        const { data, success, msg } = await request({
            url: `/api/tickets/${ticket.id}`,
            data: { assignedToUserId: userId == "0" ? null : userId },
            method: "PATCH"
        })
        toast({
            title: 'Assign Ticket' + (success ? 'Success' : 'Failed'),
            duration: 2000,
            variant: success ? "default" : "destructive",
        })
        router.refresh()

        setIsAssigning(false)
    }

    return (
        <div>
            <Select disabled={isAssigning} defaultValue={ticket.assignedToUserId?.toString()} onValueChange={assignTicket}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Assign to User" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Unassigned</SelectItem>
                    {
                        users.map((user) => (<SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>))
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default AssignTickets