import * as PIXI from 'pixi.js';
import PlayButton from './PlayButton';
import Background from './Background';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';

export default class Game {
    public app: PIXI.Application;
    private playBtn: PlayButton | undefined;
    private reelsContainer: ReelsContainer | undefined;
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
        this.reelsContainer = new ReelsContainer(this.app, this.assets);
        this.app.stage.addChild(this.reelsContainer.container);
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
        this.reelsContainer?.spin()
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
