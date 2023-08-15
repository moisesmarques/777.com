import * as PIXI from 'pixi.js';
import Reel from './Reel';

const REEL_OFFSET_LEFT = 60;
const NUMBER_OF_REELS = 3;

export default class ReelsContainer {
    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;

    constructor(app: PIXI.Application, assets: any) {
        
        this.container = new PIXI.Container();

        for (let i = 0; i < NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, i, assets);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        this.container.x = REEL_OFFSET_LEFT;
        this.container.y = -50;
    }

    async spin() {
        // Overall time of spinning = shiftingDelay * this.reels.length
        //
        const shiftingDelay = 500;
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
        return this.checkForWin(this.reels.map(reel => reel.sprites[2]));
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
            reel.sprites[0].texture = reel.textures[Math.floor(Math.random() * reel.textures.length)];
        });
    }
}
