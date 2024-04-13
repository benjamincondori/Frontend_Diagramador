import { Actor, Alt, ClassElement, LeftArrow, Loop, Message, RightArrow } from './../../class/diagram-element';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GrapherService } from '../../services/grapher.service';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';

import { fabric } from 'fabric';
import Swal from 'sweetalert2';
import { Entity } from '../../class/entity.class';
import { Figura } from '../../class/figura';
import { Personita } from '../../class/personita';
import { DiagramElement, Lifeline } from '../../class/diagram-element';


@Component({
  selector: 'app-grapher-page',
  templateUrl: './grapher-page.component.html',
  styleUrls: ['./grapher-page.component.css']
})
export class GrapherPageComponent implements OnInit, AfterViewInit {
  
  constructor(
    private grapherService: GrapherService,
  ) {}
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.initCanvas();
  }
  
  private initCanvas(): void {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.render(); // Dibuja inicialmente el canvas vacío o con elementos predefinidos si los hay
  }
  
  get project(): DiagramResponse | undefined {
    return this.grapherService.project;
  }
  
  openModal(): void {
    this.grapherService.openModal();
  }
  
  // -------------------------------
  
  // canvas: any;
  // actors: Actor[] = [];
  // isDragging: boolean = false;
  // isDeleting: boolean = false;
  // dragStartX: number = 0;
  // dragStartY: number = 0;

  // ngOnInit(): void {
  //   this.canvas = new fabric.Canvas('canvas', {
  //     width: 800,
  //     height: 600,
  //     backgroundColor: '#f0f0f0'
  //   });

  //   // this.canvas.on('mouse:down', (options: fabric.IEvent) => {
  //   //   this.dragStartX = options.pointer!.x;
  //   //   this.dragStartY = options.pointer!.y;
  //   // });

  //   // this.canvas.on('mouse:up', (options: fabric.IEvent) => {
  //   //   if (this.isDragging) {
  //   //     const deltaX = options.pointer!.x - this.dragStartX;
  //   //     const deltaY = options.pointer!.y - this.dragStartY;
  //   //     const actor = new Actor(this.canvas, this.dragStartX + deltaX, this.dragStartY + deltaY, 'texto');
  //   //     this.actors.push(actor);
  //   //     this.isDragging = false;
  //   //   }
  //   // });
    
    // this.canvas.on('mouse:down', (options: fabric.IEvent) => {
    //   if (options.target) {
    //     this.canvas.setActiveObject(options.target);
    //   } else {
    //     this.canvas.discardActiveObject().renderAll();
    //   }
    // });
    
    // this.canvas.on('mouse:down', (options: fabric.IEvent) => {
    //   if (this.isDeleting && options.target) {
    //     this.eliminarActor(options.target);
    //   }
    // });

    // this.canvas.on('object:moving', (options: fabric.IEvent) => {
    //   const obj = options.target;
    //   if (obj) {
    //     // Actualizar las coordenadas del objeto mientras se mueve
    //     obj.setCoords();
    //   }
    // });
      
  // }
  
  // async agregarActor() {
  //   const { value: text } = await Swal.fire({
  //     title: "Ingrese un nombre",
  //     input: "text",
  //     showCancelButton: true,
  //     inputValidator: (value) => {
  //       if (!value) {
  //         return "Ingrese un nombre!";
  //       }
  //       return null;
  //     }
  //   });
  //   if (text) {
  //     const actor = new Actor(this.canvas, Math.random() * 700, Math.random() * 500, text);
  //     this.actors.push(actor);
  //   } 
  // }
  
  // async agregarInterface() {
  //   const { value: text } = await Swal.fire({
  //     title: "Ingrese un nombre",
  //     input: "text",
  //     showCancelButton: true,
  //     inputValidator: (value) => {
  //       if (!value) {
  //         return "Ingrese un nombre!";
  //       }
  //       return null;
  //     }
  //   });
  //   if (text) {
  //     const interfa = new Entity(this.canvas, Math.random() * 700, Math.random() * 500, '<<interface>>', text);
  //     this.actors.push(interfa);
  //   } 
  // }
  
  // async agregarControl() {
  //   const { value: text } = await Swal.fire({
  //     title: "Ingrese un nombre",
  //     input: "text",
  //     showCancelButton: true,
  //     inputValidator: (value) => {
  //       if (!value) {
  //         return "Ingrese un nombre!";
  //       }
  //       return null;
  //     }
  //   });
  //   if (text) {
  //     const control = new Entity(this.canvas, Math.random() * 700, Math.random() * 500, '<<control>>', text);
  //     this.actors.push(control);
  //   } 
  // }
  
  // async agregarEntity() {
  //   const { value: text } = await Swal.fire({
  //     title: "Ingrese un nombre",
  //     input: "text",
  //     showCancelButton: true,
  //     inputValidator: (value) => {
  //       if (!value) {
  //         return "Ingrese un nombre!";
  //       }
  //       return null;
  //     }
  //   });
  //   if (text) {
  //     const entity = new Entity(this.canvas, Math.random() * 700, Math.random() * 500, '<<entity>>', text);
  //     this.actors.push(entity);
  //   } 
  // }
  
  // activarEliminar(): void {
  //   this.isDeleting = !this.isDeleting;
  //   if (this.isDeleting) {
  //     console.log('Modo Eliminar activado');
  //   } else {
  //     console.log('Modo Eliminar desactivado');
  //   }
  // }

  // eliminarActor(obj: any): void {
  //   this.canvas.remove(obj);
  //   this.actors = this.actors.filter(actor => actor.group !== obj);
  // }
  
  // ========== CANVAS PURO ==============
  
  
  
  @ViewChild('canvasRef', { static: false }) canvasRef: any;
  private cx!: CanvasRenderingContext2D;
  public diagramElements: DiagramElement[] = [];
  private selectedElement: DiagramElement | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private isDragging: boolean = false; // Añade esta línea
  // Añade las nuevas propiedades
  private isResizing: boolean = false;
  private resizingEdges: {
    nearLeftEdge: boolean;
    nearRightEdge: boolean;
    nearTopEdge: boolean;
    nearBottomEdge: boolean;
  } | null = null;

  private resizingLifeline: Lifeline | null = null;

  private render(): void {
    this.cx.font = '16px Poppins'; // Aumenta el tamaño del texto
    this.cx.textAlign = 'center';
    if (!this.cx) return;
    this.cx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    this.diagramElements.forEach((element) => element.draw(this.cx));
  }

  public addActor(): void {
    const actor = new Actor(100, 100); // Valores ejemplo
    this.diagramElements.push(actor);
    this.render();
  }

  public addClassElement(): void {
    const classElement = new ClassElement(200, 100, 150, 80, 'New Class');
    this.diagramElements.push(classElement);
    this.render();
  }

  public addMessage(): void {
    const message = new Message(100, 150, 100, 'text example'); // Coordenadas y texto de ejemplo
    this.diagramElements.push(message);
    this.render();
  }

  public addLoop(): void {
    const loop = new Loop(100, 200, 200, 100); // Valores de ejemplo para posición y tamaño
    this.diagramElements.push(loop);
    this.render(); // Actualiza el canvas
  }

  public addAlt(): void {
    const alt = new Alt(150, 250, 200, 100); // Ejemplo de posición y tamaño
    this.diagramElements.push(alt);
    this.render(); // Actualiza el canvas
  }

  public addRightArrow(): void {
    const arrow = new RightArrow(100, 200, 250); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  public addLeftArrow(): void {
    const arrow = new LeftArrow(250, 200, 100); // Posición y longitud ejemplo
    this.diagramElements.push(arrow);
    this.render();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Resetea el estado
    this.resetInteractionState();

    // Primero, verifica si se hizo clic en algún controlador de redimensionamiento de línea de vida
    this.checkForLifelineResizeControl(mouseX, mouseY);

    if (!this.resizingLifeline) {
      // Procede solo si NO se está interactuando con una línea de vida
      // Luego, verifica otros tipos de interacciones como mover o redimensionar
      this.checkForOtherInteractions(mouseX, mouseY, event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isDragging && this.selectedElement) {
      this.performDragging(mouseX, mouseY);
    } else if (this.isResizing && this.selectedElement) {
      this.performResizing(mouseX, mouseY);
    } else if (this.resizingLifeline) {
      this.performLifelineResizing(mouseY);
    }
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.resetInteractionState();
  }

  private resetInteractionState(): void {
    this.isDragging = false;
    this.isResizing = false;
    this.resizingEdges = null;
    this.selectedElement = null;
    this.resizingLifeline = null;
  }

  private checkForLifelineResizeControl(mouseX: number, mouseY: number): void {
    // Busca si el clic fue en el control de redimensionamiento de alguna línea de vida
    this.diagramElements.forEach((element) => {
      if (
        (element instanceof Actor || element instanceof ClassElement) &&
        element.lifeline.isResizeControlClicked(mouseX, mouseY)
      ) {
        this.resizingLifeline = element.lifeline;
      }
    });
  }

  private checkForOtherInteractions(
    mouseX: number,
    mouseY: number,
    event: MouseEvent
  ): void {
    // Itera sobre los elementos para ver si se debe mover o redimensionar alguno
    this.diagramElements.forEach((element) => {
      if (element instanceof Loop || element instanceof Alt) {
        const edges = element.isNearEdge(mouseX, mouseY);
        if (
          edges.nearLeftEdge ||
          edges.nearRightEdge ||
          edges.nearTopEdge ||
          edges.nearBottomEdge
        ) {
          this.selectedElement = element;
          this.isResizing = true;
          this.resizingEdges = edges;
          event.preventDefault();
          return;
        }
      }
      if (!this.isResizing && element.containsPoint(mouseX, mouseY)) {
        this.selectedElement = element;
        this.dragOffsetX = mouseX - element.x;
        this.dragOffsetY = mouseY - element.y;
        this.isDragging = true;
        event.preventDefault();
      }
    });
  }

  private performDragging(mouseX: number, mouseY: number): void {
    if (this.selectedElement) {
      // Asegura que selectedElement no es null
      const dx = mouseX - (this.selectedElement.x + this.dragOffsetX);
      const dy = mouseY - (this.selectedElement.y + this.dragOffsetY);
      this.selectedElement.move(dx, dy);
      // Ajusta dragOffset para el próximo movimiento
      this.dragOffsetX = mouseX - this.selectedElement.x;
      this.dragOffsetY = mouseY - this.selectedElement.y;
      this.render();
    }
  }

  private performResizing(mouseX: number, mouseY: number): void {
    if (this.selectedElement && this.resizingEdges) {
      const newWidth = Math.max(20, mouseX - this.selectedElement.x); // Evita tamaños negativos o demasiado pequeños
      const newHeight = Math.max(20, mouseY - this.selectedElement.y);
      this.selectedElement.resize(newWidth, newHeight);
      this.render();
    }
  }

  private performLifelineResizing(mouseY: number): void {
    // Ajusta la longitud de la línea de vida solo si se está redimensionando específicamente una línea de vida
    if (this.resizingLifeline) {
      const newLength = Math.max(20, mouseY - this.resizingLifeline.y); // La longitud debe ser al menos 20 para evitar ser demasiado pequeña
      this.resizingLifeline.resize(newLength);
      this.render();
    }
  }
  //Edicion de textos
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    this.selectedElement = this.getElementAtPosition(mouseX, mouseY);

    if (this.selectedElement) {
      this.editElementText(this.selectedElement);
    }
  }

  private editElementText(element: DiagramElement): void {
    const newText = prompt('Ingrese el nuevo texto:', element.text);
    if (newText !== null && newText.trim() !== '') {
      element.text = newText.trim();
      this.render();
    }
  }

  private getElementAtPosition(x: number, y: number): DiagramElement | null {
    // Itera en orden inverso para   seleccionar el elemento más "superior" en caso de superposición
    for (let i = this.diagramElements.length - 1; i >= 0; i--) {
      if (this.diagramElements[i].containsPoint(x, y)) {
        return this.diagramElements[i];
      }
    }
    return null; // Ningún elemento encontrado en esta posición
  }

  saveDiagramState(): string {
    const diagramState = this.diagramElements.map((element) => {
      const baseState = {
        type: element.constructor.name,
        x: element.x,
        y: element.y,
        text: element.text,
      };

      if (element instanceof Actor || element instanceof ClassElement) {
        return {
          ...baseState,
          width: element.width,
          height: element.height,
          lifelineLength: element.lifeline.length,
        };
      } else if (element instanceof Message) {
        return { ...baseState, width: element.width };
      } else if (element instanceof Loop || element instanceof Alt) {
        return { ...baseState, width: element.width, height: element.height };
      } else if (
        element instanceof RightArrow ||
        element instanceof LeftArrow
      ) {
        return { ...baseState, endX: element.endX, dashed: element.dashed };
      }

      return baseState;
    });

    return JSON.stringify(diagramState);
  }

  loadDiagramState(diagramJSON: string): void {
    const diagramState = JSON.parse(diagramJSON);
    this.diagramElements = diagramState.map((elementState: any) => {
      let element;
      switch (elementState.type) {
        case 'Actor':
          element = new Actor(
            elementState.x,
            elementState.y,
            elementState.text
          );
          element.width = elementState.width;
          element.height = elementState.height;
          element.lifeline = new Lifeline(
            elementState.x + elementState.width / 2,
            elementState.y + 100 + 15,
            elementState.lifelineLength
          );
          break;
        case 'ClassElement':
          element = new ClassElement(
            elementState.x,
            elementState.y,
            elementState.width,
            elementState.height,
            elementState.text
          );
          element.lifeline = new Lifeline(
            elementState.x + elementState.width / 2,
            elementState.y + elementState.height,
            elementState.lifelineLength
          );
          break;
        case 'Message':
          element = new Message(
            elementState.x,
            elementState.y,
            elementState.width,
            elementState.text
          );
          break;
        case 'Loop':
        case 'Alt':
          element =
            elementState.type === 'Loop'
              ? new Loop(
                  elementState.x,
                  elementState.y,
                  elementState.width,
                  elementState.height
                )
              : new Alt(
                  elementState.x,
                  elementState.y,
                  elementState.width,
                  elementState.height
                );
          break;
        case 'RightArrow':
        case 'LeftArrow':
          element =
            elementState.type === 'RightArrow'
              ? new RightArrow(
                  elementState.x,
                  elementState.y,
                  elementState.endX,
                  elementState.text
                )
              : new LeftArrow(
                  elementState.x,
                  elementState.y,
                  elementState.endX,
                  elementState.text
                );
          element.dashed = elementState.dashed;
          break;
        default:
          throw new Error(`Unrecognized element type: ${elementState.type}`);
      }

      return element;
    });

    this.render();
  }
  
 

  
  
}
