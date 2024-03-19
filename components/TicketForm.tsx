"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { z } from 'zod'
import { ticketSchema } from '@/ValidationSchemas/ticket'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from './ui/input'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import axios from '@/lib/request'
import { useRouter } from 'next/navigation'
import { Ticket } from '@prisma/client'
import { useToast } from './ui/use-toast'

type TicketFormData = z.infer<typeof ticketSchema>

interface Props {
    ticket?: Ticket
}

const TicketForm = ({ ticket }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            ...ticket,
            title: ticket?.title || "",
            description: ticket?.description || ""
        }
    })
    async function onSubmit(values: TicketFormData) {
        try {
            setIsSubmitting(true)
            setError("")
            const { data, success } = await axios({
                url: `/api/tickets${ticket ? `/${ticket.id}` : ''}`,
                method: ticket ? "PATCH" : "POST",
                data: values,
            })
            console.log('resss', data, success)
            setIsSubmitting(false)
            if (success) {
                toast({
                    title: (ticket ? "Edit" : "Create") + "Ticket Success",
                    duration: 2000
                })
            }
            router.push("/tickets")
            router.refresh()
        } catch (error) {
            setError("An unexpected error occurred")
            setIsSubmitting(false)
        }
    }
    return (
        <div className='rounded-medium border w-full p-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem>
                        <FormLabel>Ticket Title</FormLabel>
                        <FormControl>
                            <Input placeholder='Ticket Title...' {...field}></Input>
                        </FormControl>
                    </FormItem>)} />
                    <Controller name="description" control={form.control} render={({ field }) => (
                        <SimpleMDE placeholder='Description' {...field}></SimpleMDE>
                    )}></Controller>
                    <div className='flex w-full space-x-4'>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status..."></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='OPEN'>Open</SelectItem>
                                        <SelectItem value='STARTED'>Started</SelectItem>
                                        <SelectItem value='CLOSED'>Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="priority" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority..."></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='LOW'>Low</SelectItem>
                                        <SelectItem value='MEDIUM'>Medium</SelectItem>
                                        <SelectItem value='HIGH'>High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>
                    <footer className='flex justify-between'>
                        <Button type="submit" disabled={isSubmitting}>{ticket ? 'Edit Ticket' : 'Create Ticket'}</Button>
                        <Button type="button" onClick={() => {
                            router.back()
                        }}>Back</Button>
                    </footer>
                </form>
            </Form>
        </div>
    )
}

export default TicketForm