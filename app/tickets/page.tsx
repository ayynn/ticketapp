import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './_components/DataTable'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import StatusFilter from '@/components/StatusFilter'
import { Status, Ticket } from '@prisma/client'

interface SearchParams {
  page: string
  pageSize: string
  status: Status | '0'
  orderBy: keyof Ticket
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const statusList = Object.values(Status)
  const pageSize = parseInt(searchParams.pageSize || '10')

  const status = statusList.includes(searchParams.status as Status) ? searchParams.status as Status : undefined

  let where = {}

  if (status) {
    where = {
      status
    }
  } else {
    where = {
      NOT: [{ status: "CLOSED" as Status }]
    }
  }

  const tickets = await prisma.ticket.findMany({
    take: pageSize,
    skip: (parseInt(searchParams.page || '1') - 1) * pageSize,
    where,
    orderBy: searchParams.orderBy ? { [searchParams.orderBy]: 'desc' } : undefined
  })
  const ticketCount = await prisma.ticket.count({
    where
  })

  return (
    <div className='px-5 mb-5 h-full flex flex-col'>
      <div className='flex justify-between'>
        <Link href="/tickets/new" className={cn(buttonVariants({ variant: "default" }), 'w-fit')}>New Ticket</Link>
        <div>
          <StatusFilter />
        </div>
      </div>
      <DataTable searchParams={{
        totalCount: ticketCount,
        pageSize,
        page: searchParams.page || '1',
        orderBy: searchParams.orderBy,
        status: searchParams.status
      }} tickets={tickets} />
    </div>
  )
}

export default Tickets