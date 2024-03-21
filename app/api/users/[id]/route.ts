import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: Props) {
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
    }
    delete body.password
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

export async function DELETE(request: NextRequest, { params }: Props) {
    const user = await prisma.user.findUnique({ where: { id: parseInt(params.id) } })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const deleteresult = await prisma.user.update({
        where: { id: user.id }, data: {
            isDeleted: true
        }
    })
    console.log(deleteresult)
    if (deleteresult) {
        return NextResponse.json({ message: "User deleted", data: deleteresult })
    } else {
        return NextResponse.json({ error: "Delete user failed" }, { status: 404 })
    }
}