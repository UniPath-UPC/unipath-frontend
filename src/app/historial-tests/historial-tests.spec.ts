import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialTestsComponent as HistorialTests } from './historial-tests';

describe('HistorialTests', () => {
  let component: HistorialTests;
  let fixture: ComponentFixture<HistorialTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialTests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialTests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
