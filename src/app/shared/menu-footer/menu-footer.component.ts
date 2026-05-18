import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-footer',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './menu-footer.component.html',
  styleUrl: './menu-footer.component.css'
})
export class MenuFooterComponent {
  public user: any;
  constructor(
      private authService: AuthService,
    ) {
      this.user = this.authService.getLocalStorage();
    }
}
