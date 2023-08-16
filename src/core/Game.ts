import * as PIXI from 'pixi.js';
import PlayButton from './PlayButton';
import Background from './Background';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';

export default class Game {
    public app: PIXI.Application;
    private playBtn: PlayButton | undefined;
    private reels: ReelsContainer | undefined;
    private scoreboard: Scoreboard | undefined;
    private victoryScreen: VictoryScreen | undefined;
    private assets:any;

    constructor(container: HTMLElement) {
        this.app = new PIXI.Application({
            resizeTo: container,
            backgroundColor: 0x1099bb,
        });

        container.appendChild(this.app.view as HTMLCanvasElement);

        PIXI.Assets.addBundle('symbols', {
            bar: '../../assets/BAR.png',
            bar2x: '../../assets/2xBAR.png',
            bar3x: '../../assets/3xBAR.png',
            seven: '../../assets/7.png',
            cherry: '../../assets/Cherry.png',
            berry: '../../assets/Berry.png',
            buttonEnabled: '../../assets/buttonEnabled.png',
            buttonDisabled: '../../assets/buttonDisabled.png',
        });

        PIXI.Assets.loadBundle('symbols').then((assets) => {
            this.assets = assets;
            this.init();        
        });
    }

    private init() {
        this.createScene();        
        this.createReels();
        this.createScoreboard();
        this.createVictoryScreen();
        this.createPlayButton();
    }

    private createScene() {
        // const bg = new Background(this.assets);
        // this.app.stage.addChild(bg.sprite);
    }

    private createPlayButton() {
        this.playBtn = new PlayButton(this.app, this.assets, this.handleStart.bind(this));
        this.app.stage.addChild(this.playBtn.sprite);
    }

    private createReels() {
        this.reels = new ReelsContainer(this.app, this.assets);  
        
        const reelsWidth = this.reels.NUMBER_OF_REELS * this.reels.REEL_WIDTH
        const reelsHeight = this.reels.NUMBER_OF_ROWS * this.reels.ROW_HEIGHT
        this.reels.container.x = this.app.screen.width / 2 - reelsWidth / 2;
        this.reels.container.y = 100;

        let reelTop = new PIXI.Sprite(PIXI.Texture.WHITE);
        reelTop.width = reelsWidth;
        reelTop.height = this.reels.ROW_HEIGHT;
        reelTop.x = this.reels.container.x;
        reelTop.y = this.reels.container.y - reelTop.height;

        let reelBottom = new PIXI.Sprite(PIXI.Texture.WHITE);        
        reelBottom.width = reelsWidth;
        reelBottom.height = this.reels.ROW_HEIGHT;
        reelBottom.x = this.reels.container.x;
        reelBottom.y = this.reels.container.y + reelsHeight;

        this.reelBg(0, this.reels)
        this.reelBg(2, this.reels)
        
        this.app.stage.addChild(this.reels.container);
        this.app.stage.addChild(reelTop);
        this.app.stage.addChild(reelBottom);        

    }

    private reelBg(position: number, reels: ReelsContainer){
        let reelBgBlink = new PIXI.Sprite(PIXI.Texture.WHITE);
        reelBgBlink.width = reels.REEL_WIDTH;
        reelBgBlink.height = reels.REEL_HEIGHT;
        reelBgBlink.x = reels.container.x + (reelBgBlink.width * position);
        reelBgBlink.y = reels.container.y;
        reelBgBlink.alpha = 0.5;
        this.app.stage.addChild(reelBgBlink);
    }

    private createScoreboard() {
        this.scoreboard = new Scoreboard(this.app);
        this.app.stage.addChild(this.scoreboard.container);
    }

    private createVictoryScreen() {
        this.victoryScreen = new VictoryScreen(this.app);
        if(this.victoryScreen && this.victoryScreen.container)
            this.app.stage.addChild(this.victoryScreen.container);
    }

    handleStart() {
        this.scoreboard?.decrement();
        this.playBtn?.setDisabled();
        this.reels?.spin()
            .then(this.processSpinResult.bind(this));
    }

    private processSpinResult(isWin: boolean) {
        if (isWin) {
            this.scoreboard?.increment();
            this.victoryScreen?.show();
        }

        if (!this.scoreboard?.outOfMoney) this.playBtn?.setEnabled();
    }
}
