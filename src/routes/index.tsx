import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import VerifyAccount from '../pages/Login/VerifyAccount';
import NotFound from '../pages/NotFound';

type Props = {
  isAuthenticated: boolean;
}

export const Routes: React.FC<Props> = ({ isAuthenticated }) => {
  
  return isAuthenticated ?
      <PrivateRoutes/> : <PublicRoutes/>
}

const PublicRoutes = () => (
  <ReactRoutes>
    <Route path="/verify-account" element={<VerifyAccount/>} />
    <Route path="*" element={<Login/>} />
  </ReactRoutes>
);

const PrivateRoutes = () => (
  <ReactRoutes>
    <Route path="/" element={<Home/>} />
    <Route path="*" element={<NotFound/>} />
  </ReactRoutes>
);
