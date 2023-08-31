import * as PIXI from 'pixi.js';
import Reel from './Reel';

export default class ReelsContainer {

    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;    
    public spinAudio: HTMLAudioElement;
    public NUMBER_OF_REELS = 3;
    public NUMBER_OF_ROWS = 3;
    public REEL_WIDTH = 0;
    public ROW_HEIGHT = 100;
    public REEL_HEIGHT = this.ROW_HEIGHT * this.NUMBER_OF_ROWS;

    constructor(app: PIXI.Application, textures: Array<Array<PIXI.Texture>>) {
        this.container = new PIXI.Container();
        this.REEL_WIDTH = app.screen.width * 0.85 / this.NUMBER_OF_REELS;
        this.spinAudio = new Audio('../../assets/spin.mp3')       


        for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, this);
            reel.generate(i, textures[i]);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }
    }

    swapTextures(textures: Array<Array<PIXI.Texture>>){
        this.reels.forEach((reel, index) => {
            reel.slots.forEach((slot, index2) => {
                (slot.getChildAt(0) as PIXI.Sprite).texture = textures[index][index2]
            })
        })
    }

    async spin(config: any) {
        
        const reelsToSpin = [...this.reels];
        this.spinAudio.currentTime = 0
        this.spinAudio.play()
        let blurFilter = new PIXI.BlurFilter()
        blurFilter.blurX = 0
        blurFilter.blurY = 4
        this.reels.forEach(reel => reel.slots.forEach(slot => slot.getChildAt(0).filters = [blurFilter]))       

        while(true){
            await Promise.all(reelsToSpin.map(reel => reel.spin(config.speed)))
            if(Date.now() > config.until){
                let reelOff = reelsToSpin.shift()
                reelOff?.slots.forEach(slot => slot.getChildAt(0).filters = [])
            }
            if(reelsToSpin.length === 0)
                break;
        }        

        this.spinAudio.pause()
        config.callback()
    }
}
