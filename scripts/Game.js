class Game {
  constructor(gameField, gameSpeed, canvas) {
    this.gameField = gameField;
    this.gameField.drawField();

    this.gameSpeed = gameSpeed;

    this.canvas = canvas;
    this.canvas.onclick = this.onclick.bind(this);

    this.cellsCount = gameField.width * gameField.height;
    this.currentGen = Array(this.cellsCount).fill(false);
  }

  onclick(event) {
    const cellId = this.getCellId(event);

    this.currentGen[cellId] = !this.currentGen[cellId];

    this.currentGen[cellId] ? this.reviveCell(cellId) : this.killCell(cellId);
  }

  // Возвращает номер ячейки, по которой кликнули
  getCellId(event) {
    const mouseX = event.pageX - this.gameField.field.offsetLeft;
    const mouseY = event.pageY - this.gameField.field.offsetTop;

    return (
      Math.floor(mouseX / this.gameField.cellSize) +
      this.gameField.width * Math.floor(mouseY / this.gameField.cellSize)
    );
  }

  // "Убивает" ячейку (красит в белый)
  killCell(cellId) {
    this.gameField.drawCell(cellId, '#ffffff');
  }

  // "Оживляет" ячейку (красит в красный)
  reviveCell(cellId) {
    this.gameField.drawCell(cellId, '#ff0000');
  }

  start() {
    this.canvas.onclick = null;

    // Массив для обхода клеток, находящихся вокруг текущей ячейки
    // Содержит смещения относительно текущего индекса
    const diffs = [
      this.gameField.width + 1,
      this.gameField.width,
      this.gameField.width - 1,
      1,
      -(this.gameField.width + 1),
      -this.gameField.width,
      -(this.gameField.width - 1),
      -1,
    ];

    // Для повышения производительности проверять будем только "живые" клетки
    // и те, которые находятся вокруг них
    // Создадим Множество, которое содержит живые клетки
    // Тип Set здесь более оптимален, т.к. исключает дублирование элементов
    let livingCells = new Set();

    // Получаем все "живые" клетки
    this.currentGen.forEach((cell, id) => {
      if (!cell) return;

      livingCells.add(id);
    });

    this.timerId = setInterval(() => {
      // Создадим временный массив, в который соберем все клетки вокруг "живых"
      const asideCells = [];

      // Получаем все клетки, которые находятся вокруг "живых"
      livingCells.forEach((cell, id) => {
        if (!cell) return;

        diffs.forEach((diff) => {
          let currentId = id + diff;

          if (currentId < 0) {
            currentId += this.cellsCount;
          } else if (currentId >= this.cellsCount) {
            currentId -= this.cellsCount;
          }

          asideCells.push(currentId);
        });
      });

      // Добавим клетки в asideCells в наше множество "живых"
      asideCells.forEach((cellId) => {
        livingCells.add(cellId);
      });

      // Создадим 2 массива. В один будем складывать ячейки,
      // которые в следующем поколении "умрут", а в другой те, которые станут
      // "живыми"
      const willDie = [];
      const willBorn = [];

      // Теперь пройдемся по всему множеству и поменяем состояние ячеек
      livingCells.forEach((cellId) => {
        let numberOfLivingCellsAround = 0;

        diffs.forEach((diff) => {
          let currentId = cellId + diff;

          if (currentId < 0) {
            currentId += this.cellsCount;
          } else if (currentId >= this.cellsCount) {
            currentId -= this.cellsCount;
          }

          if (this.currentGen[currentId]) {
            numberOfLivingCellsAround++;
          }
        });

        if (!this.currentGen[cellId] && numberOfLivingCellsAround === 3) {
          willBorn.push(cellId);
        } else if (
          this.currentGen[cellId] &&
          (numberOfLivingCellsAround < 2 || numberOfLivingCellsAround > 3)
        ) {
          willDie.push(cellId);
        }
      });

      // Теперь обновим наше игровое поле:
      willBorn.forEach((id) => {
        this.gameField.drawCell(id, '#ff0000');
        this.currentGen[id] = true;
      });

      willDie.forEach((id) => {
        this.gameField.drawCell(id, '#ffffff');
        this.currentGen[id] = false;
      });

      // Теперь избавимся от всех "неживых" клеток
      // Соберем все "живые" в массив
      const livingCellsArr = [];

      livingCells.forEach((cellId) => {
        if (this.currentGen[cellId]) {
          livingCellsArr.push(cellId);
        }
      });

      // Создадим из livingCellsArr новое множество "живых" клеток
      livingCells = new Set(livingCellsArr);

      // Если "живых" больше нет, то игра окончена
      if (livingCells.size === 0) {
        this.gameOver();
      }
    }, this.gameSpeed);
  }

  changeSpeed(newSpeed) {
    this.stop();

    this.gameSpeed = newSpeed;

    this.start();
  }

  stop() {
    clearInterval(this.timerId);
  }

  gameOver() {
    this.canvas.dispatchEvent(new Event('gameover', { bubbles: true }));
  }
}

export { Game };
