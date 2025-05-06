import { Component, inject, TrackByFunction } from '@angular/core';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { SliderHorizontalComponent } from '../../components/slider-horizontal/slider-horizontal.component';
import { ListProductsComponent } from '../../components/list-products/list-products.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FavoritoService } from '../../services/favorito.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaisService } from '../../services/pais.service';
import { Pais } from '../../models/pais';
import { Speciality } from '../../models/speciality.model';
import { SpecialitiesService } from '../../services/specialities.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-search',
  imports: [MenuFooterComponent, HeaderComponent, 
    LateralComponent, BackButtnComponent,
    InfiniteScrollDirective,
    LoadingComponent,NgFor,NgIf, TranslateModule,
    ReactiveFormsModule, FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  pageTitle= 'Directory';
  loadingTitle!:string;
  isRefreshing = false;
  isLoading = false;
  isEdnOfList = false;
  characters: Array<any> = [];
    nextUrl:string = '';
    search!:string;
    pais:string = '';
    name_file:string = '';
    speciality_id!:number;
    rating!:number;

    public paises :Pais[] = [];
    public specialities :Speciality[] = [];

    searchForm!:FormGroup;
    currentPage = 1;

  private favoriteService = inject(FavoritoService);
  private paisService = inject(PaisService);
  private specialityService = inject(SpecialitiesService);
  private fb = inject(FormBuilder);
  private placesServices = inject(PlacesService);

  // searchForm: FormGroup = new FormGroup({
  //   pais: new FormControl('', ),
  //   speciality_id: new FormControl('',),
  //   status: new FormControl('', ),

  //   });

  ngOnInit():void{
    window.scrollTo(0, 0);
    this.getCharactrs();
    this.getPaisesList();
    this.getSpecialitiesList();
    this.validarFormularioPerfil();
    this.searchForm.reset();
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
  
  onSearch(){
    const formValue = this.searchForm.value;
    console.log(this.searchForm.value);
    this.getdocumentsbyUserFilter();
    } 

    getdocumentsbyUserFilter(){
      this.isLoading = true;
      // this.currentPage;
      this.pais = this.searchForm.value.pais;
      this.speciality_id = this.searchForm.value.speciality_id;
      this.rating = this.searchForm.value.rating;
      this.specialityService.getAllClientReportByPatient(
        // this.currentPage,
        this.pais, 
        this.rating,
        this.speciality_id,
      ).subscribe((resp:any)=>{
        console.log(resp);
        this.isLoading = false;
       
      })
    }

    PageSize(): void {
      // this.pageSelection = [];
      // this.limit = this.pageSize;
      // this.skip = 0;
      // this.currentPage = 1;
      this.searchForm.reset();
      this.ngOnInit();
    }

  getPaisesList(): void {
    this.paisService.getPaises().subscribe(
      (res:any) =>{
        this.paises = res.paises;
        // console.log(res);
      }
    );
  }

  getSpecialitiesList(){
    this.specialityService.getSpecialitys().subscribe((resp:any)=>{
      this.specialities = resp;
      // console.log(resp);
    })
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

  trackByCharacterId: TrackByFunction<any>  = (index: number, character: any) => character.id;
  onScrollUp(){
    this.refreshData(); 
  }



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
