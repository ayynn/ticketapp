import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
    timeout: 5000
})

instance.interceptors.request.use(config => {
    return config
})

instance.interceptors.response.use(response => {
    console.log('response', response)
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


const requestInstance = <T = any>(config: AxiosRequestConfig) => {
    return instance<T, { data: T, success: boolean }, any>(config).then(res => {
        return res.data
    }).catch(err => {
        return {
            success: false,
            data: null,
            msg: err
        }
    })
}

export default requestInstance