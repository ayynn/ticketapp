"use client"
import Pagination from '@/components/Pagination'
import TicketPriority from '@/components/TicketPriority'
import TicketStatusBadge from '@/components/TicketStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ticket } from '@prisma/client'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

interface Props {
    tickets: Ticket[]
    searchParams: {
        totalCount: number
        pageSize: number
        page: string
    }
}

function DataTable({ tickets, searchParams }: Props) {
    const paramsPage = searchParams.page
    const pageSize = searchParams.pageSize
    const page = parseInt(paramsPage) || 1

    return (
        <div className='w-full mt-5 h-0 flex-1 mb-5'>
            <div className='rounded-ed sm:border h-full flex flex-col'>
                <Table className='h-0 flex-1 '>
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
                <Pagination itemCount={searchParams.totalCount} pageSize={pageSize} currentPage={page}></Pagination>
            </div>
        </div>
    )
}

export default DataTable