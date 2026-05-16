import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../../../shared/loading/loading.component';

@Component({
    selector: 'app-archivosCategoria',
    templateUrl: './archivosCategoria.component.html',
    styleUrls: ['./archivosCategoria.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterLink,
        LoadingComponent
    ]
})
export class ArchivosCategoriaComponent {
    @Output() oncloseReload: EventEmitter<void> = new EventEmitter<void>();

    @Input() cat!: any;
    @Input() user_filesfiltered!: any[];
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
        this.oncloseReload.emit()
    }

    compartirArchivo(archivoId: any) {
        this.onShareItEvent.emit({
            documentId: archivoId,
            emailACompartir: this.share // Emits the raw string value captured by [(ngModel)]
        });
    }
}