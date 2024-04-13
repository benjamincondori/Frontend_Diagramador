export class Lifeline {
  x: number;
  y: number;
  isSelected: boolean;
  text: string = ''; 
  length: number;

  constructor(x: number, y: number, length: number, text: string) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.isSelected = false; // Indica si el elemento está seleccionado
    this.text = text; // Y establece el texto
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.setLineDash([5, 5]); // Línea punteada
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dibuja el controlador de redimensionamiento en el extremo inferior de la línea de vida
    // Define un círculo en el extremo inferior de la línea de vida
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.length, 5, 0, Math.PI * 2);
    //ctx.fillStyle = 'red'; // Puedes elegir el color que prefieras
    ctx.fill(); // Rellena el círculo con el color seleccionado
  }

  isResizeControlClicked(x: number, y: number): boolean {
    // Comprueba si el punto (x, y) está dentro del círculo del controlador
    const distance = Math.sqrt(
      (x - this.x) ** 2 + (y - (this.y + this.length)) ** 2
    );
    return distance < 5; // Radio del círculo del controlador
  }

  resize(newLength: number): void {
    this.length = newLength;
  }

  // containsPoint(x: number, y: number): boolean {
  //   // Considera un pequeño margen alrededor de la línea para facilitar la selección
  //   const margin = 5;
  //   return (
  //     x >= this.x - margin &&
  //     x <= this.x + margin &&
  //     y >= this.y &&
  //     y <= this.y + this.length
  //   );
  // }

  // Ya implementado en DiagramElement, pero aquí para referencia
  move(dx: number, dy: number): void {
    this.x += dx;
    // Para Lifeline, probablemente solo necesites mover en el eje Y
    this.y += dy;
  }
}