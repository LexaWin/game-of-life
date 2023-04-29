class GameField {
  constructor(width, height, cellSize = 10, canvas) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.field = canvas;
    this.context = this.field.getContext('2d');
  }

  drawField() {
    // Устанавливаем размеры игрового поля
    this.field.width = this.width * this.cellSize + 1;
    this.field.height = this.height * this.cellSize + 1;

    this.drawGrid();
  }

  // Рисует сетку
  drawGrid() {
    // Вертикальные линии
    for (let x = 0.5; x < this.field.width; x += this.cellSize) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.field.height);
    }

    // Горизонтальные линии
    for (let y = 0.5; y < this.field.height; y += this.cellSize) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.field.width, y);
    }

    this.context.strokeStyle = '#eeeeee';
    this.context.stroke();
  }

  // Рисует (красит) ячейку на игровом поле
  drawCell(cellId, color) {
    const x = (cellId % this.width) * this.cellSize + 1;
    const y = Math.floor(cellId / this.width) * this.cellSize + 1;

    this.context.fillStyle = color;
    this.context.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
  }
}

export { GameField };
