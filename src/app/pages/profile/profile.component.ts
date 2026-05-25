import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterLink } from '@angular/router';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile, RedesSociales } from '../../models/profile.model';
import { Speciality } from '../../models/speciality.model';
import { SpecialitiesService } from '../../services/specialities.service';
import { ImagenPipe } from "../../pipes/imagen.pipe";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { PushNotificationService } from '../../services/push-notification.service';
import { RedessocialesComponent } from "../../shared/redessociales/redessociales.component";

@Component({
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    MenuFooterComponent,
    BackButtnComponent,
    ImagenPipe,
    LoadingComponent,
    TranslateModule,
    RedessocialesComponent
],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  pageTitle = 'Profile';
  public user!: any;
  public speciality_profile!: Speciality;
  public speciality!: Speciality;
  public isLoading: boolean = false;
  loadingTitle!: string;

  public profile!: Profile;
  public redessociales: RedesSociales[] = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private specialityService: SpecialitiesService,
    public pushService: PushNotificationService,
  ) {
    this.user = this.authService.getLocalStorage();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getProfile();
  }

  getProfile() {
    this.isLoading = true;
    this.loadingTitle = 'Loading Profile...';
    this.profileService.getByUser(this.user.uid).subscribe((resp: any) => {
      // console.log(resp);
      this.profile = resp.profile || null;
      this.redessociales = typeof resp.profile.redssociales === 'string'
        ? JSON.parse(resp.profile.redssociales) || []
        : resp.profile.redssociales || [];
      this.speciality_profile = resp.profile.speciality_id;
      this.isLoading = false;
    })
  }


  logout() {
    this.authService.logout();
  }

   async togglePush() {
    this.pushService.isProcessing$.next(true); // Activa el cargando

    try {
      const estaSuscrito = this.pushService.isSubscribed$.value;
      if (estaSuscrito) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          // Llamada opcional a tu backend para limpiar
          this.pushService.setSubscriptionStatus(false);
        }
      } else {
        await this.pushService.subscribeToNotifications();
      }
    } finally {
      this.pushService.isProcessing$.next(false); // Desactiva el cargando
    }
  }
}
