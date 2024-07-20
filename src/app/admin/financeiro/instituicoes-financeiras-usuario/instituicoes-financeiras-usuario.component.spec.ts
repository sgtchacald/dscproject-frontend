import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicoesFinanceirasUsuarioComponent } from './instituicoes-financeiras-usuario.component';

describe('InstituicoesFinanceirasUsuarioComponent', () => {
  let component: InstituicoesFinanceirasUsuarioComponent;
  let fixture: ComponentFixture<InstituicoesFinanceirasUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstituicoesFinanceirasUsuarioComponent]
    });
    fixture = TestBed.createComponent(InstituicoesFinanceirasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
