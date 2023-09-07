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
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/userService';
import { toast } from 'react-toastify';
import StarIcon from '@mui/icons-material/StarBorder';
import { UserContext } from '../../App';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

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
    const userState = useContext(UserContext)

    type WithdrawForm = {
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
            amount: 5000,
        }
      });

    const [currentCredits, setCurrentCredits] = React.useState(0)
    const [withdrawRows, setWithdrawRows] = React.useState([])
    const [referralRows, setReferralRows] = React.useState([])
    const [prices, setPrices] = React.useState<Array<any>>([])

    useEffect(() => {
        api.get('/user/info/withdraw').then((response) => {
            setCurrentCredits(response.data.credits);
            setWithdrawRows(response.data.withdraws);
            setReferralRows(response.data.referrals);
            setPrices(response.data.prices)
        })        
        .catch((error) => {})
    }, [])
    
    const withdraw = (data: WithdrawForm) => {        
        api.post('/payment/withdraw', data).then((response) => {
            let data = response.data                        
            setCurrentCredits(data.credits)
            setWithdrawRows(data.withdraws);
            setReferralRows(data.referrals);
            toast.success(`Saque realizado com sucesso!`)
            
        }).catch((error) => {
            let message = error.response?.data?.code
            let value = error.response?.data?.value
            if(message === 'INSUFFICIENT_FUNDS') {
                toast.warning(`Créditos insuficientrse. Você tem ${formatMoney(value)} créditos`)                
            } else if(message === 'INVALID_AMOUNT') {
                toast.error(`Valor inválido.`)
            } else {
                toast.error(`Error: ${message}`)
            }
                
        })
    }

    const { 
        register: registerVoucher,
        handleSubmit: handleSubmitVoucher,
        formState: { errors: errorsVoucher }
        } = useForm<{ code: string}>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        defaultValues: {
            code: '',
        }
      });

    const submitVoucher = (data: { code: string}) => {        
        api.post('/user/voucher', data).then((response) => {
            let data = response.data                        
            setCurrentCredits(data.credits)
            toast.success(`Código aceito!`)
            
        }).catch((error) => {
            let message = error.response?.data?.code;
            if(message === 'INVALID_VOUCHER') {
                toast.error(`O código inserido é inválido.`)
            } else {
                toast.error(`Error: ${message}`)
            }
        })
    }

    const watchAmount = watch('amount')
    const [currentTab, setCurrentTab] = useState(0);
    const [tiers, setTiers] = useState<Array<any>>([])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {

        if(!prices)
            return

        let titles = ['Pro', 'Super', 'Ultra']
        let subs = ['Mais popular', 'Super apostador', 'Ultra apostador']

        setTiers(prices.map( (price, idx) => {
            return {
            title: titles[idx],
            subheader: subs[idx],
            price: price.amount,
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
                    callbackSuccessURL: window.location.origin,
                    callbackCancelURL: window.location.origin,
                    productPriceId: price.id
                }).then((response) => {
                    let url = response.data.checkoutUrl
                    window.open(url, '_blank')
                    
                }).catch((error) => {
                    toast.error(error.response?.data?.code || 'Ops! Ocorreu um erro')
                })
            }
            }}
        ))

    }, [prices])

    return (
        <Box sx={{display: 'flex',
                flexDirection: 'column',                
                backgroundColor: '#333',
                width: '100%',
                minHeight: '100vh',
                }}>      
            <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'end', p: 1}}>
                <Button variant="contained" onClick={() => navigate('/')}><CloseOutlinedIcon /></Button>              
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
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={currentTab} onChange={handleChange}>
                            <Tab label="Depositar" value={0} />
                            <Tab label="Regras" value={1} />
                            <Tab label="Sacar" value={2} />
                            <Tab label="Indicações" value={3} hidden={!userState.referrer} />
                        </Tabs>
                    </Box>                    
                    <Box hidden={currentTab !== 0}>
                        <Box sx={{display: 'flex', flexDirection: 'column', p: 1, gap: 2}}>
                            <p style={{color: '#e0e0e0'}}>Use um código voucher válido e receba créditos.</p>
                            <form onSubmit={handleSubmitVoucher(data => submitVoucher(data))}>                        
                                <Box sx={{display: 'flex', flexDirection: 'column', p: 1, gap: 2}}>                        
                                    <TextField
                                        label="Voucher"
                                        maxLength={50}
                                        placeholder="Ex. JOAO25"
                                        variant="outlined"
                                        error={!!errorsVoucher.code}
                                        {...registerVoucher('code', { 
                                            required: 'Insira o código do voucher',
                                        })}
                                        />
                                    <Button variant="contained" type="submit">Enviar</Button>
                                </Box>                    
                            </form>
                            {tiers.map((tier) => (
                                <Card key={tier.title}>
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
                                    </Box>
                                    <ul>
                                        {tier.description.map((line: string) => (
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
                        <img src="/assets/x10.png" width="128"/>
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
                                <h3>Saque</h3>    
                                <ul className="ul" style={{paddingTop: 0, paddingBottom: 0}}>
                                    <li>Escolha o valor para saque.</li>
                                    <li>Os saques são processados em 2-3 dias úteis.</li>
                                    <li>Os saques são feitos usando PIX e transferidos para a chave que é o Número de Telefone usado no Login.</li>
                                    <li>Cadastre o seu Número de Telefone como chave PIX em um banco antes de efetuar o saque.</li>
                                </ul>                    
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
                                <Button variant="contained" type="submit">Sacar</Button>
                                <Table sx={{ width: '100%'}} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Data Saque</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                        <TableCell>Data Pago</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {withdrawRows.map((row: any) => (
                                        <TableRow
                                        key={row.id}
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
                        </form>
                    </Box>
                    <Box hidden={currentTab !== 3 || !userState.referrer}>
                        <Box sx={{display: 'flex', flexDirection: 'column', p: 1, gap: 2}}>
                            <h3>Indicações</h3>
                            <p style={{color: '#e0e0e0'}}>Use seu código <span style={{color: '#ffcc00'}}>{userState.username}</span> para convidar novos usuários.</p>
                            <Table sx={{ width: '100%'}} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {referralRows.map((row: any) => (
                                    <TableRow
                                    key={row.username}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>{formatTimeStampToDate(row.referredAt)}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Withdraw