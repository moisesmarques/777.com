import React, { useContext, useEffect } from 'react';
import Game from '../../core/Game';

const Home = () => {
    return (
        <div style={{height: '100%'}}>
            <Game />
            <span style={{fontFamily: 'Rubik Mono One', position: 'fixed', left: '-200'}} >Load font...</span>
        </div>
    )
}

export default Home