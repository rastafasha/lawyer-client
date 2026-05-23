import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBuscadorComponent } from './filtro-buscador.component';

describe('FiltroBuscadorComponent', () => {
  let component: FiltroBuscadorComponent;
  let fixture: ComponentFixture<FiltroBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroBuscadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
