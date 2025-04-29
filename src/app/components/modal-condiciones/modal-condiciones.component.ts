import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;  
@Component({
  selector: 'app-modal-condiciones',
  imports: [TranslateModule],
  templateUrl: './modal-condiciones.component.html',
  styleUrls: ['./modal-condiciones.component.scss']
})
export class ModalCondicionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeReload(){
    $(".modal-backdrop").remove();
    this.ngOnInit();
  }

}
