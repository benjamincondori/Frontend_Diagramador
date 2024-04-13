export class Figura {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {}

  draw(context: CanvasRenderingContext2D) {
    // Dibuja la línea de vida (actor)
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(50, 200);
    context.stroke();

    // Dibuja la cabeza
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(50, 30, 20, 0, 2 * Math.PI);
    context.fill();

    // Dibuja las manos
    context.fillStyle = 'green';
    context.fillRect(40, 50, 20, 10);
    context.fillRect(40, 190, 20, 10);

    // Dibuja el cuerpo
    context.fillStyle = 'red';
    context.fillRect(40, 60, 20, 130);

    // Dibuja las piernas
    context.fillStyle = 'orange';
    context.fillRect(40, 190, 20, 10);
    context.fillRect(40, 220, 20, 10);
  }

  setPosicion(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
