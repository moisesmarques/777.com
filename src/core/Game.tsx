import React, { useContext, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';
import { Box } from '@mui/material';
import Button from './Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatMoney } from './utils';

const Game = () => {

    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {

        const userState = localStorage.getItem('current_user')
        const token = userState ? JSON.parse(userState).token : ''

        const api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
          });
        
        api.interceptors.request.use(
        r => {
            r.headers.Authorization = `Bearer ${token}`;
            return r;
        }
        , e => {
            toast.error(e.response?.data?.code || 'Ops...')
            return Promise.reject({});
        })

        console.log('useEffect refresh')

        if (!containerRef.current) {
            return;
        }

        containerRef.current.innerHTML = '';
        
        const app = new PIXI.Application({
            resizeTo: containerRef.current,
            eventMode: 'passive',
            eventFeatures: {
                move: true,
                globalMove: false,
                click: true,
                wheel: true,
            },
            backgroundColor: 0x1099bb,
        });

        containerRef.current.appendChild(app.view as HTMLCanvasElement);

        api.get('/game/scoreboard').then((response) => {
            let credits = response.data.credits;
            let bet = response.data.bet;
            scoreboard.update(credits, bet, 0)
        })

        const winAudio = new Audio('../../assets/win.mp3');
        winAudio.volume = 0.3;

        const reels = new ReelsContainer(app);
        createReels(app, reels);

        const scoreboard = new Scoreboard(app);
        app.stage.addChild(scoreboard.container);

        const victoryScreen = new VictoryScreen(app);
        if (victoryScreen && victoryScreen.container)
            app.stage.addChild(victoryScreen.container);
        
        const playBtn = new Button(app, 
            spinHandler,
            75,
            75,
            (app.screen.width - 75) / 2,
            app.screen.height - 125,
            PIXI.Texture.from('../../assets/buttonEnabled.png'),
            PIXI.Texture.from('../../assets/buttonDisabled.png'),
            );
        app.stage.addChild(playBtn.sprite);

        const betMinusBtn = new Button(app, 
            decreaseBetHandler,
            50,
            50,
            playBtn.sprite.x-100,
            playBtn.sprite.y,
            PIXI.Texture.from('../../assets/buttonEnabled.png'),
            PIXI.Texture.from('../../assets/buttonDisabled.png'),
            );
        app.stage.addChild(betMinusBtn.sprite);

        const betPlusBtn = new Button(app, 
            increaseBetHandler,
            50,
            50,
            playBtn.sprite.x+125,
            playBtn.sprite.y,
            PIXI.Texture.from('../../assets/buttonEnabled.png'),
            PIXI.Texture.from('../../assets/buttonDisabled.png'),
            );
        app.stage.addChild(betPlusBtn.sprite);

        function createReels(app: PIXI.Application, reels: ReelsContainer) {
            const reelsWidth = reels.NUMBER_OF_REELS * reels.REEL_WIDTH;
            const reelsHeight = reels.NUMBER_OF_ROWS * reels.ROW_HEIGHT;
            reels.container.x = app.screen.width / 2 - reelsWidth / 2;
            reels.container.y = 100;

            reels.container.mask = new PIXI.Graphics()
                .beginFill(0xffffff)
                .drawRect(0, reels.ROW_HEIGHT + reels.ROW_HEIGHT * 0.5, reels.REEL_WIDTH * 4, reels.ROW_HEIGHT * 3)
                .endFill();

            app.stage.addChild(reels.container);
        }

        function increaseBetHandler() {
            betPlusBtn.setDisabled();
            api.post('/game/bet/increase', { bet: 50 }).then((response) => {
                let bet = response.data.bet;
                scoreboard.update(scoreboard.credits, bet, scoreboard.won)
                betPlusBtn.setEnabled();
            }).catch((error) => {
                let message = error.response?.data?.code
                let value = error.response?.data?.value
                if(message === 'MAXIMUM_BET') {
                    toast.warning(`Maximum bet is ${formatMoney(value)}`)
                } else {
                    toast.error('Ops... Something went wrong')
                }
                betPlusBtn.setEnabled();
            })
        }

        function decreaseBetHandler() {
            betMinusBtn.setDisabled();
            api.post('/game/bet/decrease', { bet: 50 }).then((response) => {
                let bet = response.data.bet;
                scoreboard.update(scoreboard.credits, bet, scoreboard.won)
                betMinusBtn.setEnabled();
            }).catch((error) => {
                let message = error.response?.data?.code
                let value = error.response?.data?.value
                if(message === 'MINIMUM_BET'){
                    toast.warning(`Minimum bet is ${formatMoney(value)}`)
                } else if (message === 'INSUFFICIENT_FUNDS'){
                    toast.warning(`Insufficient funds. You have ${formatMoney(value)} credits`)
                } else {
                    toast.error('Ops... Something went wrong')
                }
                betMinusBtn.setEnabled();
            })
        }

        function spinHandler() {
            playBtn.setDisabled();
            betPlusBtn.setDisabled();
            betMinusBtn.setDisabled();

            let config = {
                result: [],
                speed: 25,
                spinUntil: Date.now() + 30000,
                callback: () => {}
            }

            reels.spin(config)
            scoreboard.update(scoreboard.credits - scoreboard.bet, scoreboard.bet, scoreboard.won);

            api.post('/game/spin').then((response) => {
                config.result = response.data.result;
                config.spinUntil = Date.now() + 600;
                
                const credits = response.data.credits;
                const bet = response.data.bet;
                const win = response.data.win;
                const amountWon = response.data.amountWon;

                config.callback = () => {
                    scoreboard.update(credits, bet, scoreboard.won + amountWon);
                    playBtn.setEnabled();
                    betPlusBtn.setEnabled();
                    betMinusBtn.setEnabled();
                    if(win){
                        victoryScreen.show();
                        winAudio.play()
                    }
                }
               
            }).catch((error) => {
                
                let message = error.response?.data?.code
                let value = error.response?.data?.value

                if (message === 'INSUFFICIENT_FUNDS'){
                    toast.warning(`Insufficient funds. You have ${value} credits`)
                } else {
                    toast.error('Ops... Something went wrong')
                }

                playBtn.setEnabled();
                betPlusBtn.setEnabled();
                betMinusBtn.setEnabled();
            })
        }

        return () => {
            // Cleanup PIXI resources if needed
            app.destroy();
        };
    }, [containerRef.current]);

    return (
        <Box sx={{display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: '740px',
                width: '100%',
                }}
                ref={containerRef}></Box>
    )
}

export default Game;