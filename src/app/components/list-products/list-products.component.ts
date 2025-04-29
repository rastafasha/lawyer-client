import { Component, TrackByFunction } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-list-products',
  imports: [CommonModule, NgFor, RouterModule, 
    ImagenPipe, LoadingComponent,
    InfiniteScrollDirective, TranslateModule
  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  public isLoading:boolean = false;
  isEdnOfList = false;
  loadingTitle!:string;
 public profiles!: Profile[];

 itemsPerPage = 10;
 nextUrl!:number ;
 isRefreshing = false;

 constructor(
  private profileService: ProfileService,
)

{} 
ngOnInit(): void {
  this.getProfiles();

}

getProfiles(){
  this.isLoading = true;
  this.loadingTitle = 'Cargando Perfiles';
    this.profileService.getProfileRecientes().subscribe((resp:any) => {
      // console.log(resp);
      this.profiles = resp;
      this.nextUrl = resp.next_page_url;
      this.isLoading = false;
      
    })
  }

  onScrollDown(){
    if (!this.nextUrl || this.isLoading) return;
    this.profileService.getProfileRecientes(this.itemsPerPage, this.nextUrl ).subscribe({
      next: (resp: any) => {
        if (resp.users.data.next_page_url) {
          this.nextUrl = resp.next_page_url;
          this.profiles = [...this.profiles, ...resp.results];
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
