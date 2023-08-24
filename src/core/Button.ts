import * as PIXI from 'pixi.js';

export default class Button {
    public readonly sprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly enableTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;

    constructor(app: PIXI.Application, 
        onClick: () => void,
        width: number,
        height: number,
        x: number,
        y: number,
        enableTexture: PIXI.Texture,
        disableTexture: PIXI.Texture
        ) {
        this.onClick = onClick;       
        this.enableTexture = enableTexture;
        this.disabledTexture = disableTexture;
        this.sprite = new PIXI.Sprite(this.enableTexture);
        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.interactive = true;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.addListener('pointerdown', this.onClick);
    }

    setEnabled() {
        this.sprite.texture = this.enableTexture;
        this.sprite.interactive = true;
    }

    setDisabled() {
        this.sprite.texture = this.disabledTexture;
        this.sprite.interactive = false;
    }
}
