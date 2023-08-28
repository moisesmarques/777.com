import { toast } from "react-toastify";
import { api } from "../services/userService";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { UserState } from "../App";

const ApiInterceptor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userState = JSON.parse(localStorage.getItem('current_user') || '{}') as UserState;
        const token = userState?.token;

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
      return Promise.reject(e);
    })

  api.interceptors.response.use(
    r => {
      setIsLoading(false)
      return r;
    }
    , e => {
      setIsLoading(false)        
      return Promise.reject(e);
    })

    return (
      <Loading isLoading={isLoading}/>
    )
}

export default ApiInterceptor;
  