"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Role } from '@prisma/client'
import { firstLetterUppercase } from '@/lib/utils'
import { SelectIcon } from '@radix-ui/react-select'

const roles = Object.keys(Role)

const SearchUser = () => {
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState('')
    const [selectValue, setSelectValue] = useState(searchParams.get('role') || '')
    const router = useRouter()
    function searchHandler() {
        const params = new URLSearchParams(searchParams)
        params.set('userName', searchValue)
        router.push('?' + params.toString())
    }
    function inputChangeHandler(e: FormEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement
        setSearchValue(target.value)
    }
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'Enter') searchHandler()
    }
    function triggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        if (e.key == 'Backspace') {
            selectValueChange('')
        }
    }
    function selectValueChange(value: string) {
        setSelectValue(value)
        const params = new URLSearchParams(searchParams)
        params.set('role', value)
        router.push('?' + params.toString())
    }
    return (
        <div className='flex items-center space-x-4'>
            <Select value={selectValue} defaultValue={selectValue} onValueChange={selectValueChange}>
                <SelectTrigger className="w-[180px]" onKeyDown={triggerKeyDown}>
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    {
                        roles.map((role) => (<SelectItem key={role} value={role}>{firstLetterUppercase(role)}</SelectItem>))
                    }
                </SelectContent>
            </Select>
            <div className='flex items-center border rounded-md'>
                <Input className='border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0' value={searchValue} onKeyDown={handleKeyDown} onInput={inputChangeHandler} placeholder='UserName ...' />
                <Button size="icon" variant="ghost" className='ml-2' onClick={searchHandler} >
                    <Search />
                </Button>
            </div>
        </div>
    )
}

export default SearchUser