import { GlowFilter } from '@pixi/filter-glow';
import * as PIXI from 'pixi.js';
import { formatMoney } from './utils';
export default class ReelsWinResult {
    private readonly app: PIXI.Application;
    public readonly container: PIXI.Container;    
    public numberOfReels = 3;
    public numberOfRows = 3;
    public reelWidth = 0;
    public rowHeight = 100;
    private intervals = new Array<NodeJS.Timeout>();

    constructor(app: PIXI.Application, textures: Array<Array<PIXI.Texture>>) {        
        this.app = app;
        this.container = new PIXI.Container();
        this.reelWidth = app.screen.width * 0.85 / this.numberOfReels;        
    }
    
    async show(winningLines: Array<number>, amountPerLine: Array<number>, textures: Array<Array<PIXI.Texture>>){
        setTimeout(() => this.generateResult(winningLines, amountPerLine, textures), 500)        
    }

    generateResult(winningLines: Array<number>, amountPerLine: Array<number>, textures: Array<Array<PIXI.Texture>>){
        let symbolsByLine = [
            [3,4,5],
            [0,1,2],
            [6,7,8],
            [0,4,8],
            [2,4,6]
        ]
        // generate a overlay
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.5);
        overlay.drawRoundedRect(0, 0, this.reelWidth * this.numberOfRows, this.rowHeight * this.numberOfRows, 50);
        overlay.endFill();
        this.container.addChild(overlay);

        let winningLinesGraphic = winningLines.map(line => this.generateWinningLine(line))

        // show symbols for winning line
        const symbolsContainer = new PIXI.Container();

        for (let j = 0; j < this.numberOfRows; j++) {
            for (let i = 0; i < this.numberOfReels; i++) {
                const symbol = new PIXI.Sprite(textures[i][j]);            
                symbol.scale.set(0.7);
                symbol.anchor.set(0.5);
                symbol.x = this.reelWidth / 2 + i * this.reelWidth;
                symbol.y = this.rowHeight / 2 + j * this.rowHeight;
                symbol.visible = false
                symbolsContainer.addChild(symbol);
            }
        }
        this.container.addChild(symbolsContainer);

        let amountsWinText = winningLines.map((line) => this.generateWinningLineText(line, amountPerLine[line]))

        // generate winning line text for total amount
        let totalAmount = amountPerLine.reduce((a, b) => a + b, 0)
        amountsWinText.push(this.generateWinningLineText(amountPerLine.length, totalAmount))

        // animate and toggle winning line symbols
        let lineIndex = winningLines.length

        const animateWinningResult = (winningLinesGraphic: Array<PIXI.Graphics>, amountsWinText: Array<PIXI.BitmapText>) => {
            // hide all symbols and lines
            symbolsByLine.forEach(line => line.forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = false))
            winningLinesGraphic.forEach(line => line.visible = false)
            amountsWinText.forEach(text => text.visible = false)

            if(lineIndex === winningLines.length){
                lineIndex = 0
                //show sum of winning lines
                winningLines.forEach( (winLine, idx) => {
                    symbolsByLine[winLine].forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = true)    
                    winningLinesGraphic[idx].visible = true
                })
                amountsWinText[amountsWinText.length-1].visible = true
            }else{
                //show winning line
                symbolsByLine[winningLines[lineIndex]].forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = true)
                winningLinesGraphic[lineIndex].visible = true
                amountsWinText[lineIndex].visible = true
                lineIndex++
            }
        }

        animateWinningResult(winningLinesGraphic, amountsWinText);
        // alternate between showing and hiding symbols for each line
        this.intervals.push(setInterval( () => { animateWinningResult(winningLinesGraphic, amountsWinText) }, 1000))
    }

    hide(){
        this.intervals.forEach(interval => clearInterval(interval))
        this.container.removeChildren()
    }

    generateWinningLineText(lineNumber: number, amount: number){
        let text = new PIXI.BitmapText(formatMoney(amount), { fontName: 'Font-LineAmount' });
        // center text
        text.x = (this.reelWidth*this.numberOfReels - text.width) / 2;

        let lineY = 0;

        if([0,3,4,5].includes(lineNumber)){
            lineY = this.rowHeight + this.rowHeight / 2 // center
        } else if(lineNumber == 1){
            lineY = this.rowHeight / 2 // first
        } else if(lineNumber == 2){
            lineY = this.rowHeight * 2 + this.rowHeight / 2 // last
        }

        let glowFilter = new GlowFilter({
            distance: 10,
            outerStrength: 5,
            quality: 0.2,
            color: 0xffffff,
        });
        text.filters = [glowFilter]

        text.y = lineY
        text.visible = false
        this.container.addChild(text)

        return text;
    }

    generateWinningLine(winLine: number){
        // draw line on top of winning symbols
        const line = new PIXI.Graphics();
        line.lineStyle(4, 0xffba00, 1);        

        let diagCorrect = 50
        let xstart = 0;
        let ystart = 0;
        let xend = 0;
        let yend = 0;          

        if(winLine == 3){            
            xend = this.reelWidth * this.numberOfReels
            ystart = this.rowHeight / 2 - diagCorrect
            yend = this.rowHeight * this.numberOfRows + this.rowHeight / 2 - diagCorrect
        } else if(winLine == 4){
            xend = this.reelWidth * this.numberOfReels
            ystart = this.rowHeight * this.numberOfRows + this.rowHeight / 2 - diagCorrect
            yend = this.rowHeight / 2 - diagCorrect
        } else{
            let winLineMod = winLine === 0 ? 1 : winLine === 1 ? 0 : winLine
            xend = this.reelWidth * this.numberOfReels
            ystart = this.rowHeight * winLineMod + this.rowHeight / 2
            yend = this.rowHeight * winLineMod + this.rowHeight / 2
        }

        line.moveTo(xstart, ystart);
        line.lineTo(xend, yend);
        line.visible = false;
        this.container.addChild(line);

        let text = new PIXI.BitmapText( `${winLine+1}`, { fontName: 'Font-LineNumber' });
        text.anchor.set(0.5)
        text.x = xstart-15
        text.y = ystart
        this.container.addChild(text)

        return line;
    }
}
