import { Lifeline } from "./lifeline.class";
import { NameClass } from "./name-class.enum";

export class Entity {
  public type: string = NameClass.Entity;
  public x: number;
  public y: number;
  private width: number;
  private height: number;
  public stereotype: string;
  public text: string;
  public lifeline: Lifeline;
  
  

  constructor(x: number, y: number, stereotype: string, text: string) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 80;
    this.stereotype = stereotype;
    this.text = text;
    
    this.lifeline = new Lifeline(
      this.x + this.width / 2,
      this.y + this.height,
      200
    );
  }

  draw(context: CanvasRenderingContext2D): void {
    // Crear degradado para el fondo del cuadro
    const gradient = context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, 'gray'); // Color inicial
    gradient.addColorStop(1, 'white'); // Color final
    
    // Cuadro con fondo degradado y bordes redondeados
    const borderRadius = 10; // Radio de los bordes redondeados
    context.beginPath();
    // context.fillStyle = gradient;
    context.moveTo(this.x + borderRadius, this.y);
    context.lineTo(this.x + this.width - borderRadius, this.y);
    context.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + borderRadius, borderRadius);
    context.lineTo(this.x + this.width, this.y + this.height - borderRadius);
    context.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - borderRadius, this.y + this.height, borderRadius);
    context.lineTo(this.x + borderRadius, this.y + this.height);
    context.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - borderRadius, borderRadius);
    context.lineTo(this.x, this.y + borderRadius);
    context.arcTo(this.x, this.y, this.x + borderRadius, this.y, borderRadius);
    context.stroke();
    // context.fillRect(this.x, this.y, this.width, this.height);
    // context.strokeRect(this.x, this.y, this.width, this.height);
    
    // Borde del cuadro
    context.strokeStyle = 'black'; // Color del borde
    context.lineWidth = 1; // Grosor del borde
    context.stroke();
    context.closePath();
    
    
    // Estereotype
    context.font = '15px Poppins'; 
    context.fillStyle = 'black';
    const stereotypeWidth = context.measureText(this.stereotype).width;
    const stereotypeX = this.x + (this.width - stereotypeWidth) / 2; // Centrar horizontalmente
    const stereotypeY = this.y + this.height / 2 - 10; // Centrar verticalmente (10 unidades por encima del centro)
    context.fillText(this.stereotype, stereotypeX, stereotypeY);
    context.closePath();

    // Texto
    context.font = 'bold 16px Poppins';
    context.fillStyle = 'black';
    const textWidth = context.measureText(this.text).width;
    const textX = this.x + (this.width - textWidth) / 2; // Centrar el texto horizontalmente
    const textY = this.y + this.height / 2 + 10; // Centrar verticalmente (10 unidades por debajo del centro)
    context.fillText(this.text, textX, textY);
    context.closePath();

    // Línea de vida
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
    if (this.x + dx < 50) {
      dx = 50 - this.x; // Restringir el movimiento
    }
    
    this.x += dx;
    // this.y += dy;
    
    // Mueve la línea de vida junto con el actor
    this.lifeline.move(dx, dy);
  }
}
