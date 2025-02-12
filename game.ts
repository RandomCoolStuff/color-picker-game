interface Color {
    r: number;
    g: number;
    b: number;
}

interface GameState {
    targetColor: Color;
    options: Color[];
    score: number;
}

class ColorPickerChallenge {
    private state: GameState;
    private targetColorElement: HTMLElement;
    private colorGridElement: HTMLElement;
    private resultElement: HTMLElement;
    private newGameButton: HTMLElement;
    private luaGame: any;
    private lolcodeInterpreter: any;

    constructor() {
        this.state = {
            targetColor: { r: 0, g: 0, b: 0 },
            options: [],
            score: 0
        };

        this.targetColorElement = document.getElementById('target-color')!;
        this.colorGridElement = document.getElementById('color-grid')!;
        this.resultElement = document.getElementById('result')!;
        this.newGameButton = document.getElementById('new-game')!;

        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.initLua();
        this.initLOLCODE();
        this.startNewGame();
    }

    private async initLua() {
        const response = await fetch('game.lua');
        const luaCode = await response.text();
        this.luaGame = fengari.load(luaCode)();
    }

    private async initLOLCODE() {
        const response = await fetch('messages.lol');
        const lolcode = await response.text();
        this.lolcodeInterpreter = new LOLCODEInterpreter(lolcode);
    }

    private startNewGame(): void {
        this.state.targetColor = this.luaGame.generateRandomColor();
        this.state.options = this.luaGame.generateColorOptions(this.state.targetColor);
        this.renderGame();
    }

    private renderGame(): void {
        const targetColorMsg = this.lolcodeInterpreter.run('TARGET_COLOR', [
            this.state.targetColor.r,
            this.state.targetColor.g,
            this.state.targetColor.b
        ]);
        this.targetColorElement.textContent = targetColorMsg;

        this.colorGridElement.innerHTML = '';
        this.state.options.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            colorOption.addEventListener('click', () => this.handleColorClick(index));
            this.colorGridElement.appendChild(colorOption);
        });

        const newGameMsg = this.lolcodeInterpreter.run('NEW_GAME_MSG');
        this.resultElement.textContent = newGameMsg;
    }

    private handleColorClick(index: number): void {
        const selectedColor = this.state.options[index];
        if (this.luaGame.colorsAreEqual(selectedColor, this.state.targetColor)) {
            this.state.score++;
            const correctMsg = this.lolcodeInterpreter.run('CORRECT_MSG', [this.state.score]);
            this.resultElement.textContent = correctMsg;
            setTimeout(() => this.startNewGame(), 1500);
        } else {
            const wrongMsg = this.lolcodeInterpreter.run('WRONG_MSG');
            this.resultElement.textContent = wrongMsg;
        }
    }
}

// Initialize the game
new ColorPickerChallenge();
