import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosCategoriaComponent } from './archivosCategoria.component';

describe('ArchivosCategoriaComponent', () => {
    let component: ArchivosCategoriaComponent;
    let fixture: ComponentFixture<ArchivosCategoriaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ArchivosCategoriaComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArchivosCategoriaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});