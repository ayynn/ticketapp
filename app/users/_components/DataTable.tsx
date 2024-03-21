"use client"
import React, { useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@prisma/client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from '@/components/ui/button'
import request from '@/lib/request'
import { useToast } from '@/components/ui/use-toast'


interface Props {
    users: User[]
    className?: string
}

const DataTable = ({ users, className }: Props) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const operatingUser = useRef<User>()
    const { toast } = useToast()

    function dropdownMenuSelect(user: User, action: 'Edit' | 'Delete') {
        if (action == 'Edit') {
            router.push(`/users/${user.id}`)
        } else {
            operatingUser.current = user
            setOpen(true)
        }
    }
    async function handleDeleteAction() {
        const user = operatingUser.current
        if (!user) return
        const { data, success } = await request({
            url: `/api/users/${user.id}`,
            method: "DELETE"
        })
        toast({
            title: `Delete User ${success ? 'Success' : 'Failed'}`,
            variant: success ? 'default' : 'destructive',
            duration: 2000
        })
        router.refresh()
    }

    return (
        <div className={cn('pt-5 h-full', className)}>
            <div className='rounded-md sm:border h-full'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='font-medium'>Name</TableHead>
                            <TableHead className='font-medium'>UserName</TableHead>
                            <TableHead className='font-medium'>CurrentRole</TableHead>
                            <TableHead className='font-medium text-center'>Operation</TableHead>
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
                                    <TableCell className='text-center'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>...</DropdownMenuTrigger>
                                            <DropdownMenuContent className='min-w-8'>
                                                <DropdownMenuItem className='justify-center' textValue='Edit' onSelect={() => dropdownMenuSelect(user, 'Edit')} >Edit</DropdownMenuItem>
                                                <DropdownMenuItem className='justify-center' textValue='Delete' onSelect={() => dropdownMenuSelect(user, 'Delete')} >Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your <span className='font-bold'>User&nbsp;</span>
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAction} className={buttonVariants({ variant: 'destructive' })}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default DataTable