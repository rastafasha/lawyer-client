import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu-footer.component.html',
  styleUrl: './menu-footer.component.css'
})
export class MenuFooterComponent {
  public user: Usuario;
  constructor(
      private authService: AuthService,
    ) {
      this.user = this.authService.getUser();
    }
}
