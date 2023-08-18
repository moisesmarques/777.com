import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { signin } from "../../services/userService";
import { Box, Button, Container, TextField } from "@mui/material";
import { UserContext, UserState } from "../../App";

const logo = require('../../assets/logo.png')
const countryCode = '+55'

export type LoginTypeForm = {
  phone: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {userState, setUserState} = useContext(UserContext);
  
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<LoginTypeForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const { mutate } = useMutation({
    mutationFn: (values: LoginTypeForm) => {

      let phone = countryCode + values.phone.replace(/\D/g, '')

      setUserState({phone} as UserState);

      return signin({phone})
    },
    onSuccess: (data) => {
      navigate('/verify-account');
    }
  })

  const phoneMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }
      
  const phoneNumber = watch('phone');
  useEffect(() => {
    if (phoneNumber) {
      setValue('phone', phoneMask(phoneNumber));
    }
  }, [phoneNumber])

    return (
      <Container sx={{width: '400px', mt: 10}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', mb: 2}}>
            <img src={logo} alt="Logo" />
          </Box>          
          <h4>Log in</h4>
          <form onSubmit={handleSubmit( data => mutate(data))}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <TextField
                      variant="outlined"
                      label="Celular"
                      id="phone"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      placeholder="(99) 99999-9999"
                      {...register('phone', {
                        required: 'Digite seu número de celular',
                      })}
                    />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
                <Button sx={{ width: '100%'}} variant="contained" type="submit">Entrar</Button>
              </Box>
          </form>
        </Box>
      </Container>
    );
  };

export default Login;
