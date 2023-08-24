import * as PIXI from 'pixi.js';
import Reel from './Reel';

export default class ReelsContainer {
    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;    
    public readonly textures: Array<PIXI.Texture>;
    public spinAudio: HTMLAudioElement;
    public NUMBER_OF_REELS = 3;
    public NUMBER_OF_ROWS = 5;
    public REEL_WIDTH = 0;
    public ROW_HEIGHT = 70;
    public REEL_HEIGHT = this.ROW_HEIGHT * this.NUMBER_OF_ROWS;

    constructor(app: PIXI.Application) {
        
        this.container = new PIXI.Container();

        this.REEL_WIDTH = app.screen.width * 0.8 / this.NUMBER_OF_REELS;

        const bar = PIXI.Texture.from('../../assets/BAR.png')
        const bar2x = PIXI.Texture.from('../../assets/2xBAR.png')
        const bar3x = PIXI.Texture.from('../../assets/3xBAR.png')
        const seven = PIXI.Texture.from('../../assets/7.png')
        const cherry = PIXI.Texture.from('../../assets/Cherry.png')
        const berry = PIXI.Texture.from('../../assets/Berry.png')

        this.spinAudio = new Audio('../../assets/spin.mp3')
        
        this.textures = [            
            bar,
            cherry,
            seven,
            bar3x,
            berry,
            bar2x,            
        ];

        for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, this);
            let mixTextures = this.textures.sort(() => Math.random() - 0.5)
            reel.generate(i, mixTextures);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }
    }

    async spin(config: any) {
        
        const reelsToSpin = [...this.reels];
        this.spinAudio.play()

        while (true) {
            
            await Promise.all(reelsToSpin.map(reel => reel.spinOneTime(config.speed)));
            
            if (Date.now() >= config.spinUntil) {                
                if((reelsToSpin[0].slots[2].getChildAt(0) as PIXI.Sprite).texture.textureCacheIds[0] == config.result[0]){
                    config.result.shift()
                    reelsToSpin.shift()
                    let reelsSpined = (this.reels.length - reelsToSpin.length + 1)
                    config.speed = config.speed * reelsSpined * 0.5;
                    config.spinUntil = Date.now() + reelsSpined * 1000;
                }
                
            }            

            if (!reelsToSpin.length) break;
        }
        this.spinAudio.pause()
        config.callback()
    }
}
