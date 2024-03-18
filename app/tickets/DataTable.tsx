"use client"
import TicketPriority from '@/components/TicketPriority'
import TicketStatusBadge from '@/components/TicketStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ticket } from '@prisma/client'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    tickets: Ticket[]
}

function DataTable({ tickets }: Props) {
    return (
        <div className='w-full mt-5'>
            <div className='rounded-ed sm:border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead><div className='flex justify-center'>Status</div></TableHead>
                            <TableHead className='text-center'>Priority</TableHead>
                            <TableHead>Create at</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets && tickets.map((_) => {
                            return (
                                <TableRow key={_.id} data-href="/">
                                    <TableCell>
                                        <Link className='hover:underline' href={`/tickets/${_.id}`}>
                                            {_.title}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex justify-center'>
                                            <TicketStatusBadge status={_.status} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <TicketPriority priority={_.priority} />
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(_.createdAt).format('YYYY-MM-DD HH:mm')}
                                    </TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataTable