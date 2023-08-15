import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });


export type SigninRequest = {
    phone: string;    
}

export type SigninVerifyRequest = {
    phone: string;
    code: string;
}

export type SigninVerifyResponse = {
    token: string;
    expiresAt: string;
}

export const signin = (request: SigninRequest): Promise<any> => {
    
  return new Promise((resolve, reject) => {
    setTimeout(() => {}, 300);
    resolve(true)
  })
  //return api.post(`user/signin/`, request).then((res) => res.data);
}

export const signinVerify = (request: SigninVerifyRequest): Promise<SigninVerifyResponse> => {
    
  return new Promise((resolve, reject) => {
    setTimeout(() => {}, 300);
    resolve({
      token: 'abc',
      expiresAt: ''
    })
  })
  //return api.post(`user/signin-verify/`, request).then((res) => res.data);
}
