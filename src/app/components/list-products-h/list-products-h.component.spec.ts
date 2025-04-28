import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductsHComponent } from './list-products-h.component';

describe('ListProductsHComponent', () => {
  let component: ListProductsHComponent;
  let fixture: ComponentFixture<ListProductsHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProductsHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProductsHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
