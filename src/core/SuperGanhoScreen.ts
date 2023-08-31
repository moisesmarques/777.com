import * as PIXI from 'pixi.js';
import { formatMoney } from './utils';
import * as Conffeti from 'canvas-confetti';
import { GlowFilter } from '@pixi/filter-glow';

export default class SuperGanhoScreen {
    private readonly app: PIXI.Application;
    public container: PIXI.Container;
    private confetti: any;
    private assets: any;

    constructor(app: PIXI.Application, assets: any) {
        this.app = app;
        this.assets = assets;
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        var confettiCanvas = document.createElement('canvas');        
        document.body.querySelector('#game-container')?.appendChild(confettiCanvas);
        confettiCanvas.style.position = 'absolute';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.zIndex = '1000';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.width = 360;
        confettiCanvas.height = 740;
        this.confetti = Conffeti.create(confettiCanvas, {
            resize: true,
            useWorker: true
        });
    }

    show(type: 'big' | 'super' | 'mega' | 'ultra', amount: number,) {
        setTimeout(() => this.generate(this.app.screen.width, this.app.screen.height, type, amount), 500)        
    }

    hide() {
        this.container.removeChildren();
    }

    private generate(appWidth: number, 
        appHeight: number,
        type: 'big' | 'super' | 'mega' | 'ultra', 
        amount: number = 0) {

        const stars = () => {
            var defaults = {
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['star'],
                colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
                };
                
                const shoot = () => {
                this.confetti({
                    ...defaults,
                    particleCount: 40,
                    scalar: 1.2,
                    shapes: ['star']
                });
                
                this.confetti({
                    ...defaults,
                    particleCount: 10,
                    scalar: 0.75,
                    shapes: ['circle']
                });
                }
    
                shoot();
        }
    
        const confettis = () => {
            var count = 200;
            var defaults = {
            origin: { y: 0.7 }
            };       
    
            const fire = (particleRatio: number, opts: any) => {
                this.confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }
    
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }

        let textWin = '';
        let winEffect = () => {};
        switch (type) {
            case 'big':
                textWin = 'Grande Ganho!';
                winEffect = () => Array(1).fill(0).forEach((_, idx) => setTimeout(confettis, idx*100))
                break;
            case 'super':
                textWin = 'Super Ganho!';
                winEffect = () => Array(3).fill(0).forEach((_, idx) => setTimeout(confettis, idx*100))
                break;
            case 'mega':
                textWin = 'Mega Ganho!';
                winEffect = () => Array(10).fill(0).forEach((_, idx) => setTimeout(confettis, idx*100))
                break
            case 'ultra':
                textWin = 'Ultra Ganho!';
                winEffect = () => Array(10).fill(0).forEach((_, idx) => setTimeout(stars, idx*100))
                break;
        }

        const text = new PIXI.BitmapText(textWin, { fontName: 'Font-SuperWin' });
        text.x = (appWidth - text.width) / 2;
        text.y = (appHeight) / 2 - text.height;
        winEffect();

        const textAmount = new PIXI.BitmapText(formatMoney(0), { fontName: 'Font-SuperWin' });
        textAmount.x = (appWidth - textAmount.width) / 2;
        textAmount.y = (appHeight) / 2 + 20;

        let flare = new PIXI.Sprite(this.assets['flare1']);
        flare.anchor.set(0.5);
        flare.x = appWidth / 2;
        flare.y = appHeight / 2;
        flare.scale.set(2);
        this.container.addChild(flare);

        // make it rotate
        this.app.ticker.add(() => {
            flare.rotation += 0.01;
            // make it expand and contract
            flare.scale.x = 2 + Math.sin(flare.rotation) * 0.2;
            flare.scale.y = 2 + Math.cos(flare.rotation) * 0.2;
            // add a bit of bounce
            text.y = (appHeight) / 2 - text.height + Math.sin(flare.rotation) * 10;
            textAmount.y = (appHeight) / 2 + 20 + Math.sin(flare.rotation) * 10;

        });

        // a black rectangle to cover the reels
        let radius = this.app.screen.width/2

        const bg = new PIXI.Graphics();
        bg.beginFill(0xffffff);
        bg.drawCircle(appWidth / 2, appHeight / 2, radius);
        bg.endFill();
        bg.alpha = 0;

        let glowFilter = new GlowFilter({
            distance: 10,
            outerStrength: 5,
            color: 0xffffff,
        });

        text.filters = [glowFilter]
        textAmount.filters = [glowFilter]

        let chest = new PIXI.Sprite(this.assets['chest1']);
        chest.anchor.set(0.5);
        chest.scale.set(0.7);
        chest.x = appWidth / 2;
        chest.y = appHeight / 2;

        this.container.addChild(bg, chest, text, textAmount);

        // animate textAmount until it reaches the final amount
        let startAmount = 0;
        let tick = () => {
            textAmount.text = formatMoney(startAmount+= Math.random() * amount / 120);
            textAmount.x = (appWidth - textAmount.width) / 2;

            if (startAmount >= amount) {                
                textAmount.text = formatMoney(amount);
                textAmount.x = (appWidth - textAmount.width) / 2;
                this.app.ticker.remove(tick)
            }
        }

        this.app.ticker.add(tick)

        // on bg click hide the screen
        bg.interactive = true;
        bg.on('pointerdown', () => {
            if(startAmount < amount)
                this.app.ticker.remove(tick)            

            this.hide()
        })   
    }   
    
}
