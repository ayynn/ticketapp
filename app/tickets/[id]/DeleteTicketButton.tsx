"use client"
import React, { useReducer, useState } from 'react'
import { Button, buttonVariants } from '../../../components/ui/button'
import axios from '@/lib/request'
import { useToast } from '../../../components/ui/use-toast'
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface Props {
    id: number
}

const DeleteTicketButton = ({ id }: Props) => {
    const { toast } = useToast()
    const router = useRouter()
    const [sending, setSending] = useState(false)
    async function deletehandler() {
        setSending(true)
        const { data, success } = await axios({
            url: `/api/tickets/${id}`,
            method: "DELETE"
        })
        setSending(false)
        if (success) {
            toast({
                title: "Ticket Deleted",
                description: `You successfully deleted ${data.data.title}`,
                duration: 2000,
            })
        } else {
            toast({
                title: "Please try again later",
                description: `Delete ticket failed`,
                type: "background",
                duration: 2000,
                variant: "destructive"
            })
        }
        router.push('/tickets')
        router.refresh()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={sending} variant="destructive">Delete Ticket</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your <span className='font-bold'>Ticket&nbsp;</span>
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={() => deletehandler()}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTicketButton