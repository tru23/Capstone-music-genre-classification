import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrePredictorComponent } from './genre-predictor.component';

describe('GenrePredictorComponent', () => {
  let component: GenrePredictorComponent;
  let fixture: ComponentFixture<GenrePredictorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenrePredictorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenrePredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
