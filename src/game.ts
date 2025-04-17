declare const fengari: any;

interface Color {
    r: number;
    g: number;
    b: number;
}

class ColorPickerChallenge {
    private targetColor!: Color;
    private options!: Color[];
    private targetColorElement!: HTMLElement;
    private colorGridElement!: HTMLElement;
    private resultElement!: HTMLElement;
    private newGameButton!: HTMLElement;
    private levelsBeatenElement!: HTMLElement;
    private levelTriesElement!: HTMLElement;
    private totalTriesElement!: HTMLElement;
    private levelsBeaten: number = 0;
    private levelTries: number = 0;
    private totalTries: number = 0;
    private luaGame: any = null;

    constructor() {
        // Get DOM elements (non-null assertions since IDs are guaranteed)
        this.targetColorElement = document.getElementById('target-color')!;
        this.colorGridElement = document.getElementById('color-grid')!;
        this.resultElement = document.getElementById('result')!;
        this.newGameButton = document.getElementById('new-game')!;
        this.levelsBeatenElement = document.getElementById('levels-beaten')!;
        this.levelTriesElement = document.getElementById('level-tries')!;
        this.totalTriesElement = document.getElementById('total-tries')!;

        // Load persistent stats
        this.levelsBeaten = parseInt(localStorage.getItem('levelsBeaten') || '0', 10);
        this.totalTries = parseInt(localStorage.getItem('totalTries') || '0', 10);

        // Button event
        this.newGameButton.addEventListener('click', () => this.startNewGame());

        // Load Lua and start game
        this.initLua().then(() => this.startNewGame());
    }

    private async initLua(): Promise<void> {
        const response = await fetch('game.lua');
        const luaCode = await response.text();
        this.luaGame = fengari.load(luaCode)();
    }

    private startNewGame(): void {
        if (!this.luaGame) return;
        this.targetColor = this.luaGame.generateRandomColor();
        this.options = this.luaGame.generateColorOptions(this.targetColor);
        this.levelTries = 0;
        this.renderGame();
        this.updateScoreboard();
    }

    private renderGame(): void {
        this.targetColorElement.textContent = `Target: RGB(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
        this.colorGridElement.innerHTML = '';
        this.options.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            colorOption.addEventListener('click', () => this.handleColorClick(index));
            this.colorGridElement.appendChild(colorOption);
        });
        this.resultElement.textContent = '';
    }

    private handleColorClick(index: number): void {
        this.levelTries++;
        this.totalTries++;

        const selectedColor = this.options[index];
        if (this.luaGame.colorsAreEqual(selectedColor, this.targetColor)) {
            this.resultElement.textContent = 'Correct!';
            this.levelsBeaten++;
            localStorage.setItem('levelsBeaten', this.levelsBeaten.toString());
            localStorage.setItem('totalTries', this.totalTries.toString());
            this.updateScoreboard();
            setTimeout(() => this.startNewGame(), 1500);
        } else {
            this.resultElement.textContent = 'Wrong! Try again.';
            localStorage.setItem('totalTries', this.totalTries.toString());
            this.updateScoreboard();
        }
    }

    private updateScoreboard(): void {
        this.levelsBeatenElement.textContent = `Levels beaten: ${this.levelsBeaten}`;
        this.levelTriesElement.textContent = `Tries this level: ${this.levelTries}`;
        this.totalTriesElement.textContent = `Total tries: ${this.totalTries}`;
    }
}

// Only instantiate after DOM is ready!
document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerChallenge();
});
