import * as PIXI from 'pixi.js';
import Reel from './Reel';

export default class ReelsContainer {
    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;
    public NUMBER_OF_REELS = 3;
    public NUMBER_OF_ROWS = 3;
    public REEL_WIDTH = 140;
    public ROW_HEIGHT = 80;
    public REEL_HEIGHT = this.ROW_HEIGHT * this.NUMBER_OF_ROWS;

    constructor(app: PIXI.Application, assets: any) {
        
        this.container = new PIXI.Container();

        //this.container.width = reelContainerWidth;

        for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, assets, i, this);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }
    }

    async spin() {
        // Overall time of spinning = shiftingDelay * this.reels.length
        //
        const shiftingDelay = 800;
        const start = Date.now();
        const reelsToSpin = [...this.reels];
        
        for await (let value of this.infiniteSpinning(reelsToSpin)) {
            
            const shiftingWaitTime = (this.reels.length - reelsToSpin.length + 1) * shiftingDelay;
            
            if (Date.now() >= start + shiftingWaitTime) {
                reelsToSpin.shift();
            }

            if (!reelsToSpin.length) break;
        }

        // reel.sprites[2] - Middle visible symbol of the reel
        //
        return this.checkForWin(this.reels.map(reel => reel.slots[2].getChildAt(0) as PIXI.Sprite));
    }

    private async* infiniteSpinning(reelsToSpin: Array<Reel>) {
        while (true) {
            const spinningPromises = reelsToSpin.map(reel => reel.spinOneTime());
            await Promise.all(spinningPromises);
            this.blessRNG();
            yield;
        }
    }

    private checkForWin(symbols: Array<PIXI.Sprite>): boolean {
        // Set of strings: 'SYM1', 'SYM2', ...
        //
        const combination: Set<string> = new Set();
        symbols.forEach(symbol => combination.add(symbol.texture.textureCacheIds[1]));
        if (combination.size === 1 && !combination.has('seven')) return true;
        return combination.size === 2 && combination.has('seven');
    }

    private blessRNG() {
        this.reels.forEach(reel => {
            (reel.slots[0].getChildAt(0) as PIXI.Sprite).texture = reel.textures[Math.floor(Math.random() * reel.textures.length)];
        });
    }
}
