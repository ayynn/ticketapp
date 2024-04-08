import { Prisma } from '@prisma/client'
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import TicketStatusBadge from './TicketStatusBadge'
import Link from 'next/link'
import TicketPriority from './TicketPriority'
import Pagination from './Pagination'

type TicketWithUser = Prisma.TicketGetPayload<{
    include: {
        assignedToUser: true,
    }
}>

interface Props {
    tickets: TicketWithUser[]
    page: number
    pageSize: number
    total: number
}

const RecentTickets = ({ tickets, page, pageSize, total }: Props) => {
    return (
        <>
            <Card className='col-span-3'>
                <CardHeader>
                    <CardTitle>
                        Recently Updated
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-8'>
                        {tickets.map(t => (
                            <div className='flex items-center' key={t.id}>
                                <TicketStatusBadge status={t.status} />
                                <div className='ml-4 space-y-1'>
                                    <Link href={`/tickets/${t.id}`}>
                                        <p>{t.title}</p>
                                        <p>{t.assignedToUser?.name || 'Unassigned'}</p>
                                    </Link>
                                </div>
                                <div className='ml-auto font-medium'>
                                    <TicketPriority priority={t.priority} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Pagination pageSize={pageSize} itemCount={total} currentPage={page}></Pagination>
        </>
    )
}

export default RecentTickets