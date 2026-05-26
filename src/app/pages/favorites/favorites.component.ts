import { Component, EventEmitter, HostListener, inject, Output, TrackByFunction } from '@angular/core';
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
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ProfileService } from '../../services/profile.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { RedessocialesComponent } from '../../shared/redessociales/redessociales.component';
declare var bootstrap: any;
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
    ImagenPipe,
    RouterLink,
    RedessocialesComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  pageTitle = 'Favorites';
  loadingTitle!: string;
  isRefreshing = false;
  isLoading = false;
  isEdnOfList = false;
  isLoadingFicha = false;
  searchForm!: FormGroup;
  name_file = '';
  user!: any;
  rol!: string;
  characters: Array<any> = [];
  favorites: Array<Favorite> = [];
  nextUrl: string = '';
  specialists!: Client[]
  usuario_selected: any;
  client: any;
  profile!: Profile;
  public redessociales!: RedesSociales[];

  private favoriteService = inject(FavoritoService);
  private clientService = inject(ClientService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.user = this.authService.getLocalStorage();
    this.favoritesByUser();
    this.validarFormularioPerfil();
    this.searchForm.reset();

    this.rol = this.user.role;
    // this.getCharactrs();
  }


  favoritesByUser() {
    this.clientService.getMySpecialists(this.user.uid).subscribe((resp: any) => {
      console.log('respuesta member', resp);
      this.specialists = resp.specialists;
    })
  }

  abrirDetalle(usuario: any) {
    this.usuario_selected = usuario;
    // 1. Abrir Offcanvas
    const el = document.getElementById('offcanvasFav');
    const bsOffcanvas = new bootstrap.Offcanvas(el);
    bsOffcanvas.show();
    this.getClienteContact();
  }

  getClienteContact() {
    this.isLoadingFicha = true;
    this.profileService.getByUser(this.usuario_selected).subscribe((resp: any) => {
      this.profile = resp;

      // this.client_id = this.client.uid;
      this.profile = resp.profile;
      this.redessociales = typeof resp.profile.redssociales === 'string'
        ? JSON.parse(resp[0].profile.redssociales) || []
        : resp.profile.redssociales || [];
      this.isLoadingFicha = false;
    })
  }




  deleteContact(cliente_selected: any) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.removeClient(cliente_selected).subscribe(
          response => {
            this.onClose();
            this.ngOnInit();
          }
        )
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.onClose();
        this.ngOnInit();
      }
    });
  }

  validarFormularioPerfil() {
    this.searchForm = this.fb.group({
      pais: [''],
      speciality_id: [''],
      name_file: [''],
      rating: [''],
      id: [''],
    });
  }


  getCharactrs() {
    this.isLoading = true;
    this.favoriteService.getCharacters().subscribe(
      (response: any) => {
        this.characters = response.results;
        this.nextUrl = response.info.next;
        this.isLoading = false;
      })
  }


  onScrollDown() {
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
      this.getCharactrs();
    }, 2000);
  }

  irAespecialista(usuario: any) {
    this.onClose();
    this.router.navigate(['/especialista/', usuario])
  }

  onClose() {
    // this.perfilForm.reset();

    // Dispara el cierre nativo de Bootstrap simulando un click
    const element = document.getElementById('offcanvasFav');

    if (element) {
      // Recupera o crea la instancia de Bootstrap y ejecuta la acción de ocultar
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(element) || new bootstrap.Offcanvas(element);
      bsOffcanvas.hide(); // 👈 Cierra el panel de forma animada y remueve el backdrop
    }

    this.closeModal.emit();
  }



}
