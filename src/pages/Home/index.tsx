import React, { useContext, useEffect } from 'react';
import Game from '../../core/Game';

const Home = () => {
    return (
        <div style={{height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'}}>
            <Game />
        </div>
    )
}

export default Home