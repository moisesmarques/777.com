import * as PIXI from 'pixi.js';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import SuperGanhoScreen from './SuperGanhoScreen';
import Button from './Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatMoney } from './utils';
import { UserState } from '../App';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';
import {GlowFilter} from '@pixi/filter-glow';
import ReelsWinResult from './ReelsWinResult';
import BetSettingsMenu from './BetSettingsMenu';

const Game = () => {
    const navigate = useNavigate();
    const containerRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(containerRef.current === null) return;        
        const container = containerRef.current;  
        container.innerHTML = '';      
        const userState = JSON.parse(localStorage.getItem('current_user') || '{}') as UserState;
        const token = userState?.token;

        const api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            });
        
        api.interceptors.request.use(
        r => {
            r.headers.Authorization = `Bearer ${token}`;
            return r;
        },
        e => e)

        api.interceptors.response.use(
        r => r,
        e => {
            if(e.response?.status === 403){
                localStorage.removeItem('current_user')
                window.location.reload()
            }

            return Promise.reject(e);
        })

        const app = new PIXI.Application({
            width: 360,
            height: 740,
            eventMode: 'passive',
            backgroundAlpha: 0,
            eventFeatures: {
                move: true,
                globalMove: false,
                click: true,
                wheel: true,
            },
        });

        container.appendChild(app.view as HTMLCanvasElement);
        
        let startCredits = 0;
        let startBet = 50;
        let assetsObj: any;
        let buttons: Array<Button> = [];
        
        PIXI.Assets.add('sym1', '../../assets/cherry.png')
        PIXI.Assets.add('sym2', '../../assets/orange.png')
        PIXI.Assets.add('sym3', '../../assets/grape.png')
        PIXI.Assets.add('sym4', '../../assets/banana.png')        
        PIXI.Assets.add('sym5', '../../assets/lemon.png')        
        PIXI.Assets.add('sym6', '../../assets/pineaple.png')
        PIXI.Assets.add('wild', '../../assets/wild.png')
        PIXI.Assets.add('background', '../../assets/background.png')
        PIXI.Assets.add('logo', '../../assets/logo-128.png')
        PIXI.Assets.add('sbCredits', '../../assets/scoreboard-credits.png')
        PIXI.Assets.add('sbBet', '../../assets/scoreboard-bet.png')
        PIXI.Assets.add('sbWon', '../../assets/scoreboard-won.png')
        PIXI.Assets.add('playBtn', '../../assets/play-button.png')
        PIXI.Assets.add('minusBetBtn', '../../assets/minus-bet-button.png')
        PIXI.Assets.add('plusBetBtn', '../../assets/plus-bet-button.png')
        PIXI.Assets.add('settingsBtn', '../../assets/settings-button.png')
        PIXI.Assets.add('exitBtn', '../../assets/exit-button.png')
        PIXI.Assets.add('flare1', '../../assets/flare-light.png')

        // loading progress bar
        const loadingBar = new PIXI.Graphics();
        loadingBar.beginFill(0x000000);
        loadingBar.drawRect(0, 0, 310, 20);
        loadingBar.endFill();
        loadingBar.x = (app.screen.width - loadingBar.width) / 2;
        loadingBar.y = (app.screen.height - loadingBar.height) / 2;
        app.stage.addChild(loadingBar);

        const loadingBarBg = new PIXI.Graphics();
        loadingBarBg.beginFill(0xffffff);
        loadingBarBg.drawRect(0, 0, 300, 10);
        loadingBarBg.endFill();
        loadingBarBg.x = (app.screen.width - loadingBarBg.width) / 2;
        loadingBarBg.y = (app.screen.height - loadingBarBg.height) / 2;
        app.stage.addChild(loadingBarBg);

        const loadingText = new PIXI.Text('Carregando...', {
            fontFamily: 'Verdana',
            fontSize: 16,
            fill: '#ffffff',
            align: 'center'
        });
        loadingText.x = (app.screen.width - loadingText.width) / 2;
        loadingText.y = (app.screen.height - loadingText.height) / 2 - 50;
        app.stage.addChild(loadingText);


        loadingBarBg.scale.x = 0;
        let progressInterval = setInterval(() => {
            if(loadingBarBg.scale.x + 0.1 < 1){
                loadingBarBg.scale.x += 0.1;                
            }
        }, 50)

        const winAudio = new Audio('../../assets/win.mp3');
        const spinAudio = new Audio('../../assets/spin-.mp3')
        
        api.get('/user/info').then((response) => {
            startCredits = response.data.credits;
            PIXI.Assets.load(['sym1',
                'sym2',
                'sym3',
                'sym4',
                'sym5',
                'sym6',
                'background',
                'logo',
                'sbCredits',
                'sbBet',
                'sbWon',
                'playBtn',
                'minusBetBtn',
                'plusBetBtn',
                'settingsBtn',
                'exitBtn',
                'wild',
                'flare1'
                ]).then((assets: any) => {
                assetsObj = assets;

                PIXI.BitmapFont.from('Font-WinAmount', {
                    fontFamily: 'Goddess',
                    fontSize: 36,
                    fill: '#ffba00',
                    strokeThickness: 3,
                    stroke: 0x000000,
                    align: 'center'
                }, {
                    chars: [['0', '9'], ['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[],.+- "]
                });
                
                PIXI.BitmapFont.from('Font-SuperWin', {
                    fontFamily: 'Goddess',
                    fontSize: 60,
                    fill: '#ffba00', // dark yellow
                    strokeThickness: 5,
                    stroke: 0x000000,
                    align: 'center'
                }, {
                    chars: [['0', '9'], ['a', 'z'], ['A', 'Z'], ". "]
                });
        
                PIXI.BitmapFont.from('Font-LineNumber', {
                    fontFamily: 'Goddess',
                    fontSize: 18,
                    strokeThickness: 3,
                    stroke: 0x000000,
                    fill: '#ffba00',
                    align: 'center'
                }, {
                    chars: [['0', '9'], ['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[],. "]
                });

                PIXI.BitmapFont.from('Font-LineAmount', {
                    fontFamily: 'Goddess',
                    fontSize: 24,
                    strokeThickness: 3,
                    stroke: 0x000000,
                    fill: '#ffba00',
                    align: 'center'
                }, {
                    chars: [['0', '9'], ['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[],. "]
                });

                clearInterval(progressInterval);

                init();
            })
        })        
        .catch((error) => {})

        function init(){
            winAudio.volume = 0.3;
            const symbols = ['sym1', 'wild', 'sym3', 'sym2', 'sym4', 'sym5', 'sym6' ]

            const bg = new PIXI.Sprite(assetsObj['background']);
            bg.x = app.screen.width / 2 - bg.width / 2;
            bg.y = app.screen.height / 2 - bg.height / 2;
            app.stage.addChild(bg);

            const logo = new PIXI.Sprite(assetsObj['logo']);
            logo.x = app.screen.width / 2 - logo.width / 2;
            logo.y = 10;
            app.stage.addChild(logo);

            const textures = symbols.map( symbol => assetsObj[symbol])
            const reels = new ReelsContainer(app, [textures, textures, textures]);
            const reelsWidth = reels.NUMBER_OF_REELS * reels.REEL_WIDTH;
            reels.container.x = app.screen.width / 2 - reelsWidth / 2;
            reels.container.y = 160;
            app.stage.addChild(reels.container);    


            const reelsWinResult = new ReelsWinResult(app, [textures, textures, textures]);
            reelsWinResult.container.x = app.screen.width / 2 - reelsWidth / 2;
            reelsWinResult.container.y = 160;
            app.stage.addChild(reelsWinResult.container);

            const scoreboard = new Scoreboard(app, assetsObj.sbCredits, assetsObj.sbBet, assetsObj.sbWon);
            scoreboard.update(startCredits, startBet, 0)
            app.stage.addChild(scoreboard.container);

            const textWinAmount = new PIXI.BitmapText(`+ ${formatMoney(scoreboard.won)}`, { fontName: 'Font-WinAmount' });
            textWinAmount.alpha = 0;  
            app.stage.addChild(textWinAmount);

            const showWinAmount = () => {
                textWinAmount.scale.set(1, 1);
                textWinAmount.text = `+ ${formatMoney(scoreboard.won)}`;
                textWinAmount.x = (app.screen.width - textWinAmount.width) / 2;
                textWinAmount.y = (app.screen.height) / 2 + 100;                
                textWinAmount.alpha = 1;
            }

            const hideWinAmount = () => {
                let until = Date.now() + 100;
                let tick = () => {
                    textWinAmount.y += 10;
                    textWinAmount.x -= 10;
                    textWinAmount.alpha -= 0.01;
                    textWinAmount.scale.x -= 0.1;
                    textWinAmount.scale.y -= 0.1;
                    if(Date.now() > until){
                        app.ticker.remove(tick)
                        textWinAmount.alpha = 0;  
                    }
                }
                app.ticker.add(tick)
            }

            const playBtn = new Button(spinHandler,
                75, 75, app.screen.width / 2, 600,
                assetsObj.playBtn,
                assetsObj.playBtn,
                );
            app.stage.addChild(playBtn.sprite);            

            playBtn.sprite.on('pointerover', () => {
                let glowFilter =new GlowFilter({ 
                    color: 0xffffff,
                    distance: 100,
                    outerStrength: 0,
                    innerStrength: 0,
                 })           
                playBtn.sprite.filters = [glowFilter]
                let until = Date.now() + 300;
                let strength = 0.2

                let tick = () => {                    
                    glowFilter.outerStrength += strength
                    glowFilter.innerStrength += strength
                    if(Date.now() > until){
                        app.ticker.remove(tick)
                        playBtn.sprite.filters = []
                    }
                }
                app.ticker.add(tick)                
            })

            playBtn.sprite.on('pointerdown', () => {
                let rotateUntil = Date.now() + 1000;
                let tickRotation = () => {
                    playBtn.sprite.rotation += 0.5
                    if(Date.now() > rotateUntil){
                        app.ticker.remove(tickRotation)
                    }
                }
                app.ticker.add(tickRotation)
            })

            buttons.push(playBtn);

            const betMinusBtn = new Button(decreaseBetHandler,
                50, 50, playBtn.sprite.x - 100, playBtn.sprite.y,
                assetsObj.minusBetBtn,
                assetsObj.minusBetBtn,
                );
            app.stage.addChild(betMinusBtn.sprite);
            buttons.push(betMinusBtn);

            const betPlusBtn = new Button(increaseBetHandler,
                50, 50, playBtn.sprite.x + 100, playBtn.sprite.y,
                assetsObj.plusBetBtn,
                assetsObj.plusBetBtn,
                );
            app.stage.addChild(betPlusBtn.sprite);
            buttons.push(betPlusBtn);

            const withdrawBtn = new Button(() => {navigate('/withdraw')},
                50, 50, app.screen.width - 35, 35,
                assetsObj.settingsBtn,
                assetsObj.settingsBtn,
                );
            app.stage.addChild(withdrawBtn.sprite);
            buttons.push(withdrawBtn);

            const exitBtn = new Button(() => {
                localStorage.removeItem('current_user')
                navigate('/login')
            },
                50, 50, 35, 35,
                assetsObj.exitBtn,
                assetsObj.exitBtn,
                );
            app.stage.addChild(exitBtn.sprite);
            buttons.push(exitBtn);

            const betOptions = [50, 150, 500, 750, 1500, 2250, 4500]

            const betSettings = new BetSettingsMenu(app, scoreboard, betOptions);

            scoreboard.betText.on('pointerdown', () => {
                console.log('bet settings')
                betSettings.show()
            })

            const superGanhoScreen = new SuperGanhoScreen(app, assetsObj);

            function increaseBetHandler() {
                let currentBetIndex = betOptions.indexOf(scoreboard.bet)
                if(currentBetIndex >= betOptions.length - 1){
                    return;
                }
                let nextBet = betOptions[currentBetIndex + 1]
                scoreboard.update(scoreboard.credits, nextBet, scoreboard.won)
            }

            function decreaseBetHandler() {
                let currentBetIndex = betOptions.indexOf(scoreboard.bet)
                if(currentBetIndex === 0){
                    return;
                }
                let previousBet = betOptions[currentBetIndex - 1]
                scoreboard.update(scoreboard.credits, previousBet, scoreboard.won)
            }

            function spinHandler() {
                reelsWinResult.hide();
                superGanhoScreen.hide();
                hideWinAmount();

                scoreboard.update(scoreboard.credits, scoreboard.bet, 0)
                if(scoreboard.bet > scoreboard.credits){
                    toast.warning(`Insufficient funds. You have ${scoreboard.credits} credits`)
                    return;
                }

                buttons.forEach((button) => button.setDisabled());

                let config = {
                    speed: 20,
                    until: Date.now() + 30000,
                    callback: () => {}
                }

                reels.spin(config)
                spinAudio.currentTime = 0;
                spinAudio.play()
                scoreboard.update(scoreboard.credits - scoreboard.bet, scoreboard.bet, scoreboard.won);
                api.post('/game/spin', {
                    bet: scoreboard.bet
                }).then((response) => {
                    const credits = response.data.credits;
                    const win = response.data.win;
                    const amountWon = response.data.amountWon;
                    let textures = response.data.symbols.map((reel: Array<string>) => {
                        return reel.map((texture) => {
                            return assetsObj[texture]
                        })
                    })
                    
                    reels.swapTextures(textures)                    

                    config.callback = () => {
                        scoreboard.update(credits, scoreboard.bet, scoreboard.won + amountWon);
                        if(win){
                            winAudio.play()
                            reelsWinResult.show(response.data.winningLines, response.data.amountPerLine, textures)

                            if (amountWon >= 250 * scoreboard.bet){
                                superGanhoScreen.show('ultra', amountWon)
                            } else if (amountWon >= 100 * scoreboard.bet){
                                superGanhoScreen.show('mega', amountWon)
                            } else if (amountWon >= 25 * scoreboard.bet){
                                superGanhoScreen.show('super', amountWon)
                            } else if(amountWon >= 10 * scoreboard.bet){
                                superGanhoScreen.show('big', amountWon)
                            } else {
                                showWinAmount()
                            }
                        }
                        buttons.forEach((button) => button.setEnabled());                        
                    }

                    config.until = 0;
                    
                }).catch((error) => {            
                    let message = error.response?.data?.code
                    let value = error.response?.data?.value

                    if (message === 'INSUFFICIENT_FUNDS'){
                        toast.warning(`Insufficient funds. You have ${value} credits`)
                    } else {
                        console.log(error)
                        toast.error('Ops... Something went wrong')
                    }
                })
            }
        }      

    }, [containerRef.current])

    return (
        <div id='game-container' ref={containerRef} style={{
            width: '360px', 
            height: '740px', 
            margin:'0 auto', 
            position: 'relative'}}></div>
    )
}

export default Game;