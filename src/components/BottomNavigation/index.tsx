import React, { useContext } from 'react';
import { Paper, BottomNavigation as BottomNavigationMui, BottomNavigationAction } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserState } from '../../App';

type Props = {
    spinHandler: () => void;
}

const BottomNavigation: React.FC<Props> = ({spinHandler}) => {

    const navigate = useNavigate();
    const userState = useContext(UserContext);

    return(
        <Paper sx={{ position: 'fixed',
                 bottom: 0, left: 0, right: 0, zIndex: 101,
                 display: { sm: 'block', md: 'block' },
                 }} elevation={1}>
            <BottomNavigationMui showLabels>
            <BottomNavigationAction onClick={() => navigate('/')} label="Home" icon={<HomeRoundedIcon />} />
            <BottomNavigationAction onClick={spinHandler} label="Messages" icon={<MessageRoundedIcon />} />
            <BottomNavigationAction onClick={() => navigate('/')} label="Profile" icon={<AccountBoxRoundedIcon />} />
            <BottomNavigationAction onClick={() => userState.set({showSettings: true} as UserState)} label="Settings" icon={<SettingsRoundedIcon />} />
            </BottomNavigationMui>
        </Paper>
    )
}

export default BottomNavigation;