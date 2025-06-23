import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasImportarComponent } from './despesas-importar.component';

describe('DespesasImportarComponent', () => {
  let component: DespesasImportarComponent;
  let fixture: ComponentFixture<DespesasImportarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DespesasImportarComponent]
    });
    fixture = TestBed.createComponent(DespesasImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
