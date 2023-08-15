import * as PIXI from 'pixi.js';

export default class VictoryScreen {
    public container: PIXI.Container | undefined;
    private overlay: PIXI.Graphics | undefined;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.generate(app.screen.width, app.screen.height);
    }

    show() {
        if(this.container) this.container.visible = true;

        const id = window.setTimeout(this.hide.bind(this), 3000);
        const handler = () => {
            window.clearTimeout(id);
            this.hide();
        };
        this.overlay?.addListener('pointerdown', handler.bind(this));
    }

    hide() {
        if(this.container) this.container.visible = false;
    }

    private generate(appWidth: number, appHeight: number) {
        if(this.container) this.container.visible = false;

        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0xFFFFFF, 0.001);
        this.overlay.drawRect(0, 0, appWidth, appHeight);
        this.overlay.endFill();
        this.overlay.interactive = true;
        // this.overlay.buttonMode = true;
        this.overlay.cursor = 'default';

        const rect = new PIXI.Graphics();
        rect.beginFill(0x02474E, 0.8);
        rect.drawRect(0, 0, appWidth, 400);
        rect.x = 0;
        rect.y = (appHeight - rect.height) / 2;
        rect.endFill();

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 'yellow',
        });

        const text = new PIXI.Text('YOU WON!', style);
        text.x = (rect.width - text.width) / 2;
        text.y = (appHeight - text.height) / 2;

        this.container?.addChild(rect, text, this.overlay);
    }
}
