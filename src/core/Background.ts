import * as PIXI from 'pixi.js';

export default class Background {
    public readonly sprite: PIXI.Container;
    private readonly texture: PIXI.Texture;

    constructor(loader: PIXI.Loader) {
        this.texture = PIXI.Texture.from('/assets/BG.jpg');
        this.sprite = new PIXI.Sprite(this.texture);
    }
}
