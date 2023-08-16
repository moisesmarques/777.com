import * as PIXI from 'pixi.js';
import ReelsContainer from './ReelsContainer';

export default class Reel {
    
    public readonly container: PIXI.Container;
    public readonly textures: Array<PIXI.Texture>;
    public slots: Array<PIXI.Container> = [];
    private readonly ticker: PIXI.Ticker;
    private readonly reelsContainer: ReelsContainer;
    
    constructor(app: PIXI.Application, assets: any, position: number, reelsContainer: ReelsContainer) {
        this.ticker = app.ticker;
        this.container = new PIXI.Container()

        this.textures = [
            assets.bar,
            assets.bar2x,
            assets.bar3x,
            assets.cherry,
            assets.seven,
            assets.berry,
        ];
        this.reelsContainer = reelsContainer;

        this.generate(position);
    }

    private generate(position: number) {

        const REEL_WIDTH = this.reelsContainer.REEL_WIDTH;
        const ROW_HEIGHT = this.reelsContainer.ROW_HEIGHT;
        const NUMBER_OF_ROWS = this.reelsContainer.NUMBER_OF_ROWS;

        for (let i = 0; i < NUMBER_OF_ROWS + 1; i++) {

            const symbol = new PIXI.Sprite(this.textures[Math.floor(Math.random() * this.textures.length)]);
            const slot = new PIXI.Container();
            slot.width = REEL_WIDTH;
            slot.height = ROW_HEIGHT;

            // put symbol inside of slot and position it in the middle
            symbol.scale.set(0.6)
            symbol.anchor.set(0.5);
            symbol.x = REEL_WIDTH / 2;
            symbol.y = ROW_HEIGHT / 2;
            slot.addChild(symbol);

            slot.x =  position * REEL_WIDTH;
            slot.y = (i - 1) * ROW_HEIGHT;
            this.slots.push(slot);
            this.container.addChild(slot);
        }
    }

    spinOneTime() {
        let speed = 30;
        let doneRunning = false;
        const REEL_HEIGHT = this.reelsContainer.REEL_HEIGHT;
        const ROW_HEIGHT = this.reelsContainer.ROW_HEIGHT;
        const NUMBER_OF_ROWS = this.reelsContainer.NUMBER_OF_ROWS;

        let yOffset = (REEL_HEIGHT - ROW_HEIGHT * NUMBER_OF_ROWS) / NUMBER_OF_ROWS / 2;

        return new Promise<void>(resolve => {
            const tick = () => {
                for (let i = this.slots.length - 1; i >= 0; i--) {

                    const slot = this.slots[i];

                    if (slot.y + speed > REEL_HEIGHT + yOffset) {
                        doneRunning = true;
                        speed = REEL_HEIGHT - slot.y + yOffset;
                        slot.y = -(ROW_HEIGHT + yOffset);
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
