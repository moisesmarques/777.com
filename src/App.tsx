import React, { createContext, useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Settings from './components/Settings';
import { Routes } from './routes';
import GlobalStyle from './Themes/GlobalStyle';
import Dark from './Themes/Dark';
import 'react-toastify/dist/ReactToastify.css';
import ApiInterceptor from './middlewares/ApiInterceptor';

const queryClient = new QueryClient()

export type UserState = {
  username: string;
  phone: string;  
  token: string;
  showSettings: boolean;
  set: (props: UserState) => void;
}

const localStorageUser = localStorage.getItem('current_user')
const initialUserState = (localStorageUser ? 
  JSON.parse(localStorageUser) : 
  { 
    phone: "",    
    username: "",
    showSettings:false,
    token: "",
    set: (props: UserState) => {}
  }) as UserState;

export const UserContext = createContext<UserState>(initialUserState);

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>({
    ...initialUserState,
    set: ( props: UserState) => {
      const us = {...userState, ...props}
      setUserState(us)
      localStorage.setItem('current_user', JSON.stringify(us))
    }
  });

  return (
    <UserContext.Provider value={userState}>
        <ThemeProvider theme={ Dark }>
            <QueryClientProvider client={queryClient}>
              <ApiInterceptor/>
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
                      maxWidth: '600px',
                    }}>
                      <Routes />
                  </Box>
                </Box>
                <GlobalStyle />                
              </BrowserRouter>
            </QueryClientProvider>
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
