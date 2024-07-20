import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicoesFinanceirasComponent } from './instituicoes-financeiras.component';

describe('InstituicoesFinanceirasComponent', () => {
  let component: InstituicoesFinanceirasComponent;
  let fixture: ComponentFixture<InstituicoesFinanceirasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstituicoesFinanceirasComponent]
    });
    fixture = TestBed.createComponent(InstituicoesFinanceirasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
