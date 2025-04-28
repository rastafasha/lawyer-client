import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuariosComponent } from './ListaUsuarios.component';

describe('ListaUsuariosComponent', () => {
    let component: ListaUsuariosComponent;
    let fixture: ComponentFixture<ListaUsuariosComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ListaUsuariosComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListaUsuariosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});