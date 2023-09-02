import * as PIXI from 'pixi.js';
import { formatMoney } from './utils';
import Scoreboard from './Scoreboard';
import { toast } from 'react-toastify';

export default class BetSettingsMenu {
    public container: PIXI.Container;
    private readonly app: PIXI.Application;

    constructor(app: PIXI.Application, scoreBoard: Scoreboard, betOptions: number[]) {
        this.app = app;
        this.container = new PIXI.Container();
        
        // draw a gray rectangle
        const bg = new PIXI.Graphics();
        bg.beginFill(0x282833);
        bg.drawRect(0, 0, app.screen.width, app.screen.height*0.6);
        bg.endFill();
        bg.interactive = true;
        
        // draw a gray rectangle for header
        const header = new PIXI.Graphics();
        header.beginFill(0x30303d);
        header.drawRect(0, 0, app.screen.width, 50);
        header.endFill();

        const headerText = new PIXI.Text('Bet Options', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 'white',
        });
        headerText.resolution = 2;
        headerText.anchor.set(0.5);
        headerText.x = app.screen.width / 2;
        headerText.y = 25;
        header.addChild(headerText);
        
        const closeButton = new PIXI.Graphics();
        closeButton.beginFill(0x40404d);
        closeButton.drawCircle(0, 0, 15);
        closeButton.endFill();

        const closeButtonText = new PIXI.Text('X', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 'white',
        });

        closeButtonText.resolution = 2;
        closeButtonText.anchor.set(0.5);
        closeButton.addChild(closeButtonText);
        closeButton.x = app.screen.width - 30;
        closeButton.y = 25;

        closeButton.interactive = true;
        closeButton.on('pointerdown', () => {
            this.hide();
        });

        header.addChild(closeButton);        

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
        });

        const createText = (bet: number, lines: number, y: number) => {
            let item = new PIXI.Graphics();
            item.beginFill(0x30303d);
            item.drawRect(0, 0, app.screen.width, 30);
            item.endFill();
            item.interactive = true;
            item.on('pointerover', () => {
                item.beginFill(0x40404d);
                item.drawRect(0, 0, app.screen.width, 30);
                item.endFill();
            });
            item.on('pointerout', () => {
                item.beginFill(0x30303d);
                item.drawRect(0, 0, app.screen.width, 30);
                item.endFill();
            });

            item.on('pointerdown', () => {
                let betAmount = bet * lines;
                if(scoreBoard.credits < betAmount){
                    toast.warn('Créditos insuficientes');
                    return;
                }

                scoreBoard.update(scoreBoard.credits, betAmount, scoreBoard.won)
                this.hide();
            });

            let tab = '\t\t\t\t\t\t\t\t'
            let totalBet = formatMoney(bet * lines);
            if(totalBet.length < 5){
                totalBet = '\t\t' + totalBet
            }

            let itemText = new PIXI.Text(`${formatMoney(bet)}${tab}x${tab}${lines}${tab}=${tab}${totalBet}`, style);
            itemText.resolution = 2;
            itemText.anchor.set(0.5);
            itemText.x = item.width / 2;
            itemText.y = item.height / 2;
            item.addChild(itemText);
            item.y = y;
            return item;
        }

        let itemsHeaderText = new PIXI.Text(`\t\tBet Size\t\t\t\t\t\t\t\t\t\t\t\t\tLines\t\t\t\t\t\t\t\t\t\t\t\tBet Amount`, style);
        itemsHeaderText.resolution = 2;
        itemsHeaderText.anchor.set(0.5);
        itemsHeaderText.x = app.screen.width / 2;
        itemsHeaderText.y = 70;

        let itemY = 50;
        let items = betOptions.map(opt => createText(opt/5, 5, itemY += 40));
        this.container.addChild(bg, header, itemsHeaderText, ...items);
        this.container.y = app.screen.height;
        app.stage.addChild(this.container);
    }

    show() {
        let tick = () => {
            if (this.container.y -30 > this.app.screen.height - this.container.height) {
                this.container.y -= 30;
                return
            }
            this.app.ticker.remove(tick);
        }
        this.app.ticker.add(tick);
    }

    hide() {
        let tick = () => {
            if (this.container.y < this.app.screen.height) {
                this.container.y += 30;
                return
            }
            this.app.ticker.remove(tick);
        }        
        this.app.ticker.add(tick);
    }

}
