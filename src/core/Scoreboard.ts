import * as PIXI from 'pixi.js';
import { formatMoney } from './utils';

export default class Scoreboard {
    public container: PIXI.Container;
    private wonText: PIXI.Text;
    private creditsText: PIXI.Text;
    private betText: PIXI.Text;    
    public credits: number = 0;
    public bet: number = 0;
    public won: number = 0;

    constructor(app: PIXI.Application) { 
        this.container = new PIXI.Container();

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 'white',
        });

        const textMaxSize = 120;

        this.creditsText = new PIXI.Text(`${formatMoney(this.credits)}` , style);
        this.creditsText.anchor.set(0.5, 0)
        const creditsTextContainer = new PIXI.Container()
        creditsTextContainer.x = textMaxSize * 0;
        creditsTextContainer.width = textMaxSize;
        creditsTextContainer.addChild(this.creditsText);

        this.betText = new PIXI.Text(`${formatMoney(this.bet)}` , style);
        this.betText.anchor.set(0.5, 0)
        const betTextContainer = new PIXI.Container();
        betTextContainer.x = textMaxSize * 1;
        betTextContainer.width = textMaxSize;
        betTextContainer.addChild(this.betText);

        this.wonText = new PIXI.Text(`${formatMoney(this.won)}` , style);
        this.wonText.anchor.set(0.5, 0)
        const wonTextContainer = new PIXI.Container();
        wonTextContainer.x = textMaxSize * 2;
        wonTextContainer.width = textMaxSize;
        wonTextContainer.addChild(this.wonText);

        this.container.x = app.screen.width / 2 - textMaxSize;
        this.container.y = app.screen.height - 200;

        this.container.addChild(creditsTextContainer, betTextContainer, wonTextContainer);
    }

    update(credits: number, bet: number, won: number) {
        this.credits = credits;
        this.bet = bet;
        this.won = won;
        this.creditsText.text = `${formatMoney(this.credits)}`;
        this.betText.text = `${formatMoney(this.bet)}`;
        this.wonText.text = `${formatMoney(this.won)}`;
    }
}
