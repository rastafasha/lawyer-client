import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { Banner } from '../../models/banner.model';

@Component({
    selector: 'app-publicidad',
    templateUrl: './publicidad.component.html',
    styleUrls: ['./publicidad.component.css'],
    imports:[CommonModule, SkeletonLoaderComponent]
})
export class PublicidadComponent implements OnInit {

  public cargando: boolean = true;

  pubs!:Banner[];
  
  constructor(
    public publicidadService:BannerService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.publicidadService.getBannerActivos().subscribe((resp:any)=>{
      // console.log(resp);
      this.pubs = resp.pubs;
       this.cargando = false;
    })
  }
  

}
