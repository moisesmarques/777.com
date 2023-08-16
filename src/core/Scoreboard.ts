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
    private money: number = 100000500;
    private bet: number = 50000;
    private winAmount: number = 0;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 'white',
        });


        this.moneyText = new PIXI.Text(`R$ ${formatMoney(this.money)}` , style);
        this.moneyText.x = 60;

        this.betText = new PIXI.Text(`R$ ${formatMoney(this.bet)}` , style);
        this.betText.x = 250;

        this.winAmountText = new PIXI.Text(`R$ ${formatMoney(this.winAmount)}` , style);
        this.winAmountText.x = 440;

        this.container.x = 0;
        this.container.y = app.screen.height - 200;

        this.container.addChild(this.moneyText, this.betText, this.winAmountText);

        const q1 = new PIXI.Graphics();
        q1.beginFill(0xffff00);
        q1.drawRect(0, 0, 24, 24);
        q1.endFill();
        q1.x = 30;
        q1.y = -6;

        const q2 = q1.clone();
        q2.x = 220;
        q2.y = -6;

        const q3 = q1.clone();
        q3.x = 410;
        q3.y = -6;
        
        this.container.addChild(q1);
        this.container.addChild(q2);
        this.container.addChild(q3);


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
