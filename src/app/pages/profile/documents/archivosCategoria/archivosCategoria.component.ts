import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-archivosCategoria',
    templateUrl: './archivosCategoria.component.html',
    styleUrls: ['./archivosCategoria.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterLink
    ]
})
export class ArchivosCategoriaComponent {
    @Input() cat!: any;
    @Input() user_filesfiltered!: any[];
    @Input() document_selected!: any;
    @Input() share!: any;

    @Input() deleteFile!: (id: any) => void;
    @Input() solicitudSelected!: (id: any) => void;
    @Input() onShareIt!: (docId: any) => void;

    @Input() clientes!: any[];

    constructor () {}
}