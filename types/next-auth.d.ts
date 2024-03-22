import NextAuth, { DefaultSession } from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            userName: string
            role: string
            id: number
        } & DefaultSession["user"]
    }
    interface User {
        id: number
        name: string
        userName: String
        role: Role
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
}