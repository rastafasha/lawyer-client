import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaHorizontalComponent } from './categoria-horizontal.component';

describe('CategoriaHorizontalComponent', () => {
  let component: CategoriaHorizontalComponent;
  let fixture: ComponentFixture<CategoriaHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
