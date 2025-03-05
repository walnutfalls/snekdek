import Grid from './Grid';



import { Application } from 'pixi.js';

export default class GameLoop {
    constructor(sprites, onPlayerDied) {
        this.sprites = sprites;
        this.onPlayerDied = onPlayerDied;

        this.app = new Application()
        this.app.init({ autoResize: true }).then(() => {
            this.app.canvas.style.position = "absolute"
            this.app.canvas.style.display = "block"
            this.app.renderer.autoResize = true
            this.app.renderer.resize(window.innerWidth, window.innerHeight)

            const gameEl = document.getElementById('game')
            gameEl.appendChild(this.app.canvas)

            this.grid = new Grid(this.app, sprites)
        })
    }

    lastLocalUser = null;
    active = true;
    
    refresh(state, localUser) {
        if (this.hasPlayerDied(localUser)) {
            if (this.onPlayerDied) this.onPlayerDied();
        }
        else if (this.active)
        {
            this.grid.redraw(state, localUser);
        }

        if (this.hasPlayerGrown(localUser)) {            
        }

        this.lastLocalUser = localUser;
    }

    hasPlayerDied(newUserState) {
        if (this.lastLocalUser != null && newUserState != null) {
            if (this.lastLocalUser.state == 1 && newUserState.state == 0) {
                return true;
            }
        }
        return false;
    }

    hasPlayerGrown(newUserState) {
        if (this.lastLocalUser != null && newUserState != null) {
            return this.lastLocalUser.score < newUserState.score;
        }
        return false;
    }

    teardown() {
        this.app.stage.destroy(true);
        this.app.stop();
        this.app.destroy(true);
        this.active = false;
    }
}