import { NameClass } from "./name-class.enum";

export class Message {
  public type: string = NameClass.Message;
  public x: number;
  public y: number;
  public text: string;
  private context: CanvasRenderingContext2D;

  constructor(x: number, y: number, text: string, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.context = context;
  }

  draw(): void {
    // Dibujar el mensaje
    this.context.font = '14px Poppins';
    this.context.fillText(this.text, this.x, this.y);
  }

  isPointInside(x: number, y: number): boolean {
    // Verificar si el punto está dentro del mensaje (solo para fines de selección)
    const textWidth = this.context.measureText(this.text).width;
    return (
      x >= this.x &&
      x <= this.x + textWidth &&
      y >= this.y - 14 &&
      y <= this.y
    );
  }

  move(dx: number, dy: number): void {
    // Mover el mensaje
    this.x += dx;
    this.y += dy;
  }
}