// actor.ts
import { fabric } from 'fabric';

export class Actor {
  
  public group: fabric.Group;

  constructor(canvas: fabric.Canvas, left: number, top: number, name: string) {
    
    // Crear la cabeza del actor
    const head = new fabric.Circle({
      radius: 10,
      fill: 'black',
      originX: 'center',
      originY: 'center',
    });
    
    // Crear el cuerpo del actor
    const body = new fabric.Line([0, 10, 0, 25], {
      stroke: 'black',
      strokeWidth: 2,
      originX: 'center',
      originY: 'top',
    });
    
    // Crear los brazos del actor
    const arms = new fabric.Line([-10, 15, 10, 15], { // 
      stroke: 'black',
      strokeWidth: 2,
      originX: 'center',
      originY: 'top',
    });
    
    // Crear las piernas del actor
    const legs = new fabric.Group([
      new fabric.Line([0, 23, -10, 40], {
        stroke: 'black',
        strokeWidth: 2,
        originX: 'center',
        originY: 'top',
      }),
      new fabric.Line([0, 23, 10, 40], {
        stroke: 'black',
        strokeWidth: 2,
        originX: 'center',
        originY: 'top',
      }),
    ]);
    
    const actorNameText = new fabric.IText(name, {
      originX: 'center',
      top: 42,
      fontFamily: 'Poppins',
      fontSize: 16,
      fill: 'black',
      width: 100,
      hasControls: false,
      hasBorders: false
    });

    // Crear la línea de vida del actor
    const lifeLine = new fabric.Line([0, 65, 0, 400], {
      stroke: 'black',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
    });

    // Agrupar todas las partes del actor
    this.group = new fabric.Group([head, body, arms, legs, actorNameText, lifeLine], {
      left: left,
      top: top,
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    canvas.add(this.group);
  }
}
