import { toast } from "react-toastify";
import { api } from "../services/userService";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";

const ApiInterceptor = ({token}: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    api.interceptors.request.clear()
  
    api.interceptors.request.use(
      r => {
        r.headers.Authorization = `Bearer ${token}`;
        setIsLoading(true)
        return r;
      }
      , e => {
        setIsLoading(false)
        toast.error(e.response?.data?.code || 'Ops...')
        return Promise.reject(null);
      })
  
    api.interceptors.response.use(
      r => {
        setIsLoading(false)      
        return r;
      }
      , e => {
        setIsLoading(false)
        if(e.response?.status === 401){
          window.location.reload()
        }
  
        if(e.response?.status === 400){
          toast.error(e.response?.data?.code || 'Ops...')
          return Promise.reject(null);
        }
  
        toast.error(e.response?.data?.code || 'Ops...')
      })
    }, [token, setIsLoading])

    return (
      <Loading isLoading={isLoading}/>
    )
}

export default ApiInterceptor;
  