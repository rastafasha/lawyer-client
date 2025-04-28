import { Component } from '@angular/core';
import { Speciality } from '../../models/speciality.model';
import { SpecialitiesService } from '../../services/specialities.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-categoria-horizontal',
  imports: [NgFor, RouterModule, NgIf,  
    CommonModule,
     LoadingComponent
    ],
  templateUrl: './categoria-horizontal.component.html',
  styleUrl: './categoria-horizontal.component.css'
})
export class CategoriaHorizontalComponent {
  public isLoading:boolean = false;
  public specialities: Speciality[]= [];
  user!: Usuario;
  constructor(
    private specialitiesService: SpecialitiesService,
    private authService: AuthService
  ) {
    // this.user = this.authService.getUser();
   }

ngOnInit() {
  this.isLoading = true;
  this.specialitiesService.getSpecialitysMayorCero().subscribe((resp:any) => {
    this.specialities = resp.data;
    this.isLoading = false;
  });
}
}
