import { GlowFilter } from '@pixi/filter-glow';
import * as PIXI from 'pixi.js';

export default class ReelsWinResult {
    public readonly reels: Array<ReelWinResult> = [];
    public readonly container: PIXI.Container;    
    public numberOfReels = 3;
    public numberOfRows = 3;
    public reelWidth = 0;
    public rowHeight = 100;
    public lines: Array<PIXI.Graphics> = [];

    constructor(app: PIXI.Application, textures: Array<Array<PIXI.Texture>>) {
        
        this.container = new PIXI.Container();

        this.reelWidth = app.screen.width * 0.6 / this.numberOfReels;

        this.generateWinningLine([1,1,1]); // line 1 (middle)
        this.generateWinningLine([0,0,0]); // line 2 (top)
        this.generateWinningLine([2,2,2]); // line 3 (bottom)
        this.generateWinningLine([0,1,2]); // line 4 (diagonal left to right)
        this.generateWinningLine([2,1,0]); // line 5 (diagonal right to left)

        for (let i = 0; i < this.numberOfReels; i++) {
            const reel = new ReelWinResult(app, this.reelWidth, this.rowHeight, this.numberOfRows);
            reel.generate(i, textures[i]);
            this.reels.push(reel);
            this.container.addChild(reel.container);            
        }
    }
    
    show(lines: Array<number>, textures: Array<Array<PIXI.Texture>>){
        this.container.visible = true;
        
        lines.forEach(line => this.lines[line].visible = true)

        this.reels.forEach((reel, index) => {
            reel.slots.forEach((slot, index2) => {
                (slot.getChildAt(0) as PIXI.Sprite).texture = textures[index][index2]
            })
        })
    }

    hide(){
        this.container.visible = false;
        this.lines.forEach(line => line.visible = false)
    }

    generateWinningLine(winLine: Array<number>){
        // draw line on top of winning symbols
        const line = new PIXI.Graphics();
        line.lineStyle(4, 0xffffff, 1);        

        let diagCorrect = 50

        if(winLine[0] < winLine[this.numberOfReels - 1]){            
            line.moveTo(0, this.rowHeight * winLine[0] + this.rowHeight / 2 - diagCorrect);
            line.lineTo(this.reelWidth * this.numberOfReels, this.rowHeight * winLine[this.numberOfReels - 1] + this.rowHeight / 2 + diagCorrect);
        } else if(winLine[0] > winLine[this.numberOfReels - 1]){
            line.moveTo(0, this.rowHeight * winLine[0] + this.rowHeight / 2 + diagCorrect);
            line.lineTo(this.reelWidth * this.numberOfReels, this.rowHeight * winLine[this.numberOfReels - 1] + this.rowHeight / 2 - diagCorrect);
        } else{
            line.moveTo(0, this.rowHeight * winLine[0] + this.rowHeight / 2);
            line.lineTo(this.reelWidth * this.numberOfReels, this.rowHeight * winLine[this.numberOfReels - 1] + this.rowHeight / 2);
        }

        let glowFilter =new GlowFilter({ 
            color: 0xffffff,
            distance: 10,
            outerStrength: 4,
            innerStrength: 2,
         })           
        line.filters = [glowFilter]
        this.container.addChild(line);
        this.lines.push(line);
    }
}

class ReelWinResult {
    
    public readonly container: PIXI.Container;
    public slots: Array<PIXI.Container> = [];
    private readonly reelWidth: number;
    private readonly rowHeight: number;
    private readonly numberOfRows: number;
    
    constructor(app: PIXI.Application, reelWidth: number, rowHeight: number, numberOfRows: number) {
        this.container = new PIXI.Container()
        this.reelWidth = reelWidth;
        this.rowHeight = rowHeight;
        this.numberOfRows = numberOfRows;
    }

    generate(position: number, textures: Array<PIXI.Texture>){
        for (let i = 0; i < this.numberOfRows; i++) {
            
            const slot = new PIXI.Container();
            slot.width = this.reelWidth;
            slot.height = this.rowHeight;

            // put symbol inside of slot and position it in the middle
            const symbol = new PIXI.Sprite(textures[i]);
            symbol.scale.set(0.7);
            symbol.anchor.set(0.5);
            symbol.x = this.reelWidth / 2;
            symbol.y = this.rowHeight / 2;
            slot.addChild(symbol);

            let glowFilter =new GlowFilter({ 
                color: 0xffffff,
                distance: 10,
                outerStrength: 4,
                innerStrength: 2,
             })        

            slot.filters = [glowFilter]

            slot.x =  position * this.reelWidth;
            slot.y = i * this.rowHeight;
            this.slots.push(slot);
            this.container.addChild(slot);
        }
    }

}
