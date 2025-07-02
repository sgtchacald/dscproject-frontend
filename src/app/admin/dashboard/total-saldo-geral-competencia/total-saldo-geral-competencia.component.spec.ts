import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSaldoGeralCompetenciaComponent } from './total-saldo-geral-competencia.component';

describe('TotalSaldoGeralCompetenciaComponent', () => {
  let component: TotalSaldoGeralCompetenciaComponent;
  let fixture: ComponentFixture<TotalSaldoGeralCompetenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalSaldoGeralCompetenciaComponent]
    });
    fixture = TestBed.createComponent(TotalSaldoGeralCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
