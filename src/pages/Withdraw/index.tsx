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
                            <Tab label="Regras" value={1} />
                            <Tab label="Sacar" value={2} />
                            <Tab label="Histórico de Saques" value={3} />
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
                        <h3 style={{marginTop: '20px'}}>Fortune Jaguar</h3>
                        <ul className='ul'>
                            <li>Fortune Jaguar is a 3-reel, 3-row video slot featuring respins and x10 multiplier.</li>
                            <li>The game is played with 5 bet lines (fixed) and bet size of 0.10 to 0.90.</li>
                            <li>The Bet Amount is set using the Bet Options screen or Minus and Plus buttons.</li>
                            <li>"Cash Wallet" displays the cash available for wager.</li>
                            <li>Winning combinations and payouts are made according to the "Paytable".</li>
                            <li>A bet line win in cash is equal to the value show in the "Paytable" multiplied by the bet size.</li>
                            <li>Only the highest win per bet line is paid.</li>
                            <li>Bet lines win if the winning symbols are in succession from the leftmost reel to the right.</li>
                            <li>Simultaneous wins on different bet lines are added.</li>
                            <li>All wins shown in cash.</li>
                            <li>Wild symbol substitues for all symbols.</li>
                        </ul>
                        <h3>Paytable</h3>
                        <ol className='ul span-paytable' style={{display: 'flex', flexWrap: 'wrap', gap: '40px', listStyle: 'none'}}>                            
                            <li><img src="/assets/banana.png" width="48"/><span>3</span></li>
                            <li><img src="/assets/grape.png" width="48"/><span>5</span></li>
                            <li><img src="/assets/lemon.png" width="48"/><span>8</span></li>                            
                            <li><img src="/assets/pineaple.png" width="48"/><span>10</span></li>
                            <li><img src="/assets/orange.png" width="48"/><span>25</span></li>
                            <li><img src="/assets/cherry.png" width="48"/><span>100</span></li>
                            <li><img src="/assets/wild.png" width="48"/><span>250</span></li>
                        </ol> 
                        <h3>x10 Multiplier</h3>
                        <img src="/assets/x10-sample.png" width="128"/>
                        <ul className='ul'>
                            <li>When all symbols in the reels are involved in a win, the win will be multiplied by x10.</li>
                            <li>Stand a chance to win up to 2500x of the total bet amount.</li>
                        </ul>
                        <h3>Winning Bet Lines</h3>
                        <ol className='ul' style={{display: 'flex', flexWrap: 'wrap', gap: '40px', listStyle: 'decimal-leading-zero'}}>
                            <li><img src="/assets/line1.png" width="48"/></li>
                            <li><img src="/assets/line2.png" width="48"/></li>
                            <li><img src="/assets/line3.png" width="48"/></li>                                
                            <li><img src="/assets/line4.png" width="48"/></li>
                            <li><img src="/assets/line5.png" width="48"/></li>
                        </ol>                        
                        <h3>Main Game</h3>
                        <ul className='ul span-icons'>
                            <li>
                                <img src="/assets/play-button.png" width="32"/>
                                <span>Spin: Tap to start spin at the current Bet Lines and Bet Size.</span></li>
                            <li>
                                <img src="/assets/minus-bet-button.png" width="32"/>
                                <span>Minus: Tap to reduce the Bet Amount.</span>
                            </li>
                            <li>
                                <img src="/assets/plus-bet-button.png" width="32"/>
                                <span>Plus: Tap to increase the Bet Amount.</span>
                            </li>
                            <li>
                                <img src="/assets/scoreboard-credits.png" width="32"/>
                                <span>Wallet Balance: Displays the current wallet balance.</span>
                            </li>
                            <li>
                                <img src="/assets/scoreboard-bet.png" width="32"/>
                                <span>Bet Amount: Tab to display the Bet Options screen.</span>
                            </li>
                            <li>
                                <img src="/assets/scoreboard-won.png" width="32"/>
                                <span>win Amount: Displays the spin win result.</span>
                            </li>
                            <li>
                                <img src="/assets/exit-button.png" width="32"/>
                                <span>Exit: Ends user session.</span>
                            </li>
                            <li>
                                <img src="/assets/settings-button.png" width="32"/>
                                <span>Settings: Tap to display the settings page.</span>
                            </li>
                        </ul>
                    </Box>
                    <Box hidden={currentTab !== 2}>
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
                    <Box hidden={currentTab !== 3}>
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