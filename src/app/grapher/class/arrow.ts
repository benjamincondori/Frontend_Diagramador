import { NameClass } from "./name-class.enum";

export class Arrow {
  public type: string = NameClass.Arrow;
  public x: number;
  public y: number;
  public endX: number;
  private dashed: boolean;
  public async: boolean;
  public text: string;

  constructor(x: number, y: number, text: string, dashed: boolean, async: boolean = false) {
    this.x = x;
    this.y = y;
    this.endX = 300;
    this.text = text;
    this.dashed = dashed;
    this.async = async;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.dashed) {
      this.drawLeftArrow(context);
    } else {
      // this.drawRightArrow(context);
      this.drawRightArrow(context);
    }

    // Centrar el texto sobre la línea horizontal
    context.font = '14px Poppins';
    const textWidth = context.measureText(this.text).width; // Obtener la longitud del texto
    const textX = (this.x + this.endX - textWidth) / 2; // Calcular la posición x centrada
    const textY = this.y - 10; // Posición y para colocar el texto sobre la línea
    context.fillText(this.text, textX, textY); // Dibujar el texto centrado sobre la línea
  }

  drawRightArrow(context: CanvasRenderingContext2D): void {
    // Cuerpo de la flecha (línea horizontal)
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.endX, this.y);
    context.stroke();

    // Punta de la flecha
    const arrowHeadSize = 10; // Tamaño de la punta de la flecha
    context.beginPath();
    context.moveTo(this.endX - arrowHeadSize, this.y - arrowHeadSize + 3);
    context.lineTo(this.endX, this.y);
    context.lineTo(this.endX - arrowHeadSize, this.y + arrowHeadSize - 3);
    
    if (this.async) {
      context.stroke();
    } else {
      context.fill();
    }

    // Cuadradito en el otro extremo de la flecha
    const squareSize = 8; // Tamaño del cuadradito
    context.fillRect(this.x, this.y - squareSize / 2, squareSize, squareSize);
  }

  drawLeftArrow(context: CanvasRenderingContext2D): void {
    // Cuerpo de la flecha (línea horizontal)
    context.beginPath();
    context.setLineDash([10, 5]);
    context.moveTo(this.x, this.y);
    context.lineTo(this.endX, this.y);
    context.stroke();

    // Punta de la flecha
    const arrowHeadSize = 10; // Tamaño de la punta de la flecha
    context.beginPath();
    context.setLineDash([]);
    context.moveTo(this.x + arrowHeadSize, this.y - arrowHeadSize + 3);
    context.lineTo(this.x, this.y);
    context.lineTo(this.x + arrowHeadSize, this.y + arrowHeadSize - 3);
    context.stroke();

    // Dibujar el cuadradito en el lado derecho de la flecha
    const squareSize = 8; // Tamaño del cuadradito
    context.fillRect(
      this.endX - squareSize,
      this.y - squareSize / 2,
      squareSize,
      squareSize
    );
  }
  

  isPointInside(x: number, y: number): boolean {
    return (
      y >= this.y - 10 &&
      y <= this.y + 10 &&
      x >= Math.min(this.x, this.endX) &&
      x <= Math.max(this.x, this.endX)
    );
  }

  isResizeHandleClicked(
    mouseX: number,
    mouseY: number
  ): 'left' | 'right' | boolean {
    const size = 10; // Tamaño de la punta de la flecha o del cuadradito

    // Verificar si se hizo clic en la punta de la flecha
    if (
      mouseX >= this.endX - size &&
      mouseX <= this.endX &&
      mouseY >= this.y - size &&
      mouseY <= this.y + size
    ) {
      return 'right';
    }

    // Verificar si se hizo clic en el cuadradito
    if (
      mouseX >= this.x &&
      mouseX <= this.x + size &&
      mouseY >= this.y - size &&
      mouseY <= this.y + size
    ) {
      return 'left';
    }

    return false;
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.endX += dx;
    this.y += dy;
  }

  resizeRight(newWidth: number): void {
    // Calcular el nuevo ancho después de la redimensión
    const newEndX = newWidth;

    // Verificar si el nuevo ancho es menor que 100
    if (newEndX - this.x < 100) {
      // Establecer el ancho en 100
      this.endX = this.x + 100;
    } else {
      // Establecer el nuevo ancho
      this.endX = newEndX;
    }
  }
  
  resizeLeft(newWidth: number): void {
    // Calcular el nuevo ancho después de la redimensión
    const newX = this.endX - newWidth;

    // Verificar si el nuevo ancho es menor que 100
    if (newX < 100) {
      // Establecer el extremo derecho en la posición actual menos 100
      this.x = this.endX - 100;
    } else {
      // Establecer la nueva posición x y el ancho
      this.x = newWidth;
    }
  }
}
