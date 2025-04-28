import { Component, HostListener, inject, TrackByFunction } from '@angular/core';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { FavoritoService } from '../../services/favorito.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { Favorite } from '../../models/favorite.model';
import { Profile } from '../../models/profile.model';
import { ImagenPipe } from '../../pipes/imagen.pipe';

@Component({
  selector: 'app-favorites',
  imports: [
    MenuFooterComponent,
    HeaderComponent,
    CommonModule,
    LateralComponent,
    BackButtnComponent,
    LoadingComponent,
    InfiniteScrollDirective,
    TranslateModule,
    ReactiveFormsModule,
    ImagenPipe
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  pageTitle = 'Favorites';
  loadingTitle!:string;
  isRefreshing = false;
  isLoading = false;
  isEdnOfList = false;
  searchForm!: FormGroup;
  name_file ='';
  user!:Usuario;
    rol!:string;
    characters: Array<any> = [];
    favorites: Array<Favorite> = [];
    nextUrl:string = '';
    private favoriteService = inject(FavoritoService);
    private favoritesService = inject(FavoritesService);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);

    ngOnInit():void{
      window.scrollTo(0, 0);
      this.getCharactrs();
      this.validarFormularioPerfil();
      this.searchForm.reset();

    this.user = this.authService.getUser();
    this.rol = this.user.roles[0];
    console.log(this.rol);
    if(this.rol === 'MEMBER'){
      this.favoritesByUser();
    }
    if(this.rol === 'GUEST'){
      this.favoritesByCliente();
    }
    }

    validarFormularioPerfil(){
      this.searchForm = this.fb.group({
        pais: [''],
        speciality_id: [''],
        name_file: [''],
        rating: [''],
        id: [''],
      });
    }

    getCharactrs(){
      this.isLoading = true;
      this.favoriteService.getCharacters().subscribe(
        (response: any) => {
          this.characters = response.results;
          this.nextUrl = response.info.next;
          this.isLoading = false;
      })
    }


    favoritesByUser(){
      this.favoritesService.getByUser(this.user.id).subscribe((resp:any)=>{
        console.log('respuesta member',resp);
        this.favorites = resp;
      })
    }
    favoritesByCliente(){
      this.favoritesService.getByCliente(this.user.id).subscribe((resp:any)=>{
        console.log('respuesta guest',resp);
        this.favorites = resp.favorites.data;
        console.log('favorites guest',this.favorites);

      })
    }


    onScrollDown(){
      if (!this.nextUrl || this.isLoading) return;
      this.favoriteService.getCharacters(this.nextUrl).subscribe({
        next: (resp: any) => {
          if (resp.info.next) {
            this.nextUrl = resp.info.next;
            this.characters = [...this.characters, ...resp.results];
          } else {
            this.isEdnOfList = true;
            this.loadingTitle = 'No hay más personajes para mostrar';
            alert('ultima pagina');
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
          this.getCharactrs();
        }, 2000); 
      }
      
      

  }
