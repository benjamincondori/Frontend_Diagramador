import { EventEmitter, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface UserData {
  id: string,
  fullname: string,
  photo: string,
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService extends Socket {
  public socketStatus: boolean = false;
  public connectedClients: UserData[] = [];
  public onEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
  ) {
    const token = localStorage.getItem('token') || '';
    super({ url: environment.wsUrl, 
      options: {
        extraHeaders: {
          authentication: token,
        },
        query: {
          nameRoom: cookieService.get('room'),
        }
      }
    });
    this.checkStatus();
    this.listenToServer();
  }

  checkStatus() {    
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }
  
  listenToServer() {
    this.socket.on('clients-updated', (data: UserData[]) => {
      this.connectedClients = data;
      console.log({ clients: this.connectedClients });
    })
    
    this.socket.on('update-diagram-server', (data: string) => {
      this.onEvent.emit(data);
      console.log(data);
    });
  }
  
  joinRoom(roomName: string) {
    this.socket.emit('join-room', roomName);
    // this.connectClient();
  }
  
  leaveRoom(roomName: string) {
    this.socket.emit('leave-room', roomName);
    // this.disconnectClient();
  }
  
  sendUpdateDiagram(id: string, data: string) {
    this.socket.emit('update-diagram-client', { id, data })
  }
  
  connectClient() {
    this.socket.connect();
  }
  
  disconnectClient() {
    this.socket.disconnect();
  }
}
