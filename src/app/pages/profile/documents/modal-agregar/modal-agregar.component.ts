import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-modal-agregar',
    templateUrl: './modal-agregar.component.html',
    styleUrls: ['./modal-agregar.component.css'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SafeUrlPipe,
        TranslateModule
    ]
})
export class ModalAgregarComponent {
    @Input() closeReload!: () => void;
    @Input() documentForm!: FormGroup;
    @Input() isLoading!: boolean;
    @Input() vistaPreviaTemp!: string | null;
    @Input() esPdf!: boolean;
    @Input() archivoSubir!: File | null;

    @Input() cambiarImagen!: (event: Event) => void;
    @Input() save!: () => void;

constructor () {}
}

