import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent, 
    BackButtnComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  pageTitle= 'Settings';

}
