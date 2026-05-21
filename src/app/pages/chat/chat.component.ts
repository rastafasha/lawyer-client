import { Component, OnInit, OnDestroy, signal, ElementRef, viewChild, effect } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/usuario.service';
import { ProfileService } from '../../services/profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { Subscription } from 'rxjs';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  imports: [
    ImagenPipe, BackButtnComponent,
    ReactiveFormsModule, HeaderComponent,
    NgClass, FormsModule, CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  private messagesContainer = viewChild<ElementRef>('messagesList');

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
  public messages = signal<Message[]>([]);

  private chatSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private messageService: MessageService,
    private authService: AuthService
  ) {

    effect(() => {
      this.messages(); // Registramos la dependencia de la Signal
      this.scrollToBottom();
    });
  }

  ngOnInit() {
  this.user = this.authService.getLocalStorage();

  // Escuchar parámetros de la URL para actualizar el chat dinámicamente
  this.activatedRoute.params.subscribe(({ id }) => {
    // 1. Limpiamos la pantalla inmediatamente para que no se vean los mensajes del chat anterior
    this.messages.set([]); 
    
    // 2. Seteamos el nuevo ID del cliente receptor
    this.client_id = id; 

    // 3. Cargamos el perfil de la nueva persona
    this.getUserProfile(id);

    // 4. ¡CRUCIAL!: Cargamos el historial de mensajes de este nuevo chat
    this.listMessage();
  });

  // Escuchar los mensajes en tiempo real (Sockets)
  this.chatSub = this.chatService.messages$.subscribe(msgs => {
    this.messages.set(msgs);
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

    const data = {
      user_id: this.user.uid,
      cliente_id: this.client_id,
      message: this.message
    };

    // 1. Guardamos en la base de datos por HTTP
    this.messageService.createMessage(data).subscribe({
      next: (resp: any) => {

        // 2. Al grabarse con éxito, notificamos al Socket.
        // El Socket se encargará de avisarle al servidor, actualizar el array global y retransmitir.
        this.chatService.sendMessage(this.message, this.user.uid.toString(), this.client_id.toString());

        // 3. LIMPIAMOS EL INPUT DE INMEDIATO
        this.message = '';
      },
      error: (err) => console.error('Error al guardar mensaje:', err)
    });
  }



  ngOnDestroy() {
    // Limpieza estricta de la suscripción para evitar memory leaks
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }
  private scrollToBottom() {
    setTimeout(() => {
      const container = this.messagesContainer()?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50); // Pequeño delay para esperar que el DOM se renderice
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


}
