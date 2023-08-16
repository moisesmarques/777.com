import * as PIXI from 'pixi.js';

export default class PlayButton {
    public readonly sprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly activeTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;

    constructor(app: PIXI.Application, assets: any, onClick: () => void) {
        this.onClick = onClick;
        this.activeTexture = assets.buttonEnabled;
        this.disabledTexture = assets.buttonDisabled;
        this.sprite = new PIXI.Sprite(this.activeTexture);
        this.init(app.screen.width, app.screen.height);
    }

    setEnabled() {
        this.sprite.texture = this.activeTexture;
        this.sprite.interactive = true;
    }

    setDisabled() {
        this.sprite.texture = this.disabledTexture;
        this.sprite.interactive = false;
    }

    private init(appWidth: number, appHeight: number) {
        this.sprite.x = (appWidth - this.sprite.width) / 2;
        this.sprite.y = appHeight - this.sprite.height - 60;
        this.sprite.interactive = true;
        this.sprite.addListener('pointerdown', this.onClick);
    }
}
