import React from 'react'
import prisma from '@/prisma/db'
import DashRecentTickets from '@/components/DashRecentTickets'
import DashCharts from '@/components/DashCharts'
import { Status } from '@prisma/client'

interface searchParams {
  page: string
  pageSize: string
}

const Dashboard = async ({ searchParams }: { searchParams: searchParams }) => {
  const { page: p, pageSize: ps } = searchParams
  const page = parseInt(p || '1')
  const pageSize = parseInt(ps || '5')
  const where = {
    NOT: [{ status: 'CLOSED' as Status }]
  }
  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      updatedAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      assignedToUser: true
    }
  })
  const ticketCount = await prisma.ticket.count({
    where
  })

  const grouptickets = await prisma.ticket.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  })

  const data = grouptickets.map(item => {
    return {
      name: item.status,
      total: item._count.id
    }
  })

  console.log(grouptickets)

  return (
    <div className='h-full'>
      <div className='grid gap-4 md:grid-cols-2 grid-rows-1 px-2 h-full'>
        <div className='h-full flex flex-col'>
          <DashRecentTickets page={page} pageSize={pageSize} total={ticketCount} tickets={tickets} />
        </div>
        <div className='h-full pb-16'>
          <DashCharts data={data} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard