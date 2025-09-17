import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTestsComponent as ReporteTests } from './reporte-tests';

describe('ReporteTests', () => {
  let component: ReporteTests;
  let fixture: ComponentFixture<ReporteTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteTests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
