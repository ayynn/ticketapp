"use client"
import { cn } from '@/lib/utils'
import { Role } from '@prisma/client'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import React from 'react'

interface Props {
    role?: Role
}

const MainNavLinks = ({ role }: Props) => {
    const showUsers = role === 'ADMIN' || role === 'TECH'
    const route = usePathname()
    const routeCN = (path: string) => {
        const condition = route.split('/').filter(Boolean)
        if (condition.length == 0 && path == '') return cn('hover:text-primary', 'text-primary')
        return cn('hover:text-primary', condition.includes(path) ? 'text-primary' : '')
    }
    return (
        <div className='gap-2 flex items-center'>
            <Link className={routeCN('')} href='/'>Dashboard</Link>
            <Link className={routeCN('tickets')} href='/tickets'>Tickets</Link>
            {showUsers && <Link className={routeCN('users')} href='/users'>Users</Link>}
        </div>
    )
}

export default MainNavLinks