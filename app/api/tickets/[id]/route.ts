import { ticketSchema, ticketPatchSchema } from "@/ValidationSchemas/ticket";
import useSessionCheck from "@/lib/useSessionCheck";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: { id: string }
}

export const PATCH = async (request: NextRequest, { params }: Props) => {
    const checked = await useSessionCheck()
    if (!checked) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const body = await request.json()
    const validation = ticketPatchSchema.safeParse(body)
    if (!validation.success) {
        console.log(validation.error)
        return NextResponse.json(validation.error.format(), { status: 400 })
    }
    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(params.id) } })
    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    if (body?.assignedToUserId && body.assignedToUserId !== null) {
        body.assignedToUserId = parseInt(body.assignedToUserId)
    }
    const updateTicket = await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
            ...body
        }
    })
    return NextResponse.json(updateTicket)
}

export const DELETE = async (request: NextRequest, { params }: Props) => {
    const checked = await useSessionCheck()
    if (!checked) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(params.id) } })
    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    const deleteresult = await prisma.ticket.delete({ where: { id: ticket.id } })
    if (deleteresult) {
        return NextResponse.json({ message: "Ticket deleted", data: deleteresult })
    } else {
        return NextResponse.json({ error: "Delete ticked failed" }, { status: 404 })
    }
}