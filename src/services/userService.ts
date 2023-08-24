import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


export type SigninRequest = {
  phone: string;    
}

export type SigninVerifyRequest = {
  phone: string;
  otp: string;
}

export type SigninVerifyResponse = {
  accessToken: string;
  username: string;
  credits: number;  
  bet: number;
  win: number;
}

export const signin = (request: SigninRequest): Promise<any> => {
  return api.post(`/signin`, request).then((res) => res.data);
}

export const signinVerify = (request: SigninVerifyRequest): Promise<SigninVerifyResponse> => {
  return api.post(`/verify`, request).then((res) => res.data);  
}
