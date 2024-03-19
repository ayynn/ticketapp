"use client"
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from './ui/input'

interface Props {
    itemCount: number
    pageSize: number
    currentPage: number
}

function PaginationC({ itemCount, pageSize, currentPage }: Props) {
    const pageCount = Math.ceil(itemCount / pageSize)
    const router = useRouter()
    const searchParams = useSearchParams()

    function changePage(pageNum: number) {
        console.log('change page', pageNum)
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNum.toString())
        return router.push("?" + params.toString())
    }
    function selectValueChange(pageSize: string) {
        const params = new URLSearchParams(searchParams)
        params.set('pageSize', pageSize)
        params.set('page', '1')
        router.push("?" + params.toString())
    }
    const pageSizes = Array.from(new Set([5, 10, 15, 20, 50, 100, pageSize].sort((a, b) => a - b)))
    const distanceFromEnd = pageCount - currentPage
    const distanceFromStart = 3 - currentPage
    let paginationRange = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
    if (distanceFromStart > 0) {
        paginationRange = paginationRange.map(item => item + distanceFromStart)
    }
    if (distanceFromEnd <= 2) {
        paginationRange = paginationRange.map(item => item + distanceFromEnd - 2)
    }
    function inputBlur(e: React.FocusEvent<HTMLInputElement>) {
        const value = +e.target.value
        if (value <= 1) {
            e.target.value = '1'
        } else if (value >= pageCount) {
            e.target.value = pageCount.toString()
        }
        let targetValue = parseInt(e.target.value)
        if (targetValue !== currentPage) {
            changePage(targetValue)
        }
    }
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => changePage(currentPage - 1)} disabled={currentPage == 1} />
                </PaginationItem>
                {
                    paginationRange.map((_, i) => (
                        _ >= 1 && _ <= pageCount &&
                        <PaginationItem key={i}>
                            <PaginationLink onClick={() => changePage(_)} isActive={currentPage == _}>{_}</PaginationLink>
                        </PaginationItem>
                    ))
                }
                <PaginationItem>
                    <PaginationNext onClick={() => changePage(currentPage + 1)} disabled={currentPage == pageCount} />
                </PaginationItem>
            </PaginationContent>
            <Input min={1} max={pageCount} step={1} type="number" onBlur={inputBlur} className='w-[80px] mr-4 no-input-number-spin' placeholder='to page'></Input>
            <Select defaultValue={pageSize.toString() || '10'} onValueChange={selectValueChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {pageSizes.map((_, i) => (
                            <SelectItem key={i} value={_.toString()}>{_}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Pagination>
    )
}

export default PaginationC