import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductsInternoComponent } from './list-products-interno.component';

describe('ListProductsInternoComponent', () => {
  let component: ListProductsInternoComponent;
  let fixture: ComponentFixture<ListProductsInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProductsInternoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProductsInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
