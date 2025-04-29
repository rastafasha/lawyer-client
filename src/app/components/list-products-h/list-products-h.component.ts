import { Component } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { SpecialitiesService } from '../../services/specialities.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-list-products-h',
  imports: [CommonModule, NgFor, RouterModule, ImagenPipe,
    NgIf,
    LoadingComponent, TranslateModule
  ],
  templateUrl: './list-products-h.component.html',
  styleUrl: './list-products-h.component.css'
})
export class ListProductsHComponent {
  public isLoading:boolean = false;
  public profiles!: Profile[];
  
   constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private specialityService: SpecialitiesService)
  {} 
  ngOnInit(): void {
    this.getProfiles();
  
  }
  
  getProfiles(){
    this.isLoading = true;
      this.profileService.getProfileDestacados().subscribe((resp:any) => {
        // console.log(resp);
        this.profiles = resp;
        this.isLoading = false;
      })
    }
  

}

