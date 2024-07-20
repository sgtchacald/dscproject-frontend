import { TestBed } from '@angular/core/testing';

import { InstituicaoFinanceiraUsuarioService } from './instituicao-financeira-usuario.service';

describe('InstituicaoFinanceiraUsuarioService', () => {
  let service: InstituicaoFinanceiraUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituicaoFinanceiraUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
