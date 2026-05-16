import { Component, OnInit, EventEmitter, Output, Inject, Input } from '@angular/core'; // 1. Importa 'Inject'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-modal-agregar',
    templateUrl: './modal-agregar.component.html',
    styleUrls: ['./modal-agregar.component.css'],
    imports: [
        CommonModule,
        SafeUrlPipe,
        TranslateModule,
        ReactiveFormsModule
    ]
})
export class ModalAgregarComponent {
    @Input() isLoadingUpload: boolean = false;
    @Output() onGuardarDocumento = new EventEmitter<{ archivo: File, categoria: string }>();
    @Output() oncloseReload: EventEmitter<void> = new EventEmitter<void>();

    documentForm!: FormGroup;
    archivoSubir: File | null = null;
    vistaPreviaTemp: string | null = null;
    esPdf: boolean = false;

    constructor(
        @Inject(FormBuilder) private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.documentForm = this.fb.group({
            name_category: ['', Validators.required] // Validación local
        });
    }

    closeReload() {
        this.documentForm.reset();
        this.vistaPreviaTemp = null;
        this.oncloseReload.emit()
        this.ngOnInit();
    }

    cambiarImagen(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.archivoSubir = file;
        this.esPdf = file.type === 'application/pdf';

        // Generar vista previa local
        const reader = new FileReader();
        reader.onload = () => this.vistaPreviaTemp = reader.result as string;
        reader.readAsDataURL(file);
    }

    // Esta función se gatilla con el botón del HTML del hijo
    enviarAlPadre() {
        const categoria = this.documentForm.get('name_category')?.value;

        if (!categoria || categoria.trim() === '') {
            return; // Puedes manejar un alert local aquí
        }

        if (!this.archivoSubir) {
            return;
        }

        // Emitimos el archivo y la categoría hacia el padre
        this.onGuardarDocumento.emit({
            archivo: this.archivoSubir,
            categoria: categoria.trim()
        });
    }
}

