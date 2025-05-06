import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/usuario.service';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Client } from '../../models/client.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  imports: [
    HeaderComponent,
    FormsModule,
    NgIf, NgFor, 
    BackButtnComponent, 
    ImagenPipe, 
    TranslateModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  public message:string = '';
  public messages:any =[];
  public user_selected!:any;

  pageTitle = 'Chat';

  public user!: Usuario;
  public user_id!: number;
  public client!: Client;
  public client_id!: number; 
  public profile!: Profile;
  public redessociales: RedesSociales[]= [];

  constructor( 
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private authService: AuthService,
    private messageService: MessageService,
  ){
    this.client = this.authService.getUser();
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe( ({id}) => this.getUserProfile(id));
    
  }

  public sendMessage() {
    if (this.message.length < 0) {
      return;
    }
    this.chatService.sendMessage(this.message);
    this.enviarMensaje(this.message);
    this.messages.push(this.message);
    this.message = '';
  }

  getUserProfile(id:string){
    this.profileService.getByUser(id).subscribe((resp:any)=>{
      this.profile = resp.profile;
      this.user_id = resp.profile.user_id;
      try {
        this.redessociales = typeof resp.profile.redessociales === 'string' 
          ? JSON.parse(resp.profile.redessociales) || []
          : resp.profile.redessociales || [];
      } catch (error) {
        console.error('Error parsing redessociales:', error);
        // this.redessociales = [];
      }
      console.log(this.redessociales);
    });
    setTimeout(() => {
      // this.listMessage();
    }, 1000);
    }


    public listMessage() {
      this.messageService
        .getByClient(this.client.id, this.user_id)
        .subscribe((resp: any) => {
          this.messages = resp;
          console.log(this.messages);
        });
    }
  
    enviarMensaje(data: any) {
      const formData = new FormData();
      formData.append('cliente_id', this.client.id + '');
      formData.append('user_id', this.user_id + '');
      formData.append('message', this.message);
  
      this.messageService.createMessage(formData).subscribe({
        next: (resp: any) => {
          this.message = resp;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  
}
