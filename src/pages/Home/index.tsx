import { Box, Button, Container, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import Game from '../../core/Game';

const Home = () => {

    const containerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(containerRef.current){
            containerRef.current.innerHTML = ''
            new Game(containerRef.current)
        }
    }, [containerRef.current])

    return (
        <Box ref={containerRef} 
            sx={{display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                }}>
        </Box>            
    )
}

export default Home