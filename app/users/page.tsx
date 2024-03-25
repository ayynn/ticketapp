import React from 'react'
import DataTable from './_components/DataTable'
import prisma from '@/prisma/db'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Pagination from '@/components/Pagination'
import SearchUser from './_components/SearchUser'
import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import options from '../api/auth/[...nextauth]/options'

interface Props {
  searchParams: {
    pageSize?: string,
    page?: string,
    userName?: string
    role?: Role
  }
}

const Users = async ({ searchParams }: Props) => {

  // const session = await getServerSession(options)
  // if (session?.user.role != Role.ADMIN) {
  //   return <div className='text-destructive'>You are not authorized to view this page</div>
  // }

  const { pageSize: ps, page: cp, userName, role } = searchParams
  const pageSize = parseInt(ps || '10')
  const currentPage = parseInt(cp || '1')
  const where = {
    OR: [
      {
        userName: {
          contains: userName || ''
        },
      },
      {
        name: {
          contains: userName || ''
        },
      }
    ],
    isDeleted: false,
    role: role || undefined
  }

  const users = await prisma.user.findMany({
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    where
  })
  const userCount = await prisma.user.count({
    where
  })
  return (
    <div className='flex flex-col h-full px-5'>
      <div className='flex justify-between items-center'>
        <Link href='/users/new' className={buttonVariants({
          variant: 'default'
        })}>New User</Link>
        <SearchUser />
      </div>
      <DataTable className='flex-1 h-0' users={users}></DataTable>
      <Pagination className='mb-5' itemCount={userCount} pageSize={pageSize} currentPage={currentPage} />
    </div>
  )
}

export default Users