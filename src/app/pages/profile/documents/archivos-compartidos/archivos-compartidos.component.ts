import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../../shared/loading/loading.component';

@Component({
  selector: 'app-archivos-compartidos',
  imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterLink,
        LoadingComponent
    ],
  templateUrl: './archivos-compartidos.component.html',
  styleUrl: './archivos-compartidos.component.scss'
})
export class ArchivosCompartidosComponent {

  @Output() oncloseReload: EventEmitter<void> = new EventEmitter<void>();
  
      @Input() cat!: any;
      @Input() sharedFiles!: any[];
      @Input() document_selected!: any;
      @Input() share!: any;
      @Input() clientes!: any[];
      @Input() isLoadingList: boolean = false;
  
      // Cambiamos funciones por Emisores de Eventos
      @Output() onDeleteFile = new EventEmitter<any>();
      @Output() onSolicitudSelected = new EventEmitter<any>();
      @Output() onShareItEvent = new EventEmitter<any>();
  
       closeReload() {
          this.document_selected = null;
          this.sharedFiles = [];
          this.oncloseReload.emit()
      }
  
      compartirArchivo(archivoId: any) {
          this.onShareItEvent.emit({
              documentId: archivoId,
              emailACompartir: this.share // Emits the raw string value captured by [(ngModel)]
          });
      }

}
