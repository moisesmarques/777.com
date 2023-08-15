import React, { useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { signin, signinVerify } from '../../../services/userService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../App';
import { Box, Button, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import logo from '../../../assets/logo.png';

type VerifyForm = {
  code: string;
}

const VerifyAccount = () => {  
  const userState = useContext(UserContext);
  const navigate = useNavigate();
  
  const { mutate: verifyAccount } = useMutation({
    mutationFn: (values: VerifyForm) => signinVerify({
      phone: userState.phone,
      code: values.code
    }),
    onSuccess: (data) => {
      userState.set({ token: data.token } as any)
      navigate('/')
    }
  })

  const { mutate: sendOtp } = useMutation({
    mutationFn: (values) => {
      return signin({ phone: userState.phone})
    },
    onSuccess: (data) => {
      userState.set({ token: data.token } as any)
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

  const otpValue = watch('code');

  useEffect(() => {
    // setValue("otp", masks.otp(otpValue || ''))
  }, [otpValue]);

  return (
    <Container sx={{width: '400px', mt: 10}}>
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', mb: 2}}>
            {/* <img src={logo} alt="Logo" /> */}
          </Box>         
          <h4>Verify your account</h4>
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
    </Container>
)}

export default VerifyAccount;
