import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { Profile } from '../../models/profile.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpecialitiesService } from '../../services/specialities.service';
import { Speciality } from '../../models/speciality.model';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { RatingStarComponent } from '../../components/ratingStar/ratingStar.component';

@Component({
  selector: 'app-categoria',
  imports: [
    MenuFooterComponent,
    HeaderComponent,
    CommonModule,
    LateralComponent,
    BackButtnComponent,
    NgFor,
    RouterModule,
    ImagenPipe,
    LoadingComponent,
    InfiniteScrollDirective,
    TranslateModule,
    RatingStarComponent
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent {
  pageTitle = 'Especialidad';
  user!: any;
  profiles: Profile[] = [];
  speciality!: Speciality;
  Title!: string;
  public isLoading: boolean = false;
  loadingTitle!: string;
  isEdnOfList = false;
  isRefreshing = false;
  private startY: number = 0;
  private currentY: number = 0;
  hasMore = true;
  nextUrl!: number;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private activatedRoute: ActivatedRoute,
    private specialityService: SpecialitiesService,
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe(({ slug }) => {
      this.getSpeciality(slug);
    });
  }
  getSpeciality(slug: string) {
    this.isLoading = true;
    this.loadingTitle = 'Cargando especialidad';
    this.specialityService.getSpecialitywithUsers(slug).subscribe((resp: any) => {
      // console.log(resp);
      this.Title = resp.speciality.nombre;
      this.speciality = resp.speciality;
      this.profiles = resp.profiles;
      this.isLoading = false;
    });
  }
}
