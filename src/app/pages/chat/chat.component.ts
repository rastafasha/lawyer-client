import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/usuario.service';
import { ProfileService } from '../../services/profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    ImagenPipe, BackButtnComponent,
    ReactiveFormsModule, HeaderComponent,
    NgClass, FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  // Propiedades de la vista
  public pageTitle = 'Chat';
  public message: string = '';
  public tema: string = '';

  // Datos de usuario y perfiles
  public user!: any;
  public user_selected!: any;
  public client_id!: number;
  public profile!: any; // Ajustado según tu getByUser

  // Señal reactiva para renderizar los mensajes
  public messages = signal<any[]>([]);

  private chatSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.user = this.authService.getLocalStorage();
  }

  ngOnInit() {
    // 1. Escuchar parámetros de la URL para cargar el perfil del destinatario
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getUserProfile(id);
    });

    // 2. Escuchar los mensajes en tiempo real (Sockets) una sola vez
    this.chatSub = this.chatService.messages$.subscribe(msgs => {
      this.messages.set(msgs);
    });
  }

  getUserProfile(id: string) {
    this.profileService.getByUser(id).subscribe((resp: any) => {
      this.profile = resp.profile;

      // Asumimos que obtienes el id del cliente desde el perfil seleccionado
      this.client_id = resp.profile.usuario.uid || id;

      // Una vez que tenemos los IDs correctos, cargamos el historial de la BD
      this.listMessage();
    });
  }

  // Cargar el historial de mensajes pasados desde el Backend
  public listMessage() {
    this.messageService
      .getByUser(this.user.uid, this.client_id)
      .subscribe((resp: any) => {
        this.messages.set(resp);
        this.chatService.setMessages(resp); // Sincroniza el historial con el servicio de Sockets
      });
  }

  // Enviar mensaje unificado (HTTP para guardar + Socket para tiempo real)
 enviarMensaje() {
  if (!this.message.trim()) return;

  // 1. Creamos un objeto JSON común con los nombres exactos
  const data = {
    user_id: this.user.uid ,
    cliente_id: this.client_id,
    message: this.message
  };

  // 2. Enviamos el objeto directamente al servicio
  this.messageService.createMessage(data).subscribe({
    next: (resp: any) => {
      this.chatService.sendMessage(this.message, this.user.uid.toString(), this.client_id.toString());
      this.message = ''; 
    },
    error: (err) => {
      console.error(err);
    },
  });
}

  ngOnDestroy() {
    // Limpieza estricta de la suscripción para evitar memory leaks
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }

}
