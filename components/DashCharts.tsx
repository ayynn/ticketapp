'use client'
import { Status } from '@prisma/client'
import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DataElements {
    name: Status,
    total: number
}

interface Props {
    data: DataElements[]
}

const DashCharts = ({ data }: Props) => {
    return (
        <Card className='col-span-4 h-full'>
            <CardHeader>
                <CardTitle>Charts</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
                <ResponsiveContainer width={'100%'} height={350}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey='total' fill="#60a5fa" radius={[4, 4, 0, 0]}></Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default DashCharts