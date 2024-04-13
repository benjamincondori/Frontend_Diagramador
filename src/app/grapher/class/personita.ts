export class Personita {
  private draggingLifeLine: boolean = false;
  private lifeLineStartY: number = 70;
  private lifeLineEndY: number = 200; // Altura por defecto de la línea de vida
  private lifeLineControlPointRadius: number = 3;
  private lifeLineControlPointHovered: boolean = false;

  constructor(
    private context: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private name: string
  ) {}

  draw() {
    // Dibujar la cabeza
    this.context.beginPath();
    this.context.arc(this.x, this.y, 10, 0, Math.PI * 2);
    this.context.fillStyle = 'black';
    this.context.fill();
    this.context.closePath();

    // Dibujar el cuerpo
    this.context.beginPath();
    this.context.moveTo(this.x, this.y + 10);
    this.context.lineTo(this.x, this.y + 25);
    this.context.strokeStyle = 'black';
    this.context.stroke();
    this.context.closePath();

    // Dibujar los brazos
    this.context.beginPath();
    this.context.moveTo(this.x - 10, this.y + 15);
    this.context.lineTo(this.x + 10, this.y + 15);
    this.context.strokeStyle = 'black';
    this.context.stroke();
    this.context.closePath();

    // Dibujar las piernas
    this.context.beginPath();
    this.context.moveTo(this.x, this.y + 23);
    this.context.lineTo(this.x - 10, this.y + 40);
    this.context.moveTo(this.x, this.y + 23);
    this.context.lineTo(this.x + 10, this.y + 40);
    this.context.strokeStyle = 'black';
    this.context.stroke();
    this.context.closePath();

    // Dibujar el nombre del actor
    this.context.font = '15px Poppins';
    this.context.fillStyle = 'black';
    const textWidth = this.context.measureText(this.name).width;
    this.context.fillText(this.name, this.x - textWidth / 2, this.y + 60);

    // Dibujar la línea de vida con punto de control al final
    this.context.beginPath();
    this.context.moveTo(this.x, this.y + 70);
    this.context.lineTo(this.x, this.y + this.lifeLineEndY);
    this.context.setLineDash([5, 5]);
    this.context.stroke();
    this.context.closePath();

    // Dibujar el punto de control
    this.context.beginPath();
    this.context.arc(
      this.x,
      this.y + this.lifeLineEndY,
      this.lifeLineControlPointRadius,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = this.lifeLineControlPointHovered ? 'red' : 'black';
    this.context.fill();
    this.context.closePath();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.context.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verificar si el usuario hizo clic en el punto de control
    const distanceToControlPoint = Math.sqrt(
      (mouseX - this.x) ** 2 + (mouseY - (this.y + this.lifeLineEndY)) ** 2
    );
    if (distanceToControlPoint <= this.lifeLineControlPointRadius) {
      this.draggingLifeLine = true;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.draggingLifeLine) {
      const rect = this.context.canvas.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;

      this.lifeLineEndY = Math.max(this.y + 70, Math.min(this.y + 400, mouseY));
      this.redraw(); // Vuelve a dibujar el actor con la nueva longitud de la línea de vida
    } else {
      const rect = this.context.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Verificar si el mouse está sobre el punto de control
      const distanceToControlPoint = Math.sqrt(
        (mouseX - this.x) ** 2 + (mouseY - (this.y + this.lifeLineEndY)) ** 2
      );
      this.lifeLineControlPointHovered =
        distanceToControlPoint <= this.lifeLineControlPointRadius;
      this.redraw(); // Vuelve a dibujar el actor con el punto de control resaltado si es necesario
    }
  }

  onMouseUp() {
    this.draggingLifeLine = false;
  }

  redraw() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.draw();
  }
}
