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

    constructor(app: PIXI.Application, sbCredits: PIXI.Texture, sbBet: PIXI.Texture, sbWon: PIXI.Texture) { 
        this.container = new PIXI.Container();

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 'white',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 1,
            
        });

        const textMaxSize = app.screen.width * 0.8 / 3;
        const leftMargin = -30;

        this.creditsText = new PIXI.Text(`${formatMoney(this.credits)}` , style);
        this.creditsText.anchor.set(0.5, 0)
        const creditsTextContainer = new PIXI.Container()        
        creditsTextContainer.x = app.screen.width/3 + textMaxSize * 0 + leftMargin;
        creditsTextContainer.width = textMaxSize;
        sbCredits.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let creditsSprite = new PIXI.Sprite(sbCredits);
        creditsSprite.anchor.set(0, 0.5)
        creditsSprite.x = (textMaxSize + creditsSprite.width) * -0.5;
        creditsTextContainer.addChild(creditsSprite, this.creditsText);

        this.betText = new PIXI.Text(`${formatMoney(this.bet)}` , style);
        this.betText.anchor.set(0.5, 0)
        const betTextContainer = new PIXI.Container();
        betTextContainer.x = app.screen.width/3 + textMaxSize * 1 + leftMargin;
        betTextContainer.width = textMaxSize;
        sbBet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let betSprite = new PIXI.Sprite(sbBet);        
        betSprite.anchor.set(0, 0.5)
        betSprite.x = (textMaxSize + betSprite.width) * -0.5;
        betTextContainer.addChild(betSprite);
        betTextContainer.addChild(this.betText);

        this.wonText = new PIXI.Text(`${formatMoney(this.won)}` , style);
        this.wonText.anchor.set(0.5, 0)
        const wonTextContainer = new PIXI.Container();
        wonTextContainer.x = app.screen.width/3 + textMaxSize * 2 + leftMargin;
        wonTextContainer.width = textMaxSize;
        sbWon.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let wonSprite = new PIXI.Sprite(sbWon);
        wonSprite.anchor.set(0, 0.5)
        wonSprite.x = (textMaxSize + wonSprite.width) * -0.5;
        wonTextContainer.addChild(wonSprite);
        wonTextContainer.addChild(this.wonText);

        this.container.x = 0;
        this.container.y = app.screen.height - 200;

        let textBg = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRoundedRect(app.screen.width/2 - textMaxSize*1.5, -8, textMaxSize * 3, 30, 6)
            .endFill();


        this.container.addChild(textBg, creditsTextContainer, betTextContainer, wonTextContainer);
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
