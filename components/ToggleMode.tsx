"use client"
import { useState, useEffect, createElement } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'


function ToggleMode() {
    const { theme, setTheme } = useTheme()
    const dark = theme === "dark"
    return (
        <Button className='hover:text-primary' variant="outline" size="icon" onClick={() => setTheme(`${dark ? 'light' : 'dark'}`)}>{createElement(dark ? Sun : Moon)}</Button>
    )
}

export default ToggleMode 