import { Ticket } from '@prisma/client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import TicketStatusBadge from '@/components/TicketStatusBadge'
import TicketPriority from '@/components/TicketPriority'
import dayjs from 'dayjs'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import ReactMarkDown from 'react-markdown'


interface Props {
    ticket: Ticket
}

const TicketDetail = ({ ticket }: Props) => {
    return (
        <div className='lg:grid lg:grid-cols-4 px-4'>
            <Card className=' mb-4 lg:col-span-3'>
                <CardHeader>
                    <div className='flex justify-between mb-3'>
                        <TicketStatusBadge status={ticket.status}></TicketStatusBadge>
                        <TicketPriority priority={ticket.priority}></TicketPriority>
                    </div>
                    <CardTitle>{ticket.title}</CardTitle>
                    <CardDescription>Created:{dayjs(ticket.createdAt).format('YYYY-MM-DD HH:mm')}</CardDescription>
                </CardHeader>
                <CardContent className='prose dark:prose-invert'>
                    <ReactMarkDown>{ticket.description}</ReactMarkDown>
                </CardContent>
                <CardFooter>
                    <CardDescription>Updated:{dayjs(ticket.updatedAt).format('YYYY-MM-DD HH:mm')}</CardDescription>
                </CardFooter>
            </Card>
            <div className='lg:flex-col flex justify-between lg:justify-start lg:ml-4 gap-3'>
                <Link href={`/tickets/edit/${ticket.id}`} className={`${buttonVariants({
                    variant: "default"
                })}`}>Edit Ticket</Link>
                <Link href={`/tickets/delete/${ticket.id}`} className={`${buttonVariants({
                    variant: "default"
                })}`}>Delete Ticket</Link>
            </div>
        </div>

    )
}

export default TicketDetail