import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/usuario.service';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Client } from '../../models/client.model';
import { NgFor, NgIf } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';

@Component({
  selector: 'app-chat',
  imports: [
    HeaderComponent,
    FormsModule,
    NgIf, NgFor, BackButtnComponent
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

  constructor( 
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
  ){

  }

  ngOnInit(){
    this.activatedRoute.params.subscribe( ({id}) => this.getUser(id));
    this.listMessage();
  }

  public sendMessage(){
    this.chatService.sendMessage(this.message);
    this.messages.push(this.message)
    this.message = '';
  }
  public listMessage(){
    // this.chatService.listMessage().subscribe((data:any)=>{
    //   console.log(data);
    //   this.messages.push(data.data);
    // })
  }

  getUser(id:string){
    this.userService.showUser(id).subscribe((resp:any)=>{
      this.user = resp;
      this.user_id = resp.id;
      console.log(this.user);
    })
      }
  
}
