import { Component, TrackByFunction } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RatingStarComponent } from "../ratingStar/ratingStar.component";
@Component({
  selector: 'app-list-products',
  imports: [CommonModule, NgFor, RouterModule,
    ImagenPipe, LoadingComponent,
    InfiniteScrollDirective, TranslateModule, RatingStarComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  public isLoading: boolean = false;
  isEdnOfList = false;
  loadingTitle!: string;
  public usuarios!: Usuario[];
  itemsPerPage = 10;
  nextUrl!: number;
  isRefreshing = false;

  constructor(
    private profileService: ProfileService,
    private ususarioService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUsers();

  }

  getUsers() {
    this.isLoading = true;
    this.loadingTitle = 'Cargando Perfiles';
    this.ususarioService.listUsersMember().subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.nextUrl = resp.next_page_url;
      this.isLoading = false;
    })
  }
  

  onScrollDown() {
    if (!this.nextUrl || this.isLoading) return;
    this.profileService.getProfileRecientes(this.itemsPerPage, this.nextUrl).subscribe({
      next: (resp: any) => {
        if (resp.users.data.next_page_url) {
          this.nextUrl = resp.next_page_url;
          this.usuarios = [...this.usuarios, ...resp.results];
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

  onScrollUp() {
    this.refreshData();
  }

  trackByCharacterId: TrackByFunction<any> = (index: number, character: any) => character.id;


  refreshData() {
    this.isRefreshing = true;
    // Simulate data fetching 
    setTimeout(() => {
      this.isRefreshing = false;
      // Update your data here 
      this.getUsers();
    }, 2000);
  }

}
