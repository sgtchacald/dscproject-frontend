import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsqueciASenhaComponent } from './esqueci-a-senha.component';

describe('EsqueciASenhaComponent', () => {
  let component: EsqueciASenhaComponent;
  let fixture: ComponentFixture<EsqueciASenhaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsqueciASenhaComponent]
    });
    fixture = TestBed.createComponent(EsqueciASenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
