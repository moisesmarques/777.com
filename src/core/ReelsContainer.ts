import * as PIXI from 'pixi.js';
import Reel from './Reel';
import { AnimatedGIF } from '@pixi/gif';

export default class ReelsContainer {

    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;
    public NUMBER_OF_REELS = 3;
    public NUMBER_OF_ROWS = 3;
    public REEL_WIDTH = 0;
    public ROW_HEIGHT = 100;
    public REEL_HEIGHT = this.ROW_HEIGHT * this.NUMBER_OF_ROWS;

    constructor(app: PIXI.Application, symbols: Array<Array<PIXI.Sprite>>) {
        this.container = new PIXI.Container();
        this.REEL_WIDTH = app.screen.width * 0.85 / this.NUMBER_OF_REELS;


        for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, this);
            reel.generate(i, symbols[i]);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }
    }

    swapTextures(symbols: Array<Array<PIXI.Sprite>>){
        this.reels.forEach((reel, index) => {
            reel.slots.forEach((slot, index2) => {
                slot.removeChildren();
                let symbol = new PIXI.Sprite();
                symbol.texture = symbols[index][index2].texture;
                symbol.anchor.set(0.5);
                symbol.scale.set(0.7);

                symbol.x = this.REEL_WIDTH / 2;
                symbol.y = this.ROW_HEIGHT / 2;

                slot.addChild(symbol)
            })
        })
    }

    async spin(config: any) {
        
        const reelsToSpin = [...this.reels];
        let blurFilter = new PIXI.BlurFilter()
        blurFilter.blurX = 0
        blurFilter.blurY = 10
        this.reels.forEach(reel => reel.slots.forEach(slot => slot.filters = [blurFilter]))       
        let start = Date.now()

        while(true){
            await Promise.all(reelsToSpin.map(reel => reel.spin(config.speed)))
            
            if(Date.now() > start + config.until){
                reelsToSpin.shift()?.slots.forEach(slot => slot.filters = [])
                if(config.x10){
                    start = Date.now()
                    if(reelsToSpin.length === 1)
                        config.speed *= 0.5
                }
            }
            if(reelsToSpin.length === 0)
                break;
        }        
        config.callback()
    }
}
