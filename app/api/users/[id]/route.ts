import { userSchema } from "@/ValidationSchemas/users";
import useSessionCheck from "@/lib/useSessionCheck";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";

interface Props {
    params: { id: string }
}

export const PATCH = async (request: NextRequest, { params }: Props) => {
    const session = await useSessionCheck()
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const body = await request.json()
    const validation = userSchema.safeParse(body)
    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: parseInt(params.id) } })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (body?.password && body.password != "") {
        const hashPassword = await bcrypt.hash(body.password, 10)
        body.password = hashPassword
    }else{
        delete body.password
    }
    if (user.userName !== body.userName) {
        const checkUserName = await prisma.user.findUnique({ where: { userName: body.userName } })
        if (checkUserName) {
            return NextResponse.json({ error: "UserName already exists" }, { status: 409 })
        }
    }
    const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            ...body
        }
    })
    return NextResponse.json(updateUser)
}

export const DELETE = async (request: NextRequest, { params }: Props) => {
    const session = await getServerSession(options)
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const userId = parseInt(params.id)
    if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid UserId" }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 })
    }
    if (session.user.id == user.id) {
        return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
    }

    //if one of the action failed,none of the changes will be applied
    const deleteresult = await prisma.$transaction(async (prisma) => {
        const deleteresult = await prisma.user.update({
            where: { id: user.id }, data: {
                isDeleted: true
            }
        })
        await prisma.ticket.updateMany({
            where: {
                assignedToUserId: user.id
            },
            data: {
                assignedToUserId: null
            }
        })
        return deleteresult
    }).catch(error => {
        return NextResponse.json({ error }, { status: 500 })
    })
    if (deleteresult) {
        return NextResponse.json({ message: "User deleted", data: deleteresult })
    } else {
        return NextResponse.json({ error: "Delete user failed" }, { status: 404 })
    }
}