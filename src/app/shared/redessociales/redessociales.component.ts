import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RedesSociales } from '../../models/profile.model';

@Component({
  selector: 'app-redessociales',
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './redessociales.component.html',
  styleUrl: './redessociales.component.scss'
})
export class RedessocialesComponent {
@Input() redessociales!:RedesSociales[]
}
