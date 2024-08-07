import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { signin, signinVerify } from '../../services/userService';
import { toast } from 'react-toastify';
import { UserContext, UserState } from '../../App';
import { Box, Button, TextField } from '@mui/material';

type VerifyForm = {
  code: string;
}

const VerifyAccount = () => {
  const userState = useContext(UserContext);
  
  const verify = (values: VerifyForm) => signinVerify({
      phone: userState.phone,
      code: values.code
    }).then((data) => {
      userState.set({ 
        token: data.accessToken,
        username: data.username,
        referrer: data.referrer,
        key: data.key
      } as UserState)
      window.location.replace('/')
  }).catch((error) => {
    let message = error.response?.data?.code
    if (message === 'INVALID_OTP')
      toast.error('Invalid code')
    else
      toast.error(error.response?.data?.code || 'Ops...')
  })

  const sendOtp = () => signin({ phone: userState.phone}).then(() => {
    toast.info('Code sent')
  }).catch((error) => {
    toast.error(error.response?.data?.code || 'Ops...')
  })

  const { 
    register,
    handleSubmit,
    formState: { errors }} = useForm<VerifyForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', width: '360px', height: '100%'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', mb: 2, mt: 6, alignItems: 'center'}}>
          <img src="/assets/logo-360.png" alt="Logo" width="360" height="360"/>
        </Box>
        <Box sx={{pl: 4, pr: 4}}>
          <h4>Verify account</h4>
          <form onSubmit={handleSubmit(data => verify(data))}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <TextField
                  label="Verification code"
                  maxLength={6}
                  placeholder="******"
                  variant="outlined"
                  error={!!errors.code}
                  {...register('code', { 
                    required: "The code is required",
                  })}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
              <Button sx={{ width: '100%'}} variant="contained" type="submit">Verify</Button>
          </Box>            
          </form>
          <Box sx={{display: 'flex', flexDirection: 'column', mt: 3}}>
            <p style={{textAlign: 'center'}}>Didn't receive the code?</p>
            <Button onClick={() => sendOtp()} type="button">
              Send again
            </Button>
          </Box>
        </Box>
      </Box>
)}

export default VerifyAccount;
