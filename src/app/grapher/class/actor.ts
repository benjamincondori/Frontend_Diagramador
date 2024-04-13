export class Actor {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  color: string;
  arrastrando: boolean;
  conexion: any[];

  constructor(private ctx: CanvasRenderingContext2D) {
    this.x = 0;
    this.y = 0;
    this.ancho = 20;
    this.alto = 0;
    this.color = "#000000";
    this.arrastrando = false;
    this.conexion = [];
  }

  drawActor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
    this.ctx.closePath();

    // Dibujar línea vertical para representar el cuerpo del actor
		//el torso y pierda
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + 12); //100 62
		this.ctx.lineTo(x, y + 35); //100  85
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
		//sus manos
		this.ctx.beginPath();
		this.ctx.moveTo(x - 10, y + 20); //90 70
		this.ctx.lineTo(x + 10, y + 20); //110 70
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
		// Dibujar las piernas
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + 35); //100 85
		this.ctx.lineTo(x - 10, y + 50); //90 100
		this.ctx.moveTo(x, y + 35); //100 85
		this.ctx.lineTo(x + 10, y + 50); // 110  100
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.font = "10px Arial";
		this.ctx.fillText("texto", x - 10, y + 60); /// 90 110

		this.ctx.beginPath();

		for (let i = 0; i < 24; i++) {
			// Puedes ajustar el número de iteraciones según tus necesidades
			const yCoord = y + 65 + i * 7; //  y=115   Incrementa la coordenada y por 5 en cada iteración
			this.ctx.moveTo(x, yCoord + 5); // x=100
			this.ctx.lineTo(x, yCoord + 10);
			//actorCanvas.Aancho=40;
			// console.log('alto',(yCoord+10)-actorCanvas.Ay,'ancho',x);
			//console.log(x)
			this.alto = yCoord + 10 - this.y;
		}
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
  }

  clearActor() {
    this.ctx.clearRect(this.x, this.y, this.ancho, this.ancho);
  }
  
  
  
  // Método para dibujar el actor en la posición actualizada
  draw() {
    this.drawActor(this.x, this.y);
  }
  
  // Método para actualizar la posición del actor mientras se arrastra
  updatePosition(x: number, y: number) {
    this.x = x - this.x;
    this.y = y - this.y;
    this.draw();
  }
}