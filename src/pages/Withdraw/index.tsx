import { Box, 
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    MenuItem,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/userService';
import { toast } from 'react-toastify';
import StarIcon from '@mui/icons-material/StarBorder';

const formatMoney = (number: number) => `${new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number*.01)}`;

const formatTimeStampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const formatted_date_time = date.toLocaleString();
    return formatted_date_time;
}

const Withdraw = () => {
    const navigate = useNavigate()

    type WithdrawForm = {
        pixKey: string;
        fullName: string;
        amount: number;
    }

    const { 
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch } = useForm<WithdrawForm>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        defaultValues: {
            pixKey: ' ',
            fullName: ' ',
            amount: 5000,
        }
      });

    const [currentCredits, setCurrentCredits] = React.useState(0)
    const [withdrawRows, setWithdrawRows] = React.useState([])

    useEffect(() => {
        api.get('/user/info/withdraw').then((response) => {
            setCurrentCredits(response.data.credits);
            setWithdrawRows(response.data.withdraws);
            setValue('pixKey', response.data.pixKey)
            setValue('fullName', response.data.fullName)
        })        
        .catch((error) => {})
    }, [])
    
    const withdraw = (data: WithdrawForm) => {        
        api.post('/payment/withdraw', data).then((response) => {
            let data = response.data                        
            setCurrentCredits(data.credits)
            setWithdrawRows(data.withdraws);
            toast.success(`Saque realizado com sucesso!`)
            
        }).catch((error) => {
            let message = error.response?.data?.code
            let value = error.response?.data?.value
            if(message === 'INSUFFICIENT_FUNDS') {
                toast.warning(`Insufficient funds. You have ${formatMoney(value)} credits`)                
            } else if(message === 'INVALID_PIX_KEY') {
                toast.error(`Invalid PIX Key`)                
            } else if(message === 'INVALID_FULL_NAME') {
                toast.error(`Invalid Full Name`)
            } else if(message === 'INVALID_AMOUNT') {
                toast.error(`Invalid Amount`)
            } else {
                toast.error(`Error: ${message}`)
            }
                
        })
    }

    const watchAmount = watch('amount')
    const [currentTab, setCurrentTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
        
    const tiers = [        
        {
        title: 'Pro',
        subheader: 'Mais popular',
        price: 1500,
        description: [
            'Pague com PIX',
            'Cartões de crédito e débito',
            'Receba seus créditos na hora',
            'Sem identificação',
        ],
        buttonText: 'Pagar',
        buttonVariant: 'contained',
        buttonClick: () => {
            api.post('/payment/checkout', {
                callbackSuccessURL: "http://localhost:3000/",
                callbackCancelURL: "http://localhost:3000/",
                productPriceId: "price_1NhzVoKlJkY2RgIL7QVh4Ugu"
            }).then((response) => {
                let url = response.data.checkoutUrl
                window.open(url, '_blank')
                
            }).catch((error) => {
                toast.error(error.response?.data?.code || 'Ops! Ocorreu um erro')
            })
        }
        },        
    ];

    return (
        <Box sx={{display: 'flex',
                flexDirection: 'column',                
                backgroundColor: '#333',
                width: '100%',
                minHeight: '100vh',
                }}>      
            <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'end', p: 1}}>
                <Button variant="contained" onClick={() => navigate('/')}>X</Button>              
            </Box>
            <Box sx={{display:'flex', flexDirection: 'column', p: 2, backgroundColor: '#333'}}>
                <Box sx={{p: 1, mb: 1}}>
                    <TextField
                        label="Créditos R$"                                                        
                        variant="outlined"
                        value={formatMoney(currentCredits)}
                        disabled
                    />
                </Box>
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleChange}>
                            <Tab label="Depositar" value={0} />
                            <Tab label="Sacar" value={1} />
                            <Tab label="Histórico de Saques" value={2} />
                        </Tabs>
                    </Box>
                    <Box hidden={currentTab !== 0}>
                    {tiers.map((tier) => (
                        <Card>
                            <CardHeader
                            title={tier.title}
                            subheader={tier.subheader}
                            titleTypographyProps={{ align: 'center' }}
                            action={tier.title === 'Pro' ? <StarIcon /> : null}
                            subheaderTypographyProps={{
                                align: 'center',
                            }}
                            sx={{
                                backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[200]
                                    : theme.palette.grey[700],
                            }}
                            />
                            <CardContent>
                            <Box
                                sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'baseline',
                                mb: 2,
                                }}
                            >
                                <Typography component="h2" variant="h3" color="text.primary">
                                {formatMoney(tier.price)}
                                </Typography>
                                {/* <Typography variant="h6" color="text.secondary">
                                /mo
                                </Typography> */}
                            </Box>
                            <ul>
                                {tier.description.map((line) => (
                                <Typography
                                    component="li"
                                    variant="subtitle1"
                                    align="center"
                                    key={line}
                                >
                                    {line}
                                </Typography>
                                ))}
                            </ul>
                            </CardContent>
                            <CardActions>
                            <Button
                                fullWidth
                                variant={tier.buttonVariant as 'outlined' | 'contained'}
                                onClick={() => tier.buttonClick()}
                            >
                                {tier.buttonText}                                
                            </Button>
                            </CardActions>
                        </Card>
                    ))}
                    </Box>
                    <Box hidden={currentTab !== 1}>
                        <form onSubmit={handleSubmit(data => withdraw(data))}>
                            <Box sx={{display: 'flex', flexDirection: 'column', p: 1, gap: 2}}>                        
                                <Select
                                    error={!!errors.amount}
                                    onChange={(e) => setValue("amount", e.target.value as number)}
                                    value={watchAmount}
                                    >
                                    {
                                        [5000, 10000, 25000, 50000, 100000, 500000, 1000000].map((value) => (
                                            <MenuItem key={value} value={value}>{formatMoney(value)}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <TextField
                                    label="Chave PIX"
                                    maxLength={50}
                                    placeholder="email, telefone, cpf ou aleatória"
                                    variant="outlined"
                                    error={!!errors.pixKey}
                                    {...register('pixKey', { 
                                        required: 'Digite a Chave PIX',
                                    })}
                                    />
                                <TextField
                                    label="Nome completo"
                                    maxLength={50}
                                    placeholder="ex. João da Silva"
                                    variant="outlined"
                                    error={!!errors.fullName}
                                    {...register('fullName', { 
                                        required: 'Digite o Nome completo',
                                    })}
                                    />
                                <Button variant="contained" type="submit">Sacar</Button>
                            </Box>                    
                        </form>
                    </Box>
                    <Box hidden={currentTab !== 2}>
                        <Table sx={{ width: '100%'}} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Data Saque</TableCell>
                                <TableCell align="right">Valor R$</TableCell>
                                <TableCell>Data Pago</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {withdrawRows.map((row: any) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{formatTimeStampToDate(row.createdAt)}</TableCell>
                                    <TableCell align="right">{formatMoney(row.amount)}</TableCell>
                                    <TableCell>{row.paidAt}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Withdraw