import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoBanariaImportarComponent } from './transacao-banaria-importar.component';

describe('TransacaoBanariaImportarComponent', () => {
  let component: TransacaoBanariaImportarComponent;
  let fixture: ComponentFixture<TransacaoBanariaImportarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransacaoBanariaImportarComponent]
    });
    fixture = TestBed.createComponent(TransacaoBanariaImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
