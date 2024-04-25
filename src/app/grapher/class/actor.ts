import { Lifeline } from "./lifeline.class";
import { NameClass } from "./name-class.enum";

export class Actor {
  public type: string = 'Actor';
  public x: number;
  public y: number;
  private width: number;
  private height: number;
  public text: string;
  public textYPosition: number;
  public lifeline: Lifeline;

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 70;
    this.text = text;
    this.textYPosition = this.y + 70;
    
    // Inicializa la línea de vida para que comience desde la posición Y del texto
    this.lifeline = new Lifeline(
      this.x,
      this.textYPosition,
      200
    );
  }

  draw(context: CanvasRenderingContext2D): void {
    // Dibujar la cabeza
    context.beginPath();
    context.arc(this.x, this.y, 10, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();

    // Dibujar el cuerpo
    context.beginPath();
    context.moveTo(this.x, this.y + 10);
    context.lineTo(this.x, this.y + 25);
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();

    // Dibujar los brazos
    context.beginPath();
    context.moveTo(this.x - 10, this.y + 15);
    context.lineTo(this.x + 10, this.y + 15);
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();

    // Dibujar las piernas
    context.beginPath();
    context.moveTo(this.x, this.y + 23);
    context.lineTo(this.x - 10, this.y + 40);
    context.moveTo(this.x, this.y + 23);
    context.lineTo(this.x + 10, this.y + 40);
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
    
    // Dibujar el nombre del actor
    context.font = 'bold 16px Poppins';
    context.fillStyle = 'black';
    const textWidth = context.measureText(this.text).width;
    context.fillText(this.text, this.x - textWidth / 2, this.y + 60);
    context.closePath();
    
    // Línea de vida
    this.lifeline.x = this.x; 
    this.lifeline.y = this.textYPosition;
    this.lifeline.draw(context);
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
    if (this.x + dx < 80) {
      dx = 80 - this.x; // Restringir el movimiento
    }
    
    this.x += dx;
    // this.y += dy;
    
    // Mueve la línea de vida junto con el actor
    this.lifeline.move(dx, dy);
    // this.textYPosition += dy; // Asegúrate de mover también la posición Y del texto
  }
}
