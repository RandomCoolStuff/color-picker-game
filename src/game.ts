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
    
    // Scoreboard elements
    private levelsBeatenElement!: HTMLElement;
    private levelTriesElement!: HTMLElement;
    private totalTriesElement!: HTMLElement;
    
    // Game stats
    private levelsBeaten: number = 0;
    private levelTries: number = 0;
    private totalTries: number = 0;
    
    private luaGame: any;

    constructor() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.loadPersistentStats();
            this.setupEventListeners();
            this.initLua().then(() => this.startNewGame());
        });
    }

    private initializeElements(): void {
        this.targetColorElement = document.getElementById('target-color') as HTMLElement;
        this.colorGridElement = document.getElementById('color-grid') as HTMLElement;
        this.resultElement = document.getElementById('result') as HTMLElement;
        this.newGameButton = document.getElementById('new-game') as HTMLElement;
        
        // Scoreboard elements
        this.levelsBeatenElement = document.getElementById('levels-beaten') as HTMLElement;
        this.levelTriesElement = document.getElementById('level-tries') as HTMLElement;
        this.totalTriesElement = document.getElementById('total-tries') as HTMLElement;
    }

    private loadPersistentStats(): void {
        // Load from localStorage or default to 0
        this.levelsBeaten = parseInt(localStorage.getItem('levelsBeaten') || '0', 10);
        this.totalTries = parseInt(localStorage.getItem('totalTries') || '0', 10);
        this.updateScoreboard();
    }

    private setupEventListeners(): void {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
    }

    private async initLua(): Promise<void> {
        try {
            const response = await fetch('game.lua');
            const luaCode = await response.text();
            this.luaGame = fengari.load(luaCode)();
        } catch (error) {
            console.error('Error loading Lua game:', error);
        }
    }

    private startNewGame(): void {
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
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess();
        }
        
        this.updateScoreboard();
    }

    private handleCorrectGuess(): void {
        this.resultElement.textContent = 'Correct!';
        this.levelsBeaten++;
        
        // Save persistent stats
        localStorage.setItem('levelsBeaten', this.levelsBeaten.toString());
        localStorage.setItem('totalTries', this.totalTries.toString());
        
        setTimeout(() => this.startNewGame(), 1500);
    }

    private handleIncorrectGuess(): void {
        this.resultElement.textContent = 'Wrong! Try again.';
        localStorage.setItem('totalTries', this.totalTries.toString());
    }

    private updateScoreboard(): void {
        this.levelsBeatenElement.textContent = `Levels Beaten: ${this.levelsBeaten}`;
        this.levelTriesElement.textContent = `Tries This Level: ${this.levelTries}`;
        this.totalTriesElement.textContent = `Total Tries: ${this.totalTries}`;
    }
}

// Initialize the game
new ColorPickerChallenge();
