import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import useSessionCheck from "@/lib/useSessionCheck";
import { Role } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    const session = await useSessionCheck()
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    if (session.user.role !== Role.ADMIN) return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    const body = await request.json()
    const validation = userSchema.safeParse(body)
    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }
    const duplicate = await prisma.user.findUnique({
        where: {
            userName: body.userName
        }
    })
    if (duplicate) {
        return NextResponse.json({
            message: "Duplicate userName"
        }, { status: 409 })
    }
    const hashPassword = await bcrypt.hash(body.password, 10)
    body.password = hashPassword
    const newUser = await prisma.user.create({
        data: { ...body }
    })
    return NextResponse.json(newUser, {
        status: 201
    })
}