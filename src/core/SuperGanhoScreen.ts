import * as PIXI from 'pixi.js';
import { formatMoney } from './utils';

export default class SuperGanhoScreen {
    public container: PIXI.Container;
    private readonly app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
    }

    show(type: 'big' | 'super' | 'mega' | 'ultra', amount: number,) {
        this.generate(this.app.screen.width, this.app.screen.height, type, amount);
    }

    hide() {
        this.container.removeChildren();
    }

    private generate(appWidth: number, 
        appHeight: number,
        type: 'big' | 'super' | 'mega' | 'ultra', 
        amount: number = 0) {

        let textWin = '';
        switch (type) {
            case 'big':
                textWin = 'Grande Ganho!';
                break;
            case 'super':
                textWin = 'Super Ganho!';
                break;
            case 'mega':
                textWin = 'Mega Ganho!';
                break
            case 'ultra':
                textWin = 'Ultra Ganho!';
                break;
        }

        const text = new PIXI.BitmapText(textWin, { fontName: 'Font-SuperWin' });
        text.x = (appWidth - text.width) / 2;
        text.y = (appHeight) / 2 - text.height;

        const textAmount = new PIXI.BitmapText(formatMoney(0), { fontName: 'Font-SuperWin' });
        textAmount.x = (appWidth - textAmount.width) / 2;
        textAmount.y = (appHeight) / 2 + 20;


        // a black rectangle to cover the reels
        let rectWidth = this.app.screen.width
        let rectHeight = text.height * 5
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000);
        bg.drawRect((appWidth - rectWidth) / 2, (appHeight-rectHeight) / 2, rectWidth, rectHeight);
        bg.endFill();

        this.container.addChild(bg, text, textAmount);

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
