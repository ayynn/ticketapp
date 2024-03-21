import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const body = await request.json()
    console.log(body)
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