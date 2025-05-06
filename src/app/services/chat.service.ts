import { Injectable, Inject } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { SOCKET_INSTANCE } from '../app.config';
import { environment } from '../environments/environment';
import { io } from 'socket.io-client';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // public socket = io(environment.soketServer);

  // sendMessage(mensaje: string){
  //   const payload = {
  //     de: this.wsService.usuario?.nombre ?? 'Unknown',
  //     cuerpo: mensaje
  //   }
  //   this.wsService.emit('mensaje', payload);
  // }

  // getMessage(){
  //   return this.wsService.listen('mensaje-nuevo');
  // }

  // getMessagePrivate(){
  //   return this.wsService.listen('mensaje-privado');
  // }
  // getUsuariosActivos(){
  //   return this.wsService.listen('usuarios-activos');
  // }

  // emitirUsuariosActivos(){
  //   this.wsService.emit('obtener-usuarios');
  // }

  constructor(
    // private socket : Socket,
    // @Inject(SOCKET_INSTANCE) private socket: Socket
  ) { }

  public sendMessage(message:string){
    // console.log('Socket instance:', this.socket);
    // this.socket.emit('message', message);
    console.log(message);
    
  }
  public listMessage(){
    // return this.socket.fromEvent('received').pipe(map((data)=>data));
  }
}
