import * as PIXI from 'pixi.js';
import ReelsContainer from './ReelsContainer';

export default class Reel {
    
    public readonly container: PIXI.Container;
    public slots: Array<PIXI.Container> = [];
    private readonly ticker: PIXI.Ticker;
    private readonly reelsContainer: ReelsContainer;
    private readonly REEL_WIDTH: number;
    private readonly REEL_HEIGHT: number;
    private readonly ROW_HEIGHT: number;
    private readonly NUMBER_OF_ROWS: number;
    
    constructor(app: PIXI.Application, reelsContainer: ReelsContainer) {
        this.ticker = app.ticker;
        this.container = new PIXI.Container()
        this.reelsContainer = reelsContainer;
        this.REEL_WIDTH = this.reelsContainer.REEL_WIDTH;
        this.REEL_HEIGHT = this.reelsContainer.REEL_HEIGHT;
        this.ROW_HEIGHT = this.reelsContainer.ROW_HEIGHT;
        this.NUMBER_OF_ROWS = this.reelsContainer.NUMBER_OF_ROWS;
    }

    generate(position: number, textures: Array<PIXI.Texture>){
        for (let i = 0; i < this.NUMBER_OF_ROWS + 1; i++) {
            const symbol = new PIXI.Sprite(textures[i]);
            const slot = new PIXI.Container();
            slot.width = this.REEL_WIDTH;
            slot.height = this.ROW_HEIGHT;

            // put symbol inside of slot and position it in the middle
            symbol.scale.set(0.6)
            symbol.anchor.set(0.5);
            symbol.x = this.REEL_WIDTH / 2;
            symbol.y = this.ROW_HEIGHT / 2;
            slot.addChild(symbol);

            slot.x =  position * this.REEL_WIDTH;
            slot.y = (i - 1) * this.ROW_HEIGHT;
            this.slots.push(slot);
            this.container.addChild(slot);
        }
    }

    spinOneTime(speed: number) {
        let doneRunning = false;
        let yOffset = (this.REEL_HEIGHT - this.ROW_HEIGHT * this.NUMBER_OF_ROWS) / this.NUMBER_OF_ROWS / 2;

        return new Promise<void>(resolve => {
            const tick = () => {
                for (let i = this.slots.length - 1; i >= 0; i--) {

                    const slot = this.slots[i];

                    if (slot.y + speed > this.REEL_HEIGHT + yOffset) {
                        doneRunning = true;
                        speed = this.REEL_HEIGHT - slot.y + yOffset;
                        slot.y = -(this.ROW_HEIGHT + yOffset);
                    } else {
                        slot.y += speed;
                    }

                    if (i === 0 && doneRunning) {
                        let t = this.slots.pop();
                        if (t) this.slots.unshift(t);
                        this.ticker.remove(tick);
                        resolve();
                    }
                }
            }

            this.ticker.add(tick);
        });
    }
}
