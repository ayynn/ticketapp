"use client"
import Pagination from '@/components/Pagination'
import TicketPriority from '@/components/TicketPriority'
import TicketStatusBadge from '@/components/TicketStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Status, Ticket } from '@prisma/client'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    tickets: Ticket[]
    searchParams: {
        totalCount: number
        pageSize: number
        page: string
        orderBy: keyof Ticket
        status: Status | '0'
    }
}

function DataTable({ tickets, searchParams }: Props) {
    const paramsPage = searchParams.page
    const pageSize = searchParams.pageSize
    const page = parseInt(paramsPage) || 1

    const currentParams = {
        page,
        pageSize,
        status: searchParams.status,
    }
    const theads = [
        {
            property: 'title',
            label: 'Title',
        },
        {
            property: 'status',
            label: 'Status',
        },
        {
            property: 'priority',
            label: 'Priority',
        },
        {
            property: 'createdAt',
            label: 'Create At',
        },
    ]

    const linkElement = (property: string, label: string) => <Link href={{
        query: {
            ...currentParams,
            orderBy: searchParams.orderBy === property ? undefined : property
        }
    }}>
        <span className='flex items-center'>
            {label}
            <ArrowDown className={cn('h-4 w-4', searchParams.orderBy === property ? '' : 'opacity-0')} />
        </span>
    </Link>

    return (
        <div className='w-full mt-5 h-0 flex-1 mb-5'>
            <div className='rounded-ed sm:border h-full flex flex-col'>
                <Table className='h-0 flex-1 '>
                    <TableHeader>
                        <TableRow>
                            {
                                theads.map(({ property, label }) => (
                                    <TableHead key={property}>
                                        {
                                            ['status', 'priority'].includes(property) ? <div className='flex justify-center'>
                                                {linkElement(property, label)}
                                            </div> : <>
                                                {linkElement(property, label)}
                                            </>
                                        }
                                    </TableHead>
                                ))
                            }
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