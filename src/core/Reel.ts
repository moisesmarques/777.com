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
        for (let i = 0; i < this.NUMBER_OF_ROWS; i++) {
            const symbol = new PIXI.Sprite(textures[i]);            
            const slot = new PIXI.Container();
            slot.width = this.REEL_WIDTH;
            slot.height = this.ROW_HEIGHT;

            // put symbol inside of slot and position it in the middle
            symbol.scale.set(0.6);
            symbol.anchor.set(0.5);
            symbol.x = this.REEL_WIDTH / 2;
            symbol.y = this.ROW_HEIGHT / 2;
            slot.addChild(symbol);

            slot.x =  position * this.REEL_WIDTH;
            slot.y = i * this.ROW_HEIGHT;
            this.slots.push(slot);
            this.container.addChild(slot);
        }
    }

    // spin reel once with given speed
    spin(speed: number) {
        return new Promise(resolve => {
            let done = false;
            const tick = () => {
                // move all slots down
                this.slots.forEach(slot => {
                    slot.y += speed;
                    if (slot.y >= this.REEL_HEIGHT) {                        
                        // move slot to the top
                        slot.y -= this.REEL_HEIGHT + this.ROW_HEIGHT/4;
                    }

                    if(this.slots[0].y === 0)
                        done = true;
                })
                
                if (done) {
                    this.ticker.remove(tick);
                    resolve(null);
                }
            }
            this.ticker.add(tick);
        })
    }
}
