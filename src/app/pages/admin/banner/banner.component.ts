import { CommonModule } from '@angular/common';
import { Component, TrackByFunction } from '@angular/core';
import { LateralComponent } from '../../../components/lateral/lateral.component';
import { ListProductsInternoComponent } from '../../../components/list-products-interno/list-products-interno.component';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { Banner } from '../../../models/banner.model';
import { BannerService } from '../../../services/banner.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagenPipe } from '../../../pipes/imagen.pipe';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;  

@Component({
  selector: 'app-banner',
  imports: [
    MenuFooterComponent,
    HeaderComponent,
    CommonModule,
    LateralComponent,
    BackButtnComponent,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    InfiniteScrollDirective,
    TranslateModule
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  pageTitle = 'Banners';
  isLoading:boolean = false;
  loadingTitle!:string;

    isEdnOfList = false;
    
    isRefreshing = false;
    private startY: number = 0;
    private currentY: number = 0;
    currentPage = 1;
    itemsPerPage = 10;
    hasMore = true;

    nextUrl!:number ;

  public FILE_AVATAR:any;
  public IMAGE_PREVISUALIZA:any = 'assets/img/user-06.jpg';

  public text_success = '';
  public text_validation = '';
  public publicidad_selected:any;
  public publicidadLists:Banner[] = [];
  public publicidadd!:Banner;

  constructor(
    public bannerService: BannerService
    ){

  }
  ngOnInit() {
    window.scrollTo(0, 0);
    this.getTableData();
    
  }

  

  private getTableData(page=1): void {
    this.publicidadLists = [];
    this.isLoading = true;
    this.loadingTitle = 'Cargando datos';
    this.bannerService.getBanners().subscribe((resp:any)=>{
      this.publicidadLists = resp.data;
      this.nextUrl = resp.data.next_page_url;
      this.isLoading = false;
    })
  }


  cambiarStatus(data:any){
    const VALUE = data.status;
    console.log(VALUE);
    
    this.bannerService.updateStatus(data, data.id).subscribe(
      (resp:any) =>{
        Swal.fire('Actualizado', `actualizado correctamente`, 'success');
        
        this.getTableData();
      }
    )
  }

  deletePublicidad(){

    this.bannerService.deleteBanner(this.publicidad_selected.id).subscribe((resp:any) => {
      // console.log(resp);
      const INDEX = this.publicidadLists.findIndex((item:any) => item.id == this.publicidad_selected.id);
      if(INDEX != -1){
        this.publicidadLists.splice(INDEX,1);

        $('#delete_publicidad').hide();
        $("#delete_publicidad").removeClass("show");
        $(".modal-backdrop").remove();
        $("body").removeClass();
        $("body").removeAttr("style");

        this.publicidad_selected = null;
      }
    })
  }

  loadFile($event:any){
    if($event.target.files[0].type.indexOf("image")){
      this.text_validation = 'Solamente pueden ser archivos de tipo imagen';
      return;
    }
    this.text_validation = '';
    this.FILE_AVATAR = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = ()=> this.IMAGE_PREVISUALIZA = reader.result;
  }

  addPublicidad(){
    this.text_success = " ";
    const formData = new FormData();
    formData.append('imagen', this.FILE_AVATAR);

    this.bannerService.createBanner(formData).subscribe((resp:any) => {
      // console.log(resp);
      const INDEX = this.publicidadLists.findIndex((item:any) => item.id == this.publicidad_selected.id);
      // this.text_success = "La publicidad se registró correctamente";
      if(INDEX != -1){
        this.publicidadLists.splice(INDEX,1);


        
        $('#add_publicidad').hide();
        $("#add_publicidad").removeClass("show");
        $(".modal-backdrop").remove();
        $("body").removeClass();
        $("body").removeAttr("style");
      }
    })
    this.publicidad_selected = null;
    this.text_success = "La publicidad se Creo correctamente";
    this.closeReload();
  }
  editPublicidad(publicidad:any){
    this.text_success = " ";
    const formData = new FormData();
    formData.append('imagen', this.FILE_AVATAR);
    // formData.append('id', this.publicidad_id);

    this.bannerService.updateBanner(formData, publicidad.id).subscribe((resp:any) => {
      // console.log(resp);
      const INDEX = this.publicidadLists.findIndex((item:any) => item.id == this.publicidad_selected.id);
      if(INDEX != -1){
        this.publicidadLists.splice(INDEX,1);
        
        $('#edit_publicidad').hide();
        $("#edit_publicidad").removeClass("show");
        $(".modal-backdrop").remove();
        $("body").removeClass();
        $("body").removeAttr("style");
        
        this.publicidad_selected = null;
        this.text_success = "La publicidad se Actualizó correctamente";
        this.FILE_AVATAR = null;
        this.IMAGE_PREVISUALIZA = null;
        this.getTableData();
      }
    })
  }

  closeReload(){
    this.publicidad_selected = null;
    this.FILE_AVATAR = null;
        this.IMAGE_PREVISUALIZA = null;
    this.ngOnInit();
  }

  selectPublicidad(publicidad:any){
    this.publicidad_selected = publicidad;
    this.IMAGE_PREVISUALIZA = this.publicidad_selected.avatar;
    // console.log(this.IMAGE_PREVISUALIZA);
    this.publicidad_selected.id;
    // this.getPublicidad();
  }

  getPublicidad(){
    this.bannerService.getBanner(this.publicidad_selected.id).subscribe((resp:any)=>{
      console.log(resp);
      this.publicidadd = resp.publicidad;
    })
  }


  onScrollDown(){
    if (!this.nextUrl || this.isLoading) return;
    this.bannerService.getBanners(this.itemsPerPage, this.nextUrl ).subscribe({
      next: (resp: any) => {
        if (resp.users.data.next_page_url) {
          this.nextUrl = resp.data.next_page_url;
          this.publicidadLists = [...this.publicidadLists, ...resp.results];
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
        this.getTableData();
      }, 2000); 
    }

}
