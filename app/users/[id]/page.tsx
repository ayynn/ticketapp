import UserForm from '@/components/UserForm'
import prisma from '@/prisma/db'
import React from 'react'
interface Props {
    params: {
        id:string
    }
}

const EditUser = async ({ params }: Props) => {
    const notfound = <div>
        <h1 className='text-destructive'>User not Found</h1>
    </div>
    if (isNaN(parseInt(params.id))) return notfound
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(params.id)
        },
        select: {
            id: true,
            name: true,
            userName: true,
            role: true
        }
    })
    if (!user) return notfound
    return (
        <UserForm user={user} />
    )
}

export async function generateStaticParams() {
    const users=(await prisma.user.findMany({
        where:{
            NOT:{
                isDeleted:true
            }
        }
    })).filter(user=>user.id<=10)
    return users.map(user=>({id:user.id.toString()}))
}

export default EditUser