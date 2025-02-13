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

    constructor() {
        this.targetColorElement = document.getElementById('target-color') as HTMLElement;
        this.colorGridElement = document.getElementById('color-grid') as HTMLElement;
        this.resultElement = document.getElementById('result') as HTMLElement;
        this.newGameButton = document.getElementById('new-game') as HTMLElement;

        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.startNewGame();
    }

    private startNewGame(): void {
        this.targetColor = this.generateRandomColor();
        this.options = this.generateColorOptions();
        this.renderGame();
    }

    private generateRandomColor(): Color {
        return {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };
    }

    private generateColorOptions(): Color[] {
        const options: Color[] = [this.targetColor];
        while (options.length < 6) {
            const newColor = this.generateRandomColor();
            if (!options.some(c => this.colorsAreEqual(c, newColor))) {
                options.push(newColor);
            }
        }
        return this.shuffleArray(options);
    }

    private colorsAreEqual(c1: Color, c2: Color): boolean {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    }

    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
        if (this.colorsAreEqual(selectedColor, this.targetColor)) {
            this.resultElement.textContent = 'Correct!';
            setTimeout(() => this.startNewGame(), 1500);
        } else {
            this.resultElement.textContent = 'Wrong! Try again.';
        }
    }
}

new ColorPickerChallenge();
