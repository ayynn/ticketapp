import { ticketSchema } from "@/ValidationSchemas/ticket";
import useSessionCheck from "@/lib/useSessionCheck";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const session = await useSessionCheck()
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await request.json()
    const validation = ticketSchema.safeParse(body)
    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }
    const newTicket = await prisma?.ticket.create({
        data: { ...body }
    })

    return NextResponse.json(newTicket, { status: 201 })
}