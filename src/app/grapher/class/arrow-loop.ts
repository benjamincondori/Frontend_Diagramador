import { NameClass } from "./name-class.enum";

export class LoopArrow {
  public type: string = NameClass.LoopArrow;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public text: string

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 50;
    this.text = text;
  }

  draw(context: CanvasRenderingContext2D): void {
    // Cuadradito al principio de la flecha
    const squareSize = 8; // Tamaño del cuadradito
    context.fillRect(this.x, this.y - squareSize / 2, squareSize, squareSize);
    
    // Linea horizontal superior
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.width, this.y);
    context.stroke();

    // Linea vertical
    context.beginPath();
    context.moveTo(this.x + this.width, this.y);
    context.lineTo(this.x + this.width, this.y + this.height);
    context.stroke();

    // Linea horizontal inferior
    context.beginPath();
    context.moveTo(this.x + this.width, this.y + this.height);
    context.lineTo(this.x, this.y + this.height);
    context.stroke();

    // Cabeza de la flecha (hacia la izquierda)
    const arrowHeadSize = 10; // Tamaño de la punta de la flecha
    context.beginPath();
    context.moveTo(this.x + arrowHeadSize, this.y + this.height - arrowHeadSize);
    context.lineTo(this.x, this.y + this.height);
    context.lineTo(this.x + arrowHeadSize, this.y + this.height + arrowHeadSize);
    context.stroke();
    
    // Texto sobre la línea de arriba y centrado
    context.font = '14px Poppins';
    context.textAlign = 'center';
    context.fillText(this.text, this.x + this.width / 2, this.y - 10);
  }
  
  isPointInside(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  
  move(dx: number, dy: number): void {
    // Limitar el movimiento en el eje X (a la izquierda)
    if (this.x + dx < 50) {
      dx = 50 - this.x; // Restringir el movimiento
    }
    
    this.x += dx;
    this.y += dy;
  }
  
  
}
