import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterLink } from '@angular/router';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { ProfileService } from '../../services/profile.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import { Speciality } from '../../models/speciality.model';
import { SpecialitiesService } from '../../services/specialities.service';
import { PipesModule } from '../../pipes/pipes.module';
import { ImagenPipe } from "../../pipes/imagen.pipe";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    MenuFooterComponent,
    LateralComponent,
    BackButtnComponent,
    ImagenPipe,
    LoadingComponent,
    TranslateModule
],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  pageTitle= 'Profile';
  public user!: Usuario;
  // public profile!: Profile;
  public speciality_profile!: Speciality;
  public speciality!: Speciality ;
  public isLoading:boolean = false;
    loadingTitle!:string;

  public profile: Profile = new Profile();
  public redessociales: RedesSociales [] =[];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private specialityService: SpecialitiesService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.user = this.authService.getUser();
    if(this.profile){
      // this.getProfile();

    }
  }

  getProfile(){
    this.isLoading = true;
    this.loadingTitle = 'Loading Profile...';
    this.profileService.getByClient(this.user.id).subscribe((resp:any) => {
      // console.log(resp);
      this.profile = resp.profile || null;
      this.redessociales = typeof resp.profile.redessociales === 'string' 
            ? JSON.parse(resp.profile.redessociales) || []
            : resp.profile.redessociales || [];
      this.speciality_profile = resp.profile.speciality_id;
      this.isLoading = false;
      // this.getSpeciality();
      // setTimeout(() => {
      // }
      // , 5000);
    })
  }

  getSpeciality(){
    this.specialityService.getSpeciality(this.speciality_profile).subscribe((resp:any) => {
      // console.log(resp);
      this.speciality = resp || null;

    })
  }

  logout() {
    this.authService.logout();
  }
}
