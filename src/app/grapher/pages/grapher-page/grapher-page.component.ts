import { Actor } from './../../class/actor';
import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GrapherService } from '../../services/grapher.service';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import { Lifeline } from '../../class/lifeline.class';
import { Entity } from '../../class/entity';
import { FlowControl } from '../../class/flow-control';
import { Arrow } from '../../class/arrow';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { WebsocketService } from '../../services/websocket.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grapher-page',
  templateUrl: './grapher-page.component.html',
  styleUrls: ['./grapher-page.component.css'],
})
export class GrapherPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasRef', { static: false }) canvasRef: any;
  private context!: CanvasRenderingContext2D;
  private resizingLifeline: Lifeline | null = null;
  private selectedObject: Actor | Entity | FlowControl | Arrow | null = null;

  private objects: (Actor | Entity | FlowControl | Arrow)[] = [];
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  public isDeleting: boolean = false;
  private extremeArrow: string | boolean = false;
  private isArrowResizing: boolean = false;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;

  constructor(
    private grapherService: GrapherService,
    private alertsService: AlertsService,
    private wsService: WebsocketService,
  ) {}

  get isConnected(): boolean {
    return this.wsService.socketStatus
  }
  
  get clients() {
    return this.wsService.connectedClients;
  }
  
  get project(): DiagramResponse | undefined {
    return this.grapherService.project;
  }

  ngOnInit(): void {
    // this.wsService.connectClient();
    this.setupSocketListeners();
  }
  
  ngOnDestroy(): void {
    const roomName = this.project?.id;
    if (!roomName) return;
    this.wsService.leaveRoom(roomName);
  }

  ngAfterViewInit(): void {
    this.initCanvas();

    if (this.project?.data) {
      const data = this.project.data;
      this.loadProjectState(data);
    }
    
  }

  private initCanvas(): void {
    this.canvasRef.nativeElement.style.background = '#fff';
    this.context = this.canvasRef.nativeElement.getContext('2d');
  }

  // Método para configurar los listeners de sockets
  private setupSocketListeners(): void {
    this.wsService.onEvent.subscribe((data) => {
      console.log(data)
      this.loadProjectState(data);
    });
  }

  // Método para enviar un cambio al servidor
  private sendChangeToServer(data: string): void {
    const id = this.project?.id;
    if (!id) return;
    this.wsService.sendUpdateDiagram(id, data);
  }
  
  
  generateLink(): void {
    if (this.project === undefined) return;
    const id = this.project.id;
    this.grapherService.generateTokenShare(id).subscribe({
      error: (err) => {
        this.alertsService.alertError('Error al generar el enlace de compartido');
      },
    });
  }

  openModal(): void {
    this.generateLink();
    this.grapherService.openModal();
  }

  openModalSave(): void {
    this.grapherService.openModalSave();
    const data = this.saveProjectState();
    this.grapherService.setDataCurrentProject(data);
  }
  
  // Guarda el estado del proyecto
  saveProjectState(): string {
    const data = this.objects.map((obj) => ({
      type: obj.constructor.name,
      attributes: { ...obj },
    }));
    const dataString = JSON.stringify(data);
    this.sendChangeToServer(dataString);
    return dataString;
  }

  // Carga los objetos guardados en el proyecto
  loadProjectState(projectsJson: string): void {
    const objects = JSON.parse(projectsJson);

    this.objects = objects.map((obj: any) => {
      let object: Actor | Entity | FlowControl | Arrow;
      
      switch (obj.type) {
        case 'Actor':
          const actor = new Actor(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text
          );
          actor.textYPosition = obj.attributes.textYPosition;
          actor.lifeline = new Lifeline(
            obj.attributes.lifeline.x,
            obj.attributes.lifeline.y,
            obj.attributes.lifeline.height
          );
          object = actor;
          break;
        case 'Entity':
          const entity = new Entity(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.stereotype,
            obj.attributes.text
          );
          entity.lifeline = new Lifeline(
            obj.attributes.lifeline.x,
            obj.attributes.lifeline.y,
            obj.attributes.lifeline.height
          );
          object = entity;
          break;
        case 'FlowControl':
          const flowControl = new FlowControl(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text
          );
          flowControl.height = obj.attributes.height;
          flowControl.width = obj.attributes.width;
          object = flowControl;
          break;
        case 'Arrow':
          const arrow = new Arrow(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text,
            obj.attributes.dashed
          );
          arrow.endX = obj.attributes.endX;
          object = arrow;
          break;
        default:
          throw new Error(`Unsupported diagram element type: ${obj.type}`);
      }
      
      return object;
    });
    
    this.redrawCanvas();
  }

  // Función para volver a dibujar el canvas con los objetos actualizados
  private redrawCanvas(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    
    this.objects.forEach((obj) => {
      obj.draw(this.context);
    });
  }
  
  private async inputName(objtect: Actor | Entity) {
    const { value: text } = await Swal.fire({
      title: "Ingrese un nombre",
      input: "text",
      showCancelButton: true,
      inputValidator: (value: string) => {
        if (!value) {
          return "Ingrese un nombre!";
        }
        return null;
      }
    });
    if (text) {
      this.objects.push(objtect);
      objtect.text = text;
      this.redrawCanvas();
    }
    
  }

  async addActor() {
    const actor = new Actor(100, 100, 'Actor');
    await this.inputName(actor);
  }

  async addInterface() {
    const interfa = new Entity(150, 90, '<< Interface >>', 'Interface');
    await this.inputName(interfa);
  }

  async addControl() {
    const control = new Entity(320, 90, '<< Control >>', 'Control');
    await this.inputName(control);
  }

  async addEntity() {
    const entity = new Entity(490, 90, '<< Entity >>', 'Entity');
    await this.inputName(entity);
  }

  addLoop() {
    const loop = new FlowControl(200, 200, '[Loop]');
    this.objects.push(loop);
    this.redrawCanvas();
  }

  addAlt() {
    const alt = new FlowControl(420, 250, '[Alt]');
    this.objects.push(alt);
    this.redrawCanvas();
  }

  addRightArrow() {
    const rightArrow = new Arrow(100, 220, 'Mensaje', false);
    this.objects.push(rightArrow);
    this.redrawCanvas();
  }

  addLeftArrow() {
    const leftArrow = new Arrow(100, 270, 'Respuesta', true);
    this.objects.push(leftArrow);
    this.redrawCanvas();
  }

  enableDelete(): void {
    this.isDeleting = !this.isDeleting;
  }

  // Manejar eventos de clic y arrastre en el canvas
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
      this.checkForOtherInteractions(mouseX, mouseY, event);
    }
    
    this.saveProjectState();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isDragging && this.selectedObject) {
      this.performDragging(mouseX, mouseY);
    } else if (this.isResizing && this.selectedObject) {
      this.performResizing(mouseX, mouseY);
    } else if (this.isArrowResizing && this.selectedObject) {
      this.performArrowResizing(mouseX, mouseY);
    } else if (this.resizingLifeline) {
      this.performLifelineResizing(mouseY);
    }
    
    this.saveProjectState();
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.resetInteractionState();
    this.saveProjectState();
  }

  // Método para manejar el clic en el canvas
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verifica si se hizo clic en un objeto y lo elimina
    if (this.isDeleting) {
      this.checkForDeleteObject(mouseX, mouseY);
      this.saveProjectState();
    }
    
  }

  private checkForLifelineResizeControl(mouseX: number, mouseY: number): void {
    this.objects.forEach((obj) => {
      if (
        (obj instanceof Actor || obj instanceof Entity) &&
        obj.lifeline.isResizeHandleClicked(mouseX, mouseY)
      ) {
        this.resizingLifeline = obj.lifeline;
      }
    });
  }

  private performDragging(mouseX: number, mouseY: number): void {
    if (this.selectedObject) {
      const dx = mouseX - (this.selectedObject.x + this.dragOffsetX);
      const dy = mouseY - (this.selectedObject.y + this.dragOffsetY);
      this.selectedObject.move(dx, dy);
      this.redrawCanvas();

      // Ajusta dragOffset para el próximo movimiento
      this.dragOffsetX = mouseX - this.selectedObject.x;
      this.dragOffsetY = mouseY - this.selectedObject.y;
    }
  }

  private performResizing(mouseX: number, mouseY: number): void {
    if (this.selectedObject && this.selectedObject instanceof FlowControl) {
      const newWidth = mouseX - this.selectedObject.x;
      const newHeight = mouseY - this.selectedObject.y;
      this.selectedObject.resize(newWidth, newHeight);
      this.redrawCanvas();
    }
  }

  private performArrowResizing(mouseX: number, mouseY: number): void {
    if (this.selectedObject && this.selectedObject instanceof Arrow) {
      if (this.isArrowResizing && this.extremeArrow === 'right') {
        // const newWidth = mouseX - this.selectedObject.endX;
        this.selectedObject.resizeRight(mouseX);
      } else if (this.isArrowResizing && this.extremeArrow === 'left') {
        this.selectedObject.resizeLeft(mouseX);
      }
      this.redrawCanvas();
    }
  }

  private performLifelineResizing(mouseY: number): void {
    if (this.resizingLifeline) {
      const newLength = mouseY - this.resizingLifeline.y;
      this.resizingLifeline.resize(newLength);
      this.redrawCanvas();
    }
  }

  private checkForOtherInteractions(
    mouseX: number,
    mouseY: number,
    event: MouseEvent
  ): void {
    // Itera sobre los elementos para ver si se debe mover o redimensionar alguno
    this.objects.forEach((obj) => {
      if (
        obj instanceof FlowControl &&
        obj.isResizeHandleClicked(mouseX, mouseY)
      ) {
        this.selectedObject = obj;
        this.isResizing = true;
        event.preventDefault();
        // return;
      } else if (
        obj instanceof Arrow &&
        obj.isResizeHandleClicked(mouseX, mouseY)
      ) {
        this.extremeArrow = obj.isResizeHandleClicked(mouseX, mouseY);
        if (this.extremeArrow) {
          this.selectedObject = obj;
          this.isArrowResizing = true;
          event.preventDefault();
          // return;
        }
      } else if (!this.isResizing && obj.isPointInside(mouseX, mouseY)) {
        this.canvasRef.nativeElement.style.cursor = 'move';
        this.selectedObject = obj;
        this.dragOffsetX = mouseX - obj.x;
        this.dragOffsetY = mouseY - obj.y;
        this.isDragging = true;
        event.preventDefault();
      }
    });
  }

  private checkForDeleteObject(mouseX: number, mouseY: number): void {
    // Itera sobre los objetos y verifica si se hizo clic en alguno
    this.objects.forEach((obj, i) => {
      if (obj.isPointInside(mouseX, mouseY)) {
        // Elimina el objeto y detiene la iteración
        this.objects.splice(i, 1);
        this.redrawCanvas();
        return;
      }
    });
  }

  private getObjectAtPosition(x: number, y: number) {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (obj.isPointInside(x, y)) {
        return obj;
      }
    }
    return null;
  }

  private resetInteractionState(): void {
    this.isDragging = false;
    this.isResizing = false;
    this.isArrowResizing = false;
    this.extremeArrow = false;
    this.selectedObject = null;
    this.resizingLifeline = null;
    this.canvasRef.nativeElement.style.cursor = 'default';
  }

  
}
