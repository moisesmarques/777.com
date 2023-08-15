import React, { createContext, useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { api } from './services/userService';
import Settings from './components/Settings';
import Loading from './components/Loading';
import { Routes } from './routes';
import GlobalStyle from './Themes/GlobalStyle';
import Dark from './Themes/Dark';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

export type UserState = {
  phone: string;
  token: string;
  isLoading: boolean;
  showSettings: boolean;
  set: (user: UserState) => void;
}

const localStorageUser = localStorage.getItem('current_user')
const initialUserState = (localStorageUser ? 
  JSON.parse(localStorageUser) : 
  { 
    phone: "",
    token: "",
    isLoading: false,
    showSettings:false,
    set: (user: UserState) => {}
  }) as UserState;

export const UserContext = createContext<UserState>(initialUserState);

const App: React.FC = () => {

  const [userState, setUserState] = useState<UserState>({
    ...initialUserState,
    set: ( props: UserState) => {
      const us = {...userState, ...props}
      setUserState(us)
      localStorage.setItem('current_user', JSON.stringify(us))
    },
  });  

  api.interceptors.request.clear()

  const tokenInterceptor = async (config: any) => {
    if (userState.token) {
      config.headers.Authorization = `Bearer ${userState.token}`;
    }else{
      delete config.headers.Authorization;
    }
    return config;
  }

  api.interceptors.request.use(tokenInterceptor)

  api.interceptors.request.use(
    r => {
      userState.set({isLoading: true} as UserState)
      return r;
    }
    , e => {
      userState.set({isLoading: false} as UserState)
      toast.error(e.response?.data?.code || 'Ops...')
      return Promise.reject(null);
    })

  api.interceptors.response.use(
    r => {
      userState.set({isLoading: false} as UserState)
      return r;
    }
    , e => {
      userState.set({isLoading: false} as UserState)

      if(e.response?.status === 401){
        window.location.reload()
      }

      if(e.response?.status === 400){
        toast.error(e.response?.data?.code || 'Ops...')
        return Promise.reject(null);
      }

      toast.error(e.response?.data?.code || 'Ops...')
    })

  return (
    <UserContext.Provider value={userState}>
        <ThemeProvider theme={ Dark }>
            <QueryClientProvider client={queryClient}>
              <CssBaseline />
              <BrowserRouter>
                <Box sx={{ display: 'flex',
                  flexDirection: 'row',
                  minHeight: '100vh',
                  width: 'inherit',
                  justifyContent: 'center',
                  }}>
                  <Settings showSettings={userState.showSettings}/>
                  <Box id="main"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      minHeight: '100vh',
                      width: 'inherit',
                      maxWidth: '500px',
                    }}>
                      <Routes isAuthenticated={!!userState.token}/>
                  </Box>
                </Box>
                <GlobalStyle />                
              </BrowserRouter>
            </QueryClientProvider>
          <Loading isLoading={userState.isLoading}/>
          <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              theme={ 'light' }
              />
        </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
