import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import {TranslateService} from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule,ImagenPipe, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  year: number = new Date().getFullYear();
  public user: Usuario;
  public profile: Profile = new Profile();
  langs: string[] = [];
  public activeLang = 'es';

  flag = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private translate: TranslateService
  ) {
    this.user = this.authService.getUser();
    // this.translate.setDefaultLang('es');
    this.translate.setDefaultLang(this.activeLang);
    this.translate.use('es');
    this.translate.addLangs(["es", "en"]);
    this.langs = this.translate.getLangs();
    
    // console.log(this.translate);
  }

  
  
  ngOnInit(): void {
    this.authService.getLocalDarkMode();
    this.user = this.authService.getUser();
    // this.getProfile();
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.activeLang = lang;
      this.translate.use(lang);
      }
  }

  public cambiarLenguaje(lang:any) {
    this.activeLang = lang;
    this.translate.use(lang);
    this.flag = !this.flag;
    localStorage.setItem('lang', this.activeLang);
  }

  getProfile() {
    this.profileService.getByClient(this.user.id).subscribe((resp:any) => {
      this.profile = resp.profile ? resp.profile : null;
    });
  }

  openMenu() {
    const menuLateral = document.getElementsByClassName("sidemenu");
    for (let i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.add("active");
    }
  }

  closeMenu() {
    const menuLateral = document.getElementsByClassName("sidemenu");
    for (let i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");
    }
  }

  logout() {
    this.authService.logout();
  }

  onDarkMode(dark:string){
    var element = document.body;

    const classExists = document.getElementsByClassName(
      'darkmode'
     ).length > 0;

    var dayNight = document.getElementsByClassName("site");
      for (var i = 0; i<dayNight.length; i++) {
        // dayNight[i].classList.toggle("darkmode");
        element.classList.toggle("darkmode");

      }
      // localStorage.setItem('dark', dark);

      if (classExists) {
        localStorage.removeItem('darkmode');
        // console.log('✅ class exists on page, removido');
      } else {
        localStorage.setItem('darkmode', dark);
        // console.log('⛔️ class does NOT exist on page, agregado');
      }
      // console.log('Pulsado');
  }

}
