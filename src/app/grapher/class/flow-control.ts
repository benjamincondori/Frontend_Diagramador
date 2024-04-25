import { NameClass } from "./name-class.enum";

export class FlowControl {
  public type: string = NameClass.FlowControl;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public text: string;

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 120;
    this.text = text;
  }
  
  draw(context: CanvasRenderingContext2D): void {
    // Cuadro Principal
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.stroke();
    context.closePath();
    
    // Cuadro en la esquina superior izquierda para el texto
    context.beginPath();
    const size = 30;
    context.fillStyle = "black";
    context.moveTo(this.x, this.y); // Mover al inicio del cuadro
    context.lineTo(this.x + size + 50, this.y); // Línea horizontal superior
    context.lineTo(this.x + size + 20, this.y + size); // Línea diagonal derecha
    context.lineTo(this.x, this.y + size); // Línea vertical izquierda
    context.fill(); 
    context.font = "bold 14px Poppins";
    context.fillStyle = "white";
    context.fillText(this.text, this.x + 10, this.y + 20); // Etiqueta 
    context.closePath(); 
    
    // Cuadrito de redimensionamiento
    context.beginPath();
    context.fillStyle = "black";
    const squareSize = 10;
    const x = this.x + this.width - squareSize;
    const y = this.y + this.height - squareSize;
    context.fillRect(x, y, squareSize, squareSize);
    context.closePath();
  }

  isResizeHandleClicked(x: number, y: number): boolean {
    // Verificar si las coordenadas del clic están dentro del cuadrito de redimensionamiento
    const squareSize = 10;
    return x >= this.x + this.width - squareSize && x <= this.x + this.width &&
           y >= this.y + this.height - squareSize && y <= this.y + this.height;
           
    // const size = 10;
    // const resizeX = this.x + this.width - size;
    // const resizeY = this.y + this.height - size;

    // return (
    //   x >= resizeX && x <= resizeX + size && y >= resizeY && y <= resizeY + size
    // );
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
    this.x += dx;
    this.y += dy;
  }

  resize(newWidth: number, newHeight: number): void {
    this.width = Math.max(newWidth, 100); // Establece el ancho como el máximo entre newWidth y 100
    this.height = Math.max(newHeight, 80); // Establece el alto como el máximo entre newHeight y 80
  }

}