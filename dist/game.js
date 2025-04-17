"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ColorPickerChallenge {
    constructor() {
        this.levelsBeaten = 0;
        this.levelTries = 0;
        this.totalTries = 0;
        this.luaGame = null;
        // Get DOM elements (non-null assertions since IDs are guaranteed)
        this.targetColorElement = document.getElementById('target-color');
        this.colorGridElement = document.getElementById('color-grid');
        this.resultElement = document.getElementById('result');
        this.newGameButton = document.getElementById('new-game');
        this.levelsBeatenElement = document.getElementById('levels-beaten');
        this.levelTriesElement = document.getElementById('level-tries');
        this.totalTriesElement = document.getElementById('total-tries');
        // Load persistent stats
        this.levelsBeaten = parseInt(localStorage.getItem('levelsBeaten') || '0', 10);
        this.totalTries = parseInt(localStorage.getItem('totalTries') || '0', 10);
        // Button event
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        // Load Lua and start game
        this.initLua().then(() => this.startNewGame());
    }
    initLua() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('game.lua');
            const luaCode = yield response.text();
            this.luaGame = fengari.load(luaCode)();
        });
    }
    startNewGame() {
        if (!this.luaGame)
            return;
        this.targetColor = this.luaGame.generateRandomColor();
        this.options = this.luaGame.generateColorOptions(this.targetColor);
        this.levelTries = 0;
        this.renderGame();
        this.updateScoreboard();
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
        this.levelTries++;
        this.totalTries++;
        localStorage.setItem('totalTries', this.totalTries.toString());
        const selectedColor = this.options[index];
        if (this.luaGame.colorsAreEqual(selectedColor, this.targetColor)) {
            this.resultElement.textContent = 'Correct!';
            this.levelsBeaten++;
            localStorage.setItem('levelsBeaten', this.levelsBeaten.toString());
            this.updateScoreboard();
            setTimeout(() => this.startNewGame(), 1500);
        }
        else {
            this.resultElement.textContent = 'Wrong! Try again.';
            this.updateScoreboard();
        }
    }
    updateScoreboard() {
        this.levelsBeatenElement.textContent = `Levels beaten: ${this.levelsBeaten}`;
        this.levelTriesElement.textContent = `Tries this level: ${this.levelTries}`;
        this.totalTriesElement.textContent = `Total tries: ${this.totalTries}`;
    }
}
// Only instantiate after DOM is ready!
document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerChallenge();
});
//# sourceMappingURL=game.js.map