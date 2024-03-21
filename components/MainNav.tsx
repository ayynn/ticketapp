'use client'
import Link from 'next/link';
import React from 'react';
import ToggleMode from './ToggleMode';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MainNav = () => {
  const route = usePathname()
  const routeCN = (path: string) => {
    const condition = route.split('/').filter(Boolean)
    if (condition.length == 0 && path == '') return cn('hover:text-primary', 'text-primary')
    return cn('hover:text-primary', condition.includes(path) ? 'text-primary' : '')
  }
  return (
    <div className='flex justify-between'>
      <div className='gap-2 flex items-center'>
        <Link className={routeCN('')} href='/'>Dashboard</Link>
        <Link className={routeCN('tickets')} href='/tickets'>Tickets</Link>
        <Link className={routeCN('users')} href='/users'>Users</Link>
      </div>
      <div className='flex items-center gap-2'>
        <Link className={routeCN('logout')} href='/'>Logout</Link>
        <ToggleMode />
      </div>
    </div>
  );
};

export default MainNav;
