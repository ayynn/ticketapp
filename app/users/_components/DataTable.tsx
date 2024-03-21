"use client"
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@prisma/client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
    users: User[]
    className?: string
}

const DataTable = ({ users, className }: Props) => {
    return (
        <div className={cn('pt-5 h-full', className)}>
            <div className='rounded-md sm:border h-full'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='font-medium'>Name</TableHead>
                            <TableHead className='font-medium'>UserName</TableHead>
                            <TableHead className='font-medium'>CurrentRole</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            users && users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Link className='hover:underline' href={`/users/${user.id}`}>
                                            {user.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {user.userName}
                                    </TableCell>
                                    <TableCell>
                                        {user.role}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataTable