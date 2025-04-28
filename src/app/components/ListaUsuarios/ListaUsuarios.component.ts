import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, Input, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Profile } from '../../models/profile.model';
import { Speciality } from '../../models/speciality.model';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { SpecialitiesService } from '../../services/specialities.service';
import { UserService } from '../../services/usuario.service';
import { ProfileService } from '../../services/profile.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-ListaUsuarios',
    templateUrl: './ListaUsuarios.component.html',
    imports: [CommonModule, RouterModule, 
      NgIf, NgFor, ImagenPipe, LoadingComponent,
    InfiniteScrollDirective, TranslateModule],
    styleUrls: ['./ListaUsuarios.component.scss']
})
export class ListaUsuariosComponent {

  
    @Input() users: any[] = [];
    

    user: Usuario;
    speciality!: Speciality;
    Title!: string;

    loadingTitle!: string ;
    isLoading = false;
    isEdnOfList = false;
    
    isRefreshing = false;
    private startY: number = 0;
    private currentY: number = 0;
    currentPage = 1;
    itemsPerPage = 10;
    hasMore = true;

    nextUrl!:number ;



    
      constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private profileServices: ProfileService,
        private usersServices: UserService,
        
      ){
        this.user = this.authService.getUser();
      }
    
      ngOnInit() {
        
        this.getProfiles();
      }
    getProfiles() {
      this.isLoading = true;
      this.loadingTitle = 'Cargando usuarios...';
      this.usersServices.listUsers().subscribe((resp:any)=>{
        this.users = resp.users.data;
        this.nextUrl = resp.users.data.next_page_url;
        this.isLoading = false;
      });
    }

    onScrollDown(){
      if (!this.nextUrl || this.isLoading) return;
      this.usersServices.listUsers(this.itemsPerPage, this.nextUrl ).subscribe({
        next: (resp: any) => {
          if (resp.users.data.next_page_url) {
            this.nextUrl = resp.users.data.next_page_url;
            this.users = [...this.users, ...resp.results];
          } else {
            this.isEdnOfList = true;
            this.loadingTitle = 'No hay más personajes para mostrar';
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }

    onScrollUp(){
      this.refreshData(); 
    }

    trackByCharacterId: TrackByFunction<any>  = (index: number, character: any) => character.id;


      refreshData() { 
        this.isRefreshing = true; 
        // Simulate data fetching 
        setTimeout(() => { 
          this.isRefreshing = false; 
          // Update your data here 
          this.getProfiles();
        }, 2000); 
      }


  
}