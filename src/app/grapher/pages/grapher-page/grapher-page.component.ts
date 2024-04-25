import { Actor } from './../../class/actor';
import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { LoopArrow } from '../../class/arrow-loop';
import * as jspdf from 'jspdf';
import { NameClass } from '../../class/name-class.enum';
import { Message } from '../../class/message';

@Component({
  selector: 'app-grapher-page',
  templateUrl: './grapher-page.component.html',
  styleUrls: ['./grapher-page.component.css'],
})
export class GrapherPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  public imagenURL?: string;
  private context!: CanvasRenderingContext2D;
  private resizingLifeline: Lifeline | null = null;
  private selectedObject:
    | Actor
    | Entity
    | FlowControl
    | Arrow
    | LoopArrow
    | Message
    | null = null;

  private objects: (
    | Actor
    | Entity
    | FlowControl
    | Arrow
    | LoopArrow
    | Message
  )[] = [];
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
    private wsService: WebsocketService
  ) {}

  get isConnected(): boolean {
    return this.wsService.socketStatus;
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
    this.context = this.canvasRef.nativeElement.getContext('2d')!;
  }

  // Método para configurar los listeners de sockets
  private setupSocketListeners(): void {
    this.wsService.onEvent.subscribe((data) => {
      console.log(data);
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
        this.alertsService.alertError(
          'Error al generar el enlace de compartido'
        );
      },
    });
  }

  openModal(): void {
    this.generateLink();
    this.grapherService.openModal();
  }

  openModalSave(): void {
    this.saveAsImage();
    this.grapherService.openModalSave();
    const data = this.saveProjectState();
    this.grapherService.setDataCurrentProject(data);
  }

  // Guarda el estado del proyecto
  saveProjectState(): string {
    const data = this.objects.map((obj) => ({
      type: obj.type,
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
      let object: Actor | Entity | FlowControl | Arrow | LoopArrow | Message;

      switch (obj.type) {
        case NameClass.Actor:
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
        case NameClass.Entity:
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
        case NameClass.FlowControl:
          const flowControl = new FlowControl(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text
          );
          flowControl.height = obj.attributes.height;
          flowControl.width = obj.attributes.width;
          object = flowControl;
          break;
        case NameClass.Arrow:
          const arrow = new Arrow(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text,
            obj.attributes.dashed
          );
          arrow.endX = obj.attributes.endX;
          arrow.async = obj.attributes.async;
          object = arrow;
          break;
        case NameClass.LoopArrow:
          const loopArrow = new LoopArrow(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text
          );
          object = loopArrow;
          break;
        case NameClass.Message:
          const message = new Message(
            obj.attributes.x,
            obj.attributes.y,
            obj.attributes.text,
            this.context
          );
          object = message;
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

  private async inputName(
    object: Actor | Entity | Arrow | LoopArrow | Message,
    isEdit = false,
    title = 'Ingrese un nombre'
  ) {
    const { value: text } = await Swal.fire({
      title: title,
      input: 'text',
      inputValue: object.text,
      showCancelButton: true,
      inputValidator: (value: string) => {
        if (!value) {
          return 'Ingrese un nombre!';
        }
        return null;
      },
    });
    if (text) {
      if (!isEdit) {
        this.objects.push(object);
      }
      object.text = text;
      this.redrawCanvas();
    }
  }

  async addActor() {
    const actor = new Actor(100, 50, '');
    await this.inputName(actor);
  }

  async addInterface() {
    const interfa = new Entity(150, 40, '<< Interface >>', '');
    await this.inputName(interfa);
  }

  async addControl() {
    const control = new Entity(320, 40, '<< Control >>', '');
    await this.inputName(control);
  }

  async addEntity() {
    const entity = new Entity(490, 40, '<< Entity >>', '');
    await this.inputName(entity);
  }

  async addMessage() {
    const message = new Message(600, 170, '', this.context);
    await this.inputName(message, false, 'Ingrese un mensaje');
  }

  addLoop() {
    const loop = new FlowControl(420, 200, 'Loop');
    this.objects.push(loop);
    this.redrawCanvas();
  }

  addAlt() {
    const alt = new FlowControl(640, 250, 'Alt');
    this.objects.push(alt);
    this.redrawCanvas();
  }

  addRightArrow() {
    const rightArrow = new Arrow(100, 220, 'Mensaje', false);
    this.objects.push(rightArrow);
    this.redrawCanvas();
  }

  addRightSyncArrow() {
    const rightArrow = new Arrow(100, 250, 'Mensaje', false, true);
    this.objects.push(rightArrow);
    this.redrawCanvas();
  }

  addLeftArrow() {
    const leftArrow = new Arrow(100, 280, 'Respuesta', true);
    this.objects.push(leftArrow);
    this.redrawCanvas();
  }

  addLoopArrow() {
    const loopArrow = new LoopArrow(100, 310, 'Mensaje');
    this.objects.push(loopArrow);
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

  @HostListener('dblclick', ['$event'])
  editText(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.selectedObject = this.getObjectAtPosition(mouseX, mouseY);
    if (
      this.selectedObject &&
      (this.selectedObject instanceof Actor ||
        this.selectedObject instanceof Entity)
    ) {
      this.inputName(this.selectedObject, true);
    } else if (
      this.selectedObject &&
      (this.selectedObject instanceof Arrow ||
        this.selectedObject instanceof LoopArrow ||
        this.selectedObject instanceof Message)
    ) {
      this.inputName(this.selectedObject, true, 'Ingrese un mensaje');
    }
    this.saveProjectState();
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

      this.objects.forEach((obj) => {
        if (obj instanceof Actor || obj instanceof Entity) {
          obj.lifeline.resize(newLength);
        }
      });

      // this.resizingLifeline.resize(newLength);
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

  saveAsImage() {
    const canvas = this.canvasRef.nativeElement;
    const temporalCanvas = document.createElement('canvas');
    const ctx = temporalCanvas.getContext('2d');

    temporalCanvas.width = canvas.width;
    temporalCanvas.height = canvas.height;

    // Establecer un fondo blanco en el canvas temporal
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, temporalCanvas.width, temporalCanvas.height);

    // Copiar el contenido del canvas original al canvas temporal
    ctx!.drawImage(canvas, 0, 0);

    // Obtener la URL de la imagen del canvas temporal
    this.imagenURL = temporalCanvas.toDataURL('image/png');

    // Crear un enlace temporal para descargar la imagen
    // const link = document.createElement('a');
    // console.log(link);
    // link.href = this.imagenURL;
    // link.download = 'mi_diagrama.png';
    // link.click();
  }

  guardarComoPDF() {
    const canvas = this.canvasRef.nativeElement;
    const pdf = new jspdf.jsPDF('l', 'px', [canvas.width, canvas.height]);

    // Obtener la imagen del canvas como formato de datos
    const imagenData = canvas.toDataURL('image/png');

    // Agregar la imagen al PDF
    pdf.addImage(imagenData, 'PNG', 0, 0, canvas.width, canvas.height);

    // Guardar el PDF
    pdf.save('mi_dibujo.pdf');
  }
}
