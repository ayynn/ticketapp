import React from 'react'
import prisma from '@/prisma/db'
import TicketDetail from '../_components/TicketDetail'

interface Props {
    params: {
        id: string
    }
}

const ViewTicket = async ({ params }: Props) => {
    const notfound = <p className='text-destructive'>Ticket not found</p>
    if (isNaN(parseInt(params.id))) return notfound
    const ticket = await prisma.ticket.findUnique({
        where: {
            id: parseInt(params.id)
        }
    })
    const users = await prisma.user.findMany(
        {
            where: {
                role: 'USER',
                NOT: {
                    isDeleted: true
                }
            }
        }
    )
    if (!ticket) return notfound
    return (
        <TicketDetail ticket={ticket} users={users} />
    )
}

export default ViewTicket