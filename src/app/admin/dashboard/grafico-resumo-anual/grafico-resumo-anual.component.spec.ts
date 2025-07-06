import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoResumoAnualComponent } from './grafico-resumo-anual.component';

describe('GraficoResumoAnualComponent', () => {
  let component: GraficoResumoAnualComponent;
  let fixture: ComponentFixture<GraficoResumoAnualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoResumoAnualComponent]
    });
    fixture = TestBed.createComponent(GraficoResumoAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
