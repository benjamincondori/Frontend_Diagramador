// entity.ts
import { fabric } from 'fabric';

export class Entity {
  public group: fabric.Group;

  constructor(canvas: fabric.Canvas, left: number, top: number, text1: string, text2: string) {
    // Crear la caja (rectángulo)
    // const box = new fabric.Rect({
    //   width: 100,
    //   height: 60,
    //   fill: 'black',
    //   originX: 'center',
    //   originY: 'center',
    // });

    // // Crear los textos
    // const textTop = new fabric.Text(text1, {
    //   originX: 'center',
    //   top: -20,
    //   fontFamily: 'Poppins',
    //   fontSize: 15,
    //   fill: 'white',
    // });

    // const textBottom = new fabric.Text(text2, {
    //   originX: 'center',
    //   top: 0,
    //   fontFamily: 'Poppins',
    //   fontSize: 16,
    //   fill: 'white',
    // });
    
    // Crear el Textbox con los dos textos
    const textbox = new fabric.Textbox(`${text1}\n${text2}`, {
      left: 0,
      top: 0,
      width: 100, // Ancho inicial (puede ajustarse según tus necesidades)
      fontFamily: 'Poppins',
      fontSize: 16,
      fill: 'white',
      textAlign: 'center',
      padding: 30,
      backgroundColor: 'black',
      lockScalingX: false, // Bloquear el escalado horizontal
      lockScalingY: false, // Bloquear el escalado vertical
    });
    
    // Crear la línea de vida del actor
    const lifeLine = new fabric.Line([50, 40, 50, 400], {
      stroke: 'black',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
    });

    // Agrupar la caja y los textos
    this.group = new fabric.Group([textbox, lifeLine], {
      left: left,
      top: top,
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    canvas.add(this.group);
  }
}
