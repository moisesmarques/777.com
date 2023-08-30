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
    public linesGraphic: Array<PIXI.Graphics> = [];
    private resultInterval: NodeJS.Timeout | undefined;
    private amountsWinText: Array<PIXI.BitmapText> = [];

    constructor(app: PIXI.Application, textures: Array<Array<PIXI.Texture>>) {        
        this.app = app;
        this.container = new PIXI.Container();
        this.reelWidth = app.screen.width * 0.8 / this.numberOfReels;
    }
    
    show(winningLines: Array<number>, amountPerLine: Array<number>, textures: Array<Array<PIXI.Texture>>){

        let symbolsByLine = [
            [3,4,5],
            [0,1,2],
            [6,7,8],
            [0,4,8],
            [2,4,6]
        ]

        winningLines.forEach(line => this.generateWinningLine(line))
        // show symbols for winning line
        const symbolsContainer = new PIXI.Container();

        for (let j = 0; j < this.numberOfRows; j++) {
            for (let i = 0; i < this.numberOfReels; i++) {
                const symbol = new PIXI.Sprite(textures[i][j]);            
                symbol.scale.set(0.6);
                symbol.anchor.set(0.5);
                symbol.x = this.reelWidth / 2 + i * this.reelWidth;
                symbol.y = this.rowHeight / 2 + j * this.rowHeight;
                symbol.visible = false
                symbolsContainer.addChild(symbol);
            }
        }
        this.container.addChild(symbolsContainer);

        winningLines.forEach((line) => this.generateWinningLineText(line, amountPerLine[line]))

        // animate and toggle winning line symbols
        let lineIndex = 0
        let showingLine = winningLines[lineIndex]

        symbolsByLine[showingLine].forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = true)
        this.linesGraphic[lineIndex].visible = true
        // alternate between showing and hiding symbols for each line
        this.resultInterval = setInterval(() => {
            symbolsByLine[showingLine].forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = false)
            this.linesGraphic[lineIndex].visible = false
            this.amountsWinText[lineIndex].visible = false
            lineIndex++
            if(lineIndex === winningLines.length)
                lineIndex = 0
            showingLine = winningLines[lineIndex]
            symbolsByLine[showingLine].forEach(symbol => (symbolsContainer.getChildAt(symbol) as PIXI.Sprite).visible = true)
            this.linesGraphic[lineIndex].visible = true
            this.amountsWinText[lineIndex].visible = true
        }, 1000)
        
    }

    hide(){
        this.resultInterval && clearInterval(this.resultInterval)
        this.container.removeChildren()
        this.amountsWinText = []
        this.linesGraphic = []
    }

    generateWinningLineText(lineNumber: number, amount: number){
        let text = new PIXI.BitmapText(formatMoney(amount), { fontName: 'Font-LineAmount' });
        // center text
        text.x = (this.reelWidth*this.numberOfReels - text.width) / 2;

        let lineY = 0;

        if([0,3,4].includes(lineNumber)){
            lineY = this.rowHeight + this.rowHeight / 2 // center
        } else if(lineNumber == 1){
            lineY = this.rowHeight / 2 // first
        } else if(lineNumber == 2){
            lineY = this.rowHeight * 2 + this.rowHeight / 2 // last
        }

        text.y = lineY
        text.visible = false
        this.container.addChild(text)
        this.amountsWinText.push(text)
    }

    generateWinningLine(winLine: number){
        // draw line on top of winning symbols
        const line = new PIXI.Graphics();
        line.lineStyle(4, 0x000000, 1);        

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
        text.x = xstart-25
        text.y = ystart
        this.container.addChild(text)

        this.linesGraphic.push(line)
    }
}
