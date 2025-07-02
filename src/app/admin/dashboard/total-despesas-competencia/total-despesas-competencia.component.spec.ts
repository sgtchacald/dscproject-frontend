import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDespesasCompetenciaComponent } from './total-despesas-competencia.component';

describe('TotalDespesasCompetenciaComponent', () => {
  let component: TotalDespesasCompetenciaComponent;
  let fixture: ComponentFixture<TotalDespesasCompetenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalDespesasCompetenciaComponent]
    });
    fixture = TestBed.createComponent(TotalDespesasCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
