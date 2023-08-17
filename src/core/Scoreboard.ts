import * as PIXI from 'pixi.js';

const formatMoney = (number: number) => new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);

export default class Scoreboard {
    public container: PIXI.Container;
    public outOfMoney = false;
    private winAmountText: PIXI.Text;
    private moneyText: PIXI.Text;
    private betText: PIXI.Text;    
    private money: number = 999999.99;
    private bet: number = 9.99;
    private winAmount: number = 0;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 'white',
        });

        const textMaxSize = 130;

        this.moneyText = new PIXI.Text(`R$ ${formatMoney(this.money)}` , style);
        this.moneyText.anchor.set(0.5, 0)
        const moneyTextContainer = new PIXI.Container()
        moneyTextContainer.x = textMaxSize * 0;
        moneyTextContainer.width = textMaxSize;
        moneyTextContainer.addChild(this.moneyText);

        this.betText = new PIXI.Text(`R$ ${formatMoney(this.bet)}` , style);
        this.betText.anchor.set(0.5, 0)
        const betTextContainer = new PIXI.Container();
        betTextContainer.x = textMaxSize * 1;
        betTextContainer.width = textMaxSize;
        betTextContainer.addChild(this.betText);

        this.winAmountText = new PIXI.Text(`R$ ${formatMoney(this.winAmount)}` , style);
        this.winAmountText.anchor.set(0.5, 0)
        const winAmountTextContainer = new PIXI.Container();
        winAmountTextContainer.x = textMaxSize * 2;
        winAmountTextContainer.width = textMaxSize;
        winAmountTextContainer.addChild(this.winAmountText);

        this.container.x = app.screen.width / 2 - textMaxSize;
        this.container.y = app.screen.height - 200;

        this.container.addChild(moneyTextContainer, betTextContainer, winAmountTextContainer);

       

    }

    decrement() {
        if (!this.outOfMoney) {
            this.money -= this.bet;
            this.moneyText.text = `R$ ${formatMoney(this.money)}`;
        }
        if (this.money - this.bet < 0) {
            this.outOfMoney = true;
        }
    }

    increment() {
        this.money += this.bet * 3;
        this.moneyText.text = `R$ ${formatMoney(this.money)}`;

        this.winAmount += this.bet * 3;
        this.winAmountText.text = `R$ ${formatMoney(this.winAmount)}`;

        if (this.outOfMoney)
            this.outOfMoney = false;
    }

}
