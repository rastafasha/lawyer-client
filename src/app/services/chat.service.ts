import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
const urlSocket = environment.soketServer;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket!: Socket;
  // URL de tu servidor backend (cámbiala si es necesario)
  private url = urlSocket;

  // Guardamos el historial de mensajes del chat actual
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$: Observable<any[]> = this.messagesSubject.asObservable();

  constructor(private authService: AuthService) {
    this.connectSocket();
  }

 private connectSocket() {
    // Obtenemos los datos del usuario logueado
    const user = this.authService.getLocalStorage(); 
    const token = localStorage.getItem('token');

    this.socket = io(this.url, {
      // 1. Enviamos el uid en la query tal como lo pide tu backend
      query: {
        uid: user?.uid
      },
      // 2. Enviamos el token en auth por seguridad estándar
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'] 
    });

    // Escuchar mensajes privados entrantes del backend
    this.socket.on('mensaje-privado', (msg: any) => {
      const currentMessages = this.messagesSubject.value;
      // Añadimos el mensaje recibido al flujo del chat
      this.messagesSubject.next([...currentMessages, msg]);
    });

    this.socket.on('connect', () => console.log('Conectado al chat de sockets'));
    this.socket.on('disconnect', () => console.log('Desconectado del chat'));
  }

  // Método para emitir el mensaje privado hacia el servidor
  sendMessage(message: string, fromUserId: string, toUserId: string) {
    const payload = {
      de: fromUserId,
      para: toUserId,
      message: message,
      fecha: new Date()
    };
    
    // Emitimos al servidor de Node.js
    this.socket.emit('mensaje-privado', payload);

    // Añadimos nuestro mensaje a la lista local inmediatamente para verlo en pantalla
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, payload]);
  }

  // Método para limpiar el chat al cambiar de usuario o cerrar pantalla
  setMessages(messages: any[]) {
    this.messagesSubject.next(messages);
  }
}
