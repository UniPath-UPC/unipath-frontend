import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadComponent as Universidad } from './universidad';

describe('Universidad', () => {
  let component: Universidad;
  let fixture: ComponentFixture<Universidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Universidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Universidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
