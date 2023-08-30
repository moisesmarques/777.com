import React, { useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { signin, signinVerify } from '../../services/userService';
import { toast } from 'react-toastify';
import { UserContext, UserState } from '../../App';
import { Box, Button, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const logo = require('../../assets/logo512.png')

type VerifyForm = {
  code: string;
}

const VerifyAccount = () => {  
  const userState = useContext(UserContext);
  const navigate = useNavigate();
  
  const { mutate: verifyAccount } = useMutation({
    mutationFn: (values: VerifyForm) => signinVerify({
      phone: userState.phone,
      otp: values.code
    }),
    onSuccess: (data) => {
      userState.set({ 
        token: data.accessToken,
        username: data.username,
      } as UserState)
      window.location.replace('/')
    }
  })

  const { mutate: sendOtp } = useMutation({
    mutationFn: (values) => {
      return signin({ phone: userState.phone})
    },
    onSuccess: (data) => {
      toast.info('Código reenviado com sucesso')
    }
  })

  const { 
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch } = useForm<VerifyForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', width: '360px', height: '100%'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', mb: 2, mt: 4}}>
          <img src={logo} alt="Logo" />
        </Box>         
        <h4>Verificar conta</h4>
        <form onSubmit={handleSubmit(data => verifyAccount(data))}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <TextField
                label="Código de verificação"
                maxLength={6}
                placeholder="******"
                variant="outlined"
                error={!!errors.code}
                {...register('code', { 
                  required: 'Digite o código recebido por SMS',
                })}
              />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
            <Button sx={{ width: '100%'}} variant="contained" type="submit">Verificar</Button>
        </Box>            
        </form>
        <Box sx={{display: 'flex', flexDirection: 'column', mt: 3}}>
          <p style={{textAlign: 'center'}}>Ainda não recebeu o código?</p>
          <Button onClick={() => sendOtp()} type="button">
            Reenviar o código
          </Button>
        </Box>
      </Box>
)}

export default VerifyAccount;
