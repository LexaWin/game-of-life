import { Game } from './Game.js';
import { GameField } from './GameField.js';
import './modal.js';

// Кнопка создания игры
const createButton = document.getElementById('create');
// Кнопка запуска игры
const startButton = document.getElementById('start');
// Кнопка останова игры
const stopButton = document.getElementById('stop');

// Поле с количеством ячеек по горизонтали
const widthInput = document.getElementById('game-field-width');
// Поле с количеством ячеек по вертикали
const heightInput = document.getElementById('game-field-height');
// Поле со скоростью игры
const speedInput = document.getElementById('game-speed');

let game;

createButton.onclick = () => {
  game = null;

  const gameFieldWidth = +widthInput.value;
  const gameFieldHeight = +heightInput.value;
  const gameSpeed = +speedInput.value;

  if (gameFieldWidth > 0 && gameFieldHeight > 0 && gameSpeed >= 0) {
    const canvas = document.getElementById('game-field');
    const gameField = new GameField(
      gameFieldWidth,
      gameFieldHeight,
      undefined,
      canvas
    );
    game = new Game(gameField, gameSpeed, canvas);
    startButton.disabled = false;
  } else {
    alert(`Задан неверный размер игрового поля!
Укажите верные значения!
Ширина и высота игрового поля должны быть строго больше 0.
Скорость игры должна быть не меньше 0.`);
  }
};

startButton.onclick = () => {
  createButton.disabled = true;
  widthInput.disabled = true;
  heightInput.disabled = true;
  startButton.disabled = true;
  stopButton.disabled = false;
  speedInput.onchange = function () {
    game.changeSpeed(this.value);
  };

  game.start();
};

stopButton.onclick = () => {
  game.stop();
  createButton.disabled = false;
  widthInput.disabled = false;
  heightInput.disabled = false;
  startButton.disabled = true;
  stopButton.disabled = true;
  speedInput.onchange = null;
};

const handleGameOver = () => {
  const event = new Event('click');
  stopButton.dispatchEvent(event);
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  document.body.overflow = 'hidden';
};

document.body.addEventListener('gameover', handleGameOver);
