import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Root, createRoot } from 'react-dom/client'
import ErrorToast from '@/components/ErrorToast'
import { createElement } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const instance = axios.create({
    timeout: 5000
})

instance.interceptors.request.use(config => {
    return config
})

instance.interceptors.response.use(response => {
    const returnObj = {
        data: response.data,
        success: false,
        msg: ''
    }
    if (response.status >= 200 && response.status < 300) {
        returnObj.success = true
    } else {
        returnObj.success = false
    }
    response.data = returnObj
    return response
}, error => {
    return Promise.reject(error)
})

let root: Root | undefined

const requestInstance = <T = any>(config: AxiosRequestConfig) => {
    return instance<T, AxiosResponse<{ data: T, success: boolean, msg: string }>, any>(config).then(res => {
        return res.data
    }).catch(err => {
        const msg = err.response.data.message || err.response.data.error || err.message
        function renderToast() {
            root!.render(createElement(ErrorToast, { key: Date.now(), message: msg, title: 'Request Error' }))
        }
        if (!root) {
            const axiosErrorToastContainer = document.createElement('div')
            axiosErrorToastContainer.style.display = 'none'
            document.body.appendChild(axiosErrorToastContainer)
            root = createRoot(axiosErrorToastContainer)
            renderToast()
        } else {
            renderToast()
        }
        if (err.response.status == 401) {
            setTimeout(() => {
                window.location.replace('/api/auth/signin')
            }, 2000);
        }

        return {
            success: false,
            data: null,
            msg
        }
    })
}

export default requestInstance