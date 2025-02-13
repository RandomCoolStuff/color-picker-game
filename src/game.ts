interface Color {
    r: number;
    g: number;
    b: number;
}

class ColorPickerChallenge {
    private targetColor: Color;
    private options: Color[];
    private targetColorElement: HTMLElement;
    private colorGridElement: HTMLElement;
    private resultElement: HTMLElement;
    private newGameButton: HTMLElement;
    private luaGame: any;

    constructor() {
        this.targetColorElement = document.getElementById('target-color') as HTMLElement;
        this.colorGridElement = document.getElementById('color-grid') as HTMLElement;
        this.resultElement = document.getElementById('result') as HTMLElement;
        this.newGameButton = document.getElementById('new-game') as HTMLElement;

        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.initLua();
        this.startNewGame();
    }

    private async initLua() {
        const response = await fetch('game.lua');
        const luaCode = await response.text();
        this.luaGame = fengari.load(luaCode)();
    }

    private startNewGame(): void {
        this.targetColor = this.luaGame.generateRandomColor();
        this.options = this.luaGame.generateColorOptions(this.targetColor);
        this.renderGame();
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
        const selectedColor = this.options[index];
        if (this.luaGame.colorsAreEqual(selectedColor, this.targetColor)) {
            this.resultElement.textContent = 'Correct!';
            setTimeout(() => this.startNewGame(), 1500);
        } else {
            this.resultElement.textContent = 'Wrong! Try again.';
        }
    }
}

new ColorPickerChallenge();
