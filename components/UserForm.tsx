"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import axios from '@/lib/request'
import { useRouter } from 'next/navigation'
import { Role, User } from '@prisma/client'
import { useToast } from './ui/use-toast'
import { userSchema } from '@/ValidationSchemas/users'
import { firstLetterUppercase } from '@/lib/utils'

type UserFormData = z.infer<typeof userSchema>


interface Props {
    user?: Omit<User, 'password'|'isDeleted'>
}

const roles = Object.keys(Role)

const UserForm = ({ user }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            userName: "",
            password: "",
            ...user,
        }
    })
    async function onSubmit(values: UserFormData) {
        try {
            setIsSubmitting(true)
            const { success, msg } = await axios({
                url: `/api/users${user ? `/${user.id}` : ''}`,
                method: user ? "PATCH" : "POST",
                data: values,
            })
            setIsSubmitting(false)
            toast({
                title: msg || ((user ? "Update" : "Create") + ` User ${success ? "Success" : "Failed"}`),
                duration: 2000,
                variant: success ? "default" : "destructive",
            })
            router.push("/users")
            router.refresh()
        } catch (error) {
            setIsSubmitting(false)
        }
    }
    return (
        <div className='rounded-medium border w-full p-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter User's Full Name" {...field}></Input>
                        </FormControl>
                    </FormItem>)} />
                    <FormField control={form.control} name="userName" render={({ field }) => (<FormItem>
                        <FormLabel>UserName</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter a UserName' {...field}></Input>
                        </FormControl>
                    </FormItem>)} />
                    <FormField control={form.control} name="password" render={({ field }) => (<FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" required={user ? false : true} placeholder='Enter Password' {...field}></Input>
                        </FormControl>
                    </FormItem>)} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Role..."></SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map(role => (<SelectItem key={role} value={role}>{firstLetterUppercase(role)}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <footer className='flex justify-between'>
                        <Button type="submit" disabled={isSubmitting}>{user ? 'Update User' : 'Create User'}</Button>
                        <Button type="button" onClick={() => {
                            router.back()
                        }}>Back</Button>
                    </footer>
                </form>
            </Form>
        </div>
    )
}

export default UserForm