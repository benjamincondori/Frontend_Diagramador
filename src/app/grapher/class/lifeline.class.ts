export class Lifeline {
  x: number;
  y: number;
  height: number;

  constructor(x: number, y: number, height: number) {
    this.x = x;
    this.y = y;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y + this.height);
    context.setLineDash([5, 5]); // Línea punteada
    context.stroke();
    context.setLineDash([]);
    context.closePath();

    // Dibuja el cuadrito de redimensionamiento en el extremo inferior de la línea de vida
    context.beginPath();
    context.rect(this.x - 5, this.y + this.height - 5, 10, 10);
    context.fill();
    context.closePath();
  }

  isResizeHandleClicked(mouseX: number, mouseY: number): boolean {
    // Verificar si las coordenadas del clic están dentro del cuadro de redimensionamiento
    return (
      mouseX >= this.x - 5 &&
      mouseX <= this.x + 5 &&
      mouseY >= this.y + this.height - 5 &&
      mouseY <= this.y + this.height + 5
    );
  }

  resize(newheight: number): void {
    this.height = Math.max(newheight, 80); // Establece la longitud como el máximo entre newheight y 80
  }

  isPointInside(x: number, y: number): boolean {
    // Considera un pequeño margen alrededor de la línea para facilitar la selección
    const margin = 5;
    return (
      x >= this.x - margin &&
      x <= this.x + margin &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
