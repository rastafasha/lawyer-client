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

@Component({
  selector: 'app-chat',
  imports: [
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  public message:string = '';
  public messages:any =[];
  public user_selected!:any;

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
    this.activatedRoute.params.subscribe( ({id}) => this.getUserProfile(id));
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

  
  getUserProfile(id:string){
    // this.isLoading = true;
    if (!id == null || !id == undefined || id) {
      this.profileService.getByUser(id).subscribe(
        (res:any) => {
          this.user_selected = res;
          // console.log(res);

          // this.ageRange = res.preferencia_edad;
          // this.distanceRange = res.preferencia_distancia;
          // // console.log('user_selected',this.user_selected);
          // this.isLoading = false;

        }

      );
    } else {
      // this.pageTitle = 'Crear Perfil';
    }

  }
}
