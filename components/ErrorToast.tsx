import { useEffect } from 'react'
import { useToast } from './ui/use-toast'

interface Props {
    message: string
    title: string
}

const ErrorToast = ({ message, title }: Props) => {
    const { toast } = useToast()
    useEffect(() => {
        toast({
            title,
            description: message,
            variant: 'destructive',
        })
    }, [])
    return (
        <div></div>
    )
}

export default ErrorToast