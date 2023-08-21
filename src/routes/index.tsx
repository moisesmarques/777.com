import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import VerifyAccount from '../pages/VerifyAccount';
import NotFound from '../pages/NotFound';

type Props = {
  pass: boolean;  
  children: React.ReactElement;
};

const Private = ({ pass, children }: Props) => {
  if (!pass) {
    return <Navigate to="/login" />;
  }
  return children;
};

const Public = ({ pass, children }: Props) => {
  if (!pass) {
    return <Navigate to="/" />;
  }
  return children;
};

export const Routes = () => {
  
  const userState = localStorage.getItem('current_user')
  const token = userState ? JSON.parse(userState).token : ''
  const isAuthenticated = token !== ''

  return (
    <ReactRoutes>
      <Route path="/" element={<Private pass={isAuthenticated} ><Home/></Private>} />
      <Route path="login" element={<Public pass={!isAuthenticated} ><Login/></Public>} />
      <Route path="/verify-account" element={<Public pass={!isAuthenticated} ><VerifyAccount/></Public>} />
      <Route path="*" element={<NotFound/>} />
    </ReactRoutes>
  )}
