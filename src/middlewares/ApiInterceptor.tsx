import { toast } from "react-toastify";
import { api } from "../services/userService";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";

const ApiInterceptor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userState = localStorage.getItem('current_user')
  const token = userState ? JSON.parse(userState).token : ''

  useEffect(() => {
    api.interceptors.request.clear()
    api.interceptors.response.clear()
  
    api.interceptors.request.use(
      r => {
        r.headers.Authorization = `Bearer ${token}`;
        setIsLoading(true)
        return r;
      }
      , e => {
        setIsLoading(false)
        toast.error(e.response?.data?.code || 'Ops...')
        return Promise.reject({});
      })
  
    api.interceptors.response.use(
      r => {
        setIsLoading(false)      
        return r;
      }
      , e => {
        setIsLoading(false)        
        toast.error(e.response?.data?.code || 'Ops...')
        return Promise.reject({});
      })
    }, [userState])

    return (
      <Loading isLoading={isLoading}/>
    )
}

export default ApiInterceptor;
  