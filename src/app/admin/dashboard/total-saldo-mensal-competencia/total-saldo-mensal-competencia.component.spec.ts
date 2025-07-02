import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSaldoMensalCompetenciaComponent } from './total-saldo-mensal-competencia.component';

describe('TotalSaldoMensalCompetenciaComponent', () => {
  let component: TotalSaldoMensalCompetenciaComponent;
  let fixture: ComponentFixture<TotalSaldoMensalCompetenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalSaldoMensalCompetenciaComponent]
    });
    fixture = TestBed.createComponent(TotalSaldoMensalCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
