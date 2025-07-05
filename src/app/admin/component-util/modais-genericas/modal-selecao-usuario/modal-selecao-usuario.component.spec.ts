import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelecaoUsuarioComponent } from './modal-selecao-usuario.component';

describe('ModalSelecaoUsuarioComponent', () => {
  let component: ModalSelecaoUsuarioComponent;
  let fixture: ComponentFixture<ModalSelecaoUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSelecaoUsuarioComponent]
    });
    fixture = TestBed.createComponent(ModalSelecaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
