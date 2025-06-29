import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadesCarreraComponent as UniversidadesCarrera } from './universidades-carrera';

describe('UniversidadesCarrera', () => {
  let component: UniversidadesCarrera;
  let fixture: ComponentFixture<UniversidadesCarrera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversidadesCarrera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversidadesCarrera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
