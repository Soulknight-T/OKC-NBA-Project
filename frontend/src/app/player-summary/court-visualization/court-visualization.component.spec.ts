import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtVisualizationComponent } from './court-visualization.component';

describe('CourtVisualizationComponent', () => {
  let component: CourtVisualizationComponent;
  let fixture: ComponentFixture<CourtVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtVisualizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
