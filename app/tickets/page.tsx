import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './DataTable'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchParams {
  page: string
  pageSize: string
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = parseInt(searchParams.pageSize || '10')
  const tickets = await prisma.ticket.findMany({
    take: pageSize,
    skip: (parseInt(searchParams.page || '1') - 1) * pageSize,
  })
  const ticketCount = await prisma.ticket.count()

  return (
    <div className='px-5 mb-5 h-full flex flex-col'>
      <Link href="/tickets/new" className={cn(buttonVariants({ variant: "default" }), 'inline w-fit')}>New Ticket</Link>
      <DataTable searchParams={{
        totalCount: ticketCount,
        pageSize,
        page: searchParams.page || '1'
      }} tickets={tickets} />
    </div>
  )
}

export default Tickets