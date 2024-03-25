import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@prisma/client'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    if (!token || token.role !== Role.ADMIN) {
        const url = new URL('/unAuthorized', request.url)
        return NextResponse.redirect(url)
    }
    return res
}

export const config = {
    matcher: [
        {
            source: '/users/:path*'
        }
    ],
}