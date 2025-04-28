import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-lateral',
  imports: [],
  templateUrl: './lateral.component.html',
  styleUrl: './lateral.component.scss'
})
export class LateralComponent {
  user!: Usuario;
  profile!: Profile;
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
  ) {
    this.user = this.authService.getUser();
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    // this.getProfile();
  }


  getProfile(){
    this.profileService.getByUser(this.user.id).subscribe((resp:any) => {
      // console.log(resp);
      this.profile = resp.profile;
    })
  }
}
