import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderHorizontalComponent } from './slider-horizontal.component';

describe('SliderHorizontalComponent', () => {
  let component: SliderHorizontalComponent;
  let fixture: ComponentFixture<SliderHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
