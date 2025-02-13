class ColorPickerChallenge {
    constructor() {
        this.targetColorElement = document.getElementById('target-color');
        this.colorGridElement = document.getElementById('color-grid');
        this.resultElement = document.getElementById('result');
        this.newGameButton = document.getElementById('new-game');

        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.startNewGame();
    }

    startNewGame() {
        this.targetColor = this.generateRandomColor();
        this.options = this.generateColorOptions();
        this.renderGame();
    }

    generateRandomColor() {
        return {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };
    }

    generateColorOptions() {
        const options = [this.targetColor];
        while (options.length < 6) {
            const newColor = this.generateRandomColor();
            if (!options.some(c => this.colorsAreEqual(c, newColor))) {
                options.push(newColor);
            }
        }
        return this.shuffleArray(options);
    }

    colorsAreEqual(c1, c2) {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderGame() {
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

    handleColorClick(index) {
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
