import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDespesasPorCategoriaComponent } from './grafico-despesas-por-categoria.component';

describe('GraficoDespesasPorCategoriaComponent', () => {
  let component: GraficoDespesasPorCategoriaComponent;
  let fixture: ComponentFixture<GraficoDespesasPorCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoDespesasPorCategoriaComponent]
    });
    fixture = TestBed.createComponent(GraficoDespesasPorCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
