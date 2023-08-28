import * as PIXI from 'pixi.js';

export default class Button {
    public readonly sprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly enabledTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;

    constructor(onClick: () => void,
        width: number,
        height: number,
        x: number,
        y: number,
        enabledTexture: PIXI.Texture,
        disableTexture: PIXI.Texture
        ) {
        this.onClick = onClick;       
        this.enabledTexture = enabledTexture;
        //this.enabledTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.disabledTexture = disableTexture;
        this.sprite = new PIXI.Sprite(this.enabledTexture);        
        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.interactive = true;
        this.sprite.anchor.set(0.5)
        this.sprite.x = x;
        this.sprite.y = y;        
        this.sprite.addListener('pointerdown', this.onClick);
    }

    setEnabled() {
        this.sprite.texture = this.enabledTexture;
        this.sprite.interactive = true;
    }

    setDisabled() {
        this.sprite.texture = this.disabledTexture;
        this.sprite.interactive = false;
    }
}
