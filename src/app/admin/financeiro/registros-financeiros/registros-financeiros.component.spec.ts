import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosFinanceirosComponent } from './registros-financeiros.component';

describe('RegistrosFinanceirosComponent', () => {
  let component: RegistrosFinanceirosComponent;
  let fixture: ComponentFixture<RegistrosFinanceirosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrosFinanceirosComponent]
    });
    fixture = TestBed.createComponent(RegistrosFinanceirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
