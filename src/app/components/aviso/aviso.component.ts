import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aviso',
  imports: [RouterLink, NgIf, LoadingComponent, TranslateModule],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.css'
})
export class AvisoComponent {
  @Input() profile!: Profile;
  @Input() user!:  Usuario;
  user_id!: number;
  isLoading:boolean = false;
  isProfile:boolean = false;
  // public profile: Profile = new Profile();
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
  ) {
    this.user = this.authService.getUser();
  }
  ngOnInit() {
    this.user_id = this.user.id;
    this.getProfile();
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getByClient(this.user_id).subscribe({
      next: (res) => {
        this.profile = res.profile || null;
        // console.log(this.profile);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }
}
