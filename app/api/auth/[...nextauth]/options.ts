import prisma from "@/prisma/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'

const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'password',
            name: 'Username and Password',
            credentials: {
                userName: { label: 'Username', type: 'text', placeholder: 'Username...' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: {
                        userName: credentials!.userName
                    }
                })
                if (!user || user.isDeleted) return null
                const match = await bcrypt.compare(credentials!.password, user.password)
                if (match) return user
                return null
            },

        })
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = token.role || 'USER'
                session.user.id = token.id
            }
            return session
        }
    }
}

export default options