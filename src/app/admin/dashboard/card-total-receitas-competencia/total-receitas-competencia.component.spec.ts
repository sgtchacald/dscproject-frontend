import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalReceitasCompetenciaComponent } from './total-receitas-competencia.component';

describe('TotalReceitasCompetenciaComponent', () => {
  let component: TotalReceitasCompetenciaComponent;
  let fixture: ComponentFixture<TotalReceitasCompetenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalReceitasCompetenciaComponent]
    });
    fixture = TestBed.createComponent(TotalReceitasCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
